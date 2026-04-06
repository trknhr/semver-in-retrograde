import {
  detectBuildTools,
  detectFrameworks,
  detectTestTools,
} from "@/lib/detect-archetypes";
import {
  manifestFeaturesSchema,
  type ManifestFeatures,
} from "@/lib/schemas";

export type UnsupportedManifestKind = "python" | "ruby";

type ParseSuccess<T> = {
  ok: true;
  value: T;
};

type ParseFailure = {
  ok: false;
  error: string;
};

type ParseResult<T> = ParseSuccess<T> | ParseFailure;

type PackageJsonLike = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringRecord(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => typeof entryValue === "string")
      .map(([entryKey, entryValue]) => [entryKey, entryValue as string]),
  );
}

function countEntries(value: unknown) {
  return isRecord(value) ? Object.keys(value).length : 0;
}

function countWorkspaceHints(value: unknown) {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (isRecord(value) && Array.isArray(value.packages)) {
    return value.packages.length;
  }

  return 0;
}

function isPackageJsonLike(manifest: PackageJsonLike) {
  const likelyKeys = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
    "scripts",
    "name",
    "version",
    "packageManager",
  ];

  return likelyKeys.some((key) => key in manifest);
}

function countVersions(record: Record<string, string>, predicate: (value: string) => boolean) {
  return Object.values(record).filter(predicate).length;
}

function normalizeVersion(value: string) {
  return value.trim().toLowerCase();
}

function isWildcardVersion(value: string) {
  const normalized = normalizeVersion(value);
  return (
    normalized === "*" ||
    normalized === "x" ||
    normalized === "latest" ||
    /\bx\b/.test(normalized) ||
    /\*/.test(normalized)
  );
}

function isLatestTag(value: string) {
  return normalizeVersion(value) === "latest";
}

function isCaret(value: string) {
  return normalizeVersion(value).startsWith("^");
}

function isTilde(value: string) {
  return normalizeVersion(value).startsWith("~");
}

function isPinned(value: string) {
  const normalized = normalizeVersion(value);
  return /^\d+\.\d+\.\d+([-+][\w.-]+)?$/.test(normalized);
}

function countSuspiciousScripts(scripts: Record<string, string>) {
  const suspiciousPatterns = [
    /postinstall/i,
    /\bcurl\b/i,
    /\bwget\b/i,
    /\bpatch-package\b/i,
    /\brm -rf\b/i,
    /\bchmod\b/i,
  ];

  return Object.values(scripts).filter((script) =>
    suspiciousPatterns.some((pattern) => pattern.test(script)),
  ).length;
}

function countPrePostScripts(scripts: Record<string, string>) {
  return Object.keys(scripts).filter((name) => /^(pre|post)/i.test(name)).length;
}

export function detectUnsupportedManifest(
  source: string,
): UnsupportedManifestKind | null {
  const trimmed = source.trim();

  const rubySignals = [
    /^source ["']https:\/\/rubygems\.org/m,
    /^\s*gem ["']/m,
    /^\s*ruby ["']/m,
  ];

  if (rubySignals.some((pattern) => pattern.test(trimmed))) {
    return "ruby";
  }

  const pythonSignals = [
    /^\s*[a-z0-9_.-]+\s*(==|>=|<=|~=|!=)\s*[^\s#]+/im,
    /^\s*-r\s+\S+/m,
    /^\s*(pip|setuptools|wheel)(==|>=|<=|~=|!=)/im,
  ];

  if (pythonSignals.some((pattern) => pattern.test(trimmed))) {
    return "python";
  }

  return null;
}

export function buildTeapotPayload(kind: UnsupportedManifestKind) {
  return {
    title: "Ceremonial teapot escalation",
    error:
      kind === "python"
        ? "This input appears to be a requirements.txt. The dependency oracle only reads package.json and refuses to improvise across ecosystems."
        : "This input appears to be a Gemfile. The dependency oracle recognizes the form, respects the craft, and serves tea instead of analysis.",
    kind,
  };
}

export function parseManifestJson(source: string): ParseResult<PackageJsonLike> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch {
    return {
      ok: false,
      error: "Input is not valid JSON. The boardroom cannot align around malformed punctuation.",
    };
  }

  if (!isRecord(parsed)) {
    return {
      ok: false,
      error: "package.json must parse into a JSON object.",
    };
  }

  if (!isPackageJsonLike(parsed)) {
    return {
      ok: false,
      error: "JSON parsed successfully, but it does not resemble a package.json manifest.",
    };
  }

  return {
    ok: true,
    value: parsed,
  };
}

export function extractManifestFeatures(
  manifest: PackageJsonLike,
): ParseResult<ManifestFeatures> {
  const dependencies = toStringRecord(manifest.dependencies);
  const devDependencies = toStringRecord(manifest.devDependencies);
  const peerDependencies = toStringRecord(manifest.peerDependencies);
  const optionalDependencies = toStringRecord(manifest.optionalDependencies);
  const scripts = toStringRecord(manifest.scripts);
  const combinedDependencies = {
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
    ...optionalDependencies,
  };

  const features = manifestFeaturesSchema.safeParse({
    name: typeof manifest.name === "string" ? manifest.name : null,
    private: manifest.private === true,
    packageManager:
      typeof manifest.packageManager === "string" ? manifest.packageManager : null,
    dependencyCount: Object.keys(dependencies).length,
    devDependencyCount: Object.keys(devDependencies).length,
    peerDependencyCount: Object.keys(peerDependencies).length,
    optionalDependencyCount: Object.keys(optionalDependencies).length,
    overrideCount: countEntries(manifest.overrides),
    resolutionCount: countEntries(manifest.resolutions),
    scriptCount: Object.keys(scripts).length,
    hasTestScript: "test" in scripts,
    hasPostinstall: "postinstall" in scripts,
    wildcardVersionCount: countVersions(combinedDependencies, isWildcardVersion),
    caretVersionCount: countVersions(combinedDependencies, isCaret),
    tildeVersionCount: countVersions(combinedDependencies, isTilde),
    latestTagCount: countVersions(combinedDependencies, isLatestTag),
    workspaceHints: countWorkspaceHints(manifest.workspaces),
    pinnedVersionCount: countVersions(combinedDependencies, isPinned),
    totalDependencyEntries: Object.keys(combinedDependencies).length,
    prePostScriptCount: countPrePostScripts(scripts),
    suspiciousScriptCount: countSuspiciousScripts(scripts),
    frameworks: detectFrameworks(combinedDependencies),
    testTools: detectTestTools(combinedDependencies),
    buildTools: detectBuildTools(combinedDependencies),
  });

  if (!features.success) {
    return {
      ok: false,
      error: "Manifest feature extraction failed.",
    };
  }

  return {
    ok: true,
    value: features.data,
  };
}

export type { ManifestFeatures };
