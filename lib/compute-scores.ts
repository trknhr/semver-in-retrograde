import { auraScoresSchema, type AuraScores, type ManifestFeatures } from "@/lib/schemas";

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value);
}

export function computeScores(features: ManifestFeatures): AuraScores {
  const totalDependencies = Math.max(features.totalDependencyEntries, 1);
  const pinnedRatio = features.pinnedVersionCount / totalDependencies;
  const versionVolatility =
    features.wildcardVersionCount * 18 +
    features.latestTagCount * 22 +
    features.caretVersionCount * 2 +
    features.tildeVersionCount * 3;

  const auraStability = round(
    clamp(
      40 +
        pinnedRatio * 55 -
        versionVolatility * 0.35 -
        features.prePostScriptCount * 4 -
        features.overrideCount * 3 -
        Math.max(features.scriptCount - 5, 0) * 2,
    ),
  );

  const chaosIndex = round(
    clamp(
      12 +
        features.wildcardVersionCount * 20 +
        features.latestTagCount * 24 +
        features.prePostScriptCount * 11 +
        (features.hasPostinstall ? 20 : 0) +
        Math.max(features.scriptCount - 4, 0) * 4 +
        features.workspaceHints * 5 +
        features.suspiciousScriptCount * 6,
    ),
  );

  const peerDependencyTension = round(
    clamp(
      features.peerDependencyCount * 18 +
        features.optionalDependencyCount * 6 +
        (features.frameworks.length > 1 ? 10 : 0) +
        (features.overrideCount > 0 ? 8 : 0),
    ),
  );

  const boundaryIssues = round(
    clamp(
      features.overrideCount * 24 +
        features.resolutionCount * 24 +
        features.workspaceHints * 7 +
        (features.private ? 8 : 0),
    ),
  );

  const trustIssues = round(
    clamp(
      (features.private ? 36 : 10) +
        (features.hasPostinstall ? 18 : 0) +
        features.latestTagCount * 7 +
        features.suspiciousScriptCount * 9,
    ),
  );

  const mercurySeverity = round(
    clamp(
      features.prePostScriptCount * 18 +
        (features.hasPostinstall ? 24 : 0) +
        features.suspiciousScriptCount * 12,
    ),
  );

  const mercuryStatus =
    mercurySeverity >= 70
      ? "Mercury in Nodegrade"
      : mercurySeverity >= 35
        ? "Mercury Retrograde"
        : "Mercury Direct";

  return auraScoresSchema.parse({
    auraStability,
    chaosIndex,
    peerDependencyTension,
    boundaryIssues,
    trustIssues,
    mercurySeverity,
    mercuryStatus,
  });
}

export function describeScore(value: number) {
  if (value >= 70) {
    return "severe";
  }

  if (value >= 45) {
    return "elevated";
  }

  return "contained";
}

export function describeDirection(
  direction: "positive" | "negative",
  value: number,
) {
  if (direction === "positive") {
    if (value >= 70) {
      return "strong";
    }

    if (value >= 45) {
      return "recoverable";
    }

    return "fragile";
  }

  if (value >= 70) {
    return "critical";
  }

  if (value >= 45) {
    return "present";
  }

  return "contained";
}

export type { AuraScores };
