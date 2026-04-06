import type { ManifestFeatures } from "@/lib/schemas";

const FRAMEWORK_SIGNATURES = [
  { label: "Next.js", packages: ["next"] },
  { label: "Nuxt", packages: ["nuxt"] },
  { label: "Astro", packages: ["astro"] },
  { label: "SvelteKit", packages: ["@sveltejs/kit"] },
  { label: "Remix", packages: ["@remix-run/react", "@remix-run/node"] },
  { label: "Angular", packages: ["@angular/core"] },
  { label: "NestJS", packages: ["@nestjs/core"] },
  { label: "Vue", packages: ["vue"] },
  { label: "React", packages: ["react"] },
  { label: "Svelte", packages: ["svelte"] },
  { label: "Express", packages: ["express"] },
  { label: "Fastify", packages: ["fastify"] },
] as const;

const TEST_TOOL_SIGNATURES = [
  { label: "Playwright", packages: ["@playwright/test", "playwright"] },
  { label: "Cypress", packages: ["cypress"] },
  { label: "Vitest", packages: ["vitest"] },
  { label: "Jest", packages: ["jest"] },
  { label: "Mocha", packages: ["mocha"] },
  { label: "AVA", packages: ["ava"] },
] as const;

const BUILD_TOOL_SIGNATURES = [
  { label: "Turborepo", packages: ["turbo"] },
  { label: "Vite", packages: ["vite"] },
  { label: "Webpack", packages: ["webpack"] },
  { label: "Rollup", packages: ["rollup"] },
  { label: "tsup", packages: ["tsup"] },
  { label: "esbuild", packages: ["esbuild"] },
] as const;

function detectLabels(
  dependencies: Record<string, string>,
  signatures: ReadonlyArray<{
    label: string;
    packages: readonly string[];
  }>,
) {
  return signatures
    .filter((signature) =>
      signature.packages.some((packageName) => packageName in dependencies),
    )
    .map((signature) => signature.label);
}

export function detectFrameworks(dependencies: Record<string, string>) {
  const frameworks = detectLabels(dependencies, FRAMEWORK_SIGNATURES);
  return frameworks.length > 0 ? frameworks : ["Vanilla JavaScript"];
}

export function detectTestTools(dependencies: Record<string, string>) {
  const tools = detectLabels(dependencies, TEST_TOOL_SIGNATURES);
  return tools.length > 0 ? tools : ["No Formal Test Moon"];
}

export function detectBuildTools(dependencies: Record<string, string>) {
  const tools = detectLabels(dependencies, BUILD_TOOL_SIGNATURES);
  return tools.length > 0 ? tools : ["Bespoke Scripts"];
}

export function parsePackageManagerLabel(packageManager: string | null) {
  if (!packageManager) {
    return "Unregistered Package Manager";
  }

  const normalized = packageManager.split("@")[0].toLowerCase();

  if (normalized === "pnpm") {
    return "pnpm Rising";
  }

  if (normalized === "yarn") {
    return "Yarn Rising";
  }

  if (normalized === "bun") {
    return "Bun Rising";
  }

  if (normalized === "npm") {
    return "npm Rising";
  }

  return `${packageManager} Rising`;
}

export function detectBigThree(features: ManifestFeatures) {
  return {
    sun: features.frameworks[0] ?? "Vanilla JavaScript",
    moon: features.testTools[0] ?? "No Formal Test Moon",
    rising: parsePackageManagerLabel(features.packageManager),
  };
}
