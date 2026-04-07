import { GoogleGenAI } from "@google/genai";
import {
  APP_MODEL,
  FALLBACK_MODEL_LABEL,
  PRODUCTION_SAFE_MODEL_LABEL,
} from "@/lib/constants";
import { buildReadingPrompt, SYSTEM_PROMPT } from "@/lib/build-prompt";
import {
  computeScores,
  describeDirection,
  describeScore,
  type AuraScores,
} from "@/lib/compute-scores";
import { detectBigThree } from "@/lib/detect-archetypes";
import {
  buildTeapotPayload,
  detectUnsupportedManifest,
  extractManifestFeatures,
  parseManifestJson,
  type ManifestFeatures,
} from "@/lib/parse-manifest";
import {
  analysisResultSchema,
  analyzeRequestSchema,
  readingResponseJsonSchema,
  readingSchema,
  type AnalysisResult,
  type Reading,
} from "@/lib/schemas";

export const runtime = "nodejs";

function toLuckyCommand(
  packageManager: string | null,
  scores: AuraScores,
): string {
  const base = packageManager?.split("@")[0] ?? "npx";

  if (base === "pnpm") {
    return scores.chaosIndex > 65
      ? "pnpm install --save-exact executive-composure"
      : "pnpm audit aura --prod";
  }

  if (base === "yarn") {
    return scores.peerDependencyTension > 55
      ? "yarn add strategic-alignment --exact"
      : "yarn run reconcile:stakeholders";
  }

  if (base === "bun") {
    return "bun add governance@exact";
  }

  if (base === "npm") {
    return scores.mercurySeverity > 65
      ? "npm install --save-exact ceremonial-stability"
      : "npm run forecast:boardroom";
  }

  return "npx dependency-aura reconcile --scope=executive";
}

function buildRedFlags(features: ManifestFeatures, scores: AuraScores) {
  const redFlags: string[] = [];

  if (features.latestTagCount > 0) {
    redFlags.push(
      `${features.latestTagCount} dependency relationship${
        features.latestTagCount === 1 ? " is" : "s are"
      } delegated to the word "latest."`,
    );
  }

  if (features.wildcardVersionCount > 0) {
    redFlags.push(
      `${features.wildcardVersionCount} version range${
        features.wildcardVersionCount === 1 ? "" : "s"
      } remain spiritually open-ended.`,
    );
  }

  if (features.hasPostinstall) {
    redFlags.push(
      "A postinstall script suggests the project has a private life after onboarding.",
    );
  }

  if (features.peerDependencyCount > 0) {
    redFlags.push(
      `${features.peerDependencyCount} peer dependenc${
        features.peerDependencyCount === 1 ? "y" : "ies"
      } indicate unspoken expectations.`,
    );
  }

  if (features.overrideCount + features.resolutionCount > 0) {
    redFlags.push(
      "Overrides and resolutions imply governance through exception handling.",
    );
  }

  if (scores.chaosIndex >= 70) {
    redFlags.push(
      "Operational variance is elevated enough to require ritualized release notes.",
    );
  }

  return redFlags.slice(0, 4);
}

function buildFallbackReading(
  features: ManifestFeatures,
  scores: AuraScores,
): Reading {
  const bigThree = detectBigThree(features);
  const redFlags = buildRedFlags(features, scores);
  const projectName = features.name ?? "This unnamed package";
  const chaosTone = describeScore(scores.chaosIndex);
  const stabilityTone = describeDirection("positive", scores.auraStability);
  const tensionTone = describeDirection(
    "negative",
    scores.peerDependencyTension,
  );

  return readingSchema.parse({
    executiveSummary: `${projectName} presents as a ${bigThree.sun} organization with ${bigThree.moon} coping mechanisms and a ${bigThree.rising} public face. Stability is ${stabilityTone}, while delivery theatrics remain ${chaosTone}.`,
    sunInterpretation: `${bigThree.sun} as the sun sign implies a platform that wants to look mature, even when the dependency graph is feeling improvisational.`,
    moonInterpretation: `${bigThree.moon} as the moon sign suggests the team processes uncertainty through tooling rituals rather than emotional transparency.`,
    risingInterpretation: `${bigThree.rising} rising gives the manifest an immediately legible posture: orderly on entry, selectively candid once lifecycle scripts are discussed.`,
    redFlags,
    prophecy:
      scores.mercurySeverity > 65
        ? "A harmless patch release will trigger a ceremonial incident in an environment nobody remembers owning."
        : "A new package will arrive framed as a tiny operational improvement and immediately reorganize the team mood.",
    luckyCommand: toLuckyCommand(features.packageManager, scores),
    boardroomAssessment: `Aura Stability is ${scores.auraStability}/100, Chaos Index is ${scores.chaosIndex}/100, and Peer Dependency Tension is ${scores.peerDependencyTension}/100. Leadership can call this alignment if nobody asks a second question.`,
    shareCaption: `${projectName} just received a dependency aura audit: ${bigThree.sun} sun, ${bigThree.moon} moon, ${bigThree.rising} rising, with ${tensionTone} peer tension and ${scores.mercuryStatus.toLowerCase()}.`,
  });
}

function buildProductionSafeReading(
  features: ManifestFeatures,
): Reading {
  const projectName = features.name ?? "This unnamed package";
  const bigThree = detectBigThree(features);

  return readingSchema.parse({
    executiveSummary:
      "The live dependency oracle has been placed under immediate fiscal supervision. This production deployment now offers a dignified imitation of insight while the budget committee regains consciousness.",
    sunInterpretation:
      "All manifests are temporarily classified as financially interesting and spiritually non-billable.",
    moonInterpretation:
      "The emotional truth of this project remains on hold pending executive approval of a very small monthly line item.",
    risingInterpretation:
      "Public posture is now best described as cost-aware mysticism with controlled theatrical output.",
    redFlags: [
      "Production clairvoyance has been suspended by finance.",
      "This dashboard is currently operating on ceremonial confidence.",
      "Any deeper revelation must occur in local development.",
      "The budget committee believes this is a feature.",
    ],
    prophecy:
      "A stakeholder will describe this restriction as prudent stewardship immediately before asking for more magic.",
    luckyCommand: "npm run dev",
    boardroomAssessment: `${projectName} was scored locally with full confidence, but the narrative layer has been downgraded to an approved fixed statement for cost containment.`,
    shareCaption: `Semver in Retrograde audited ${projectName}: ${bigThree.sun} sun, ${bigThree.moon} moon, ${bigThree.rising} rising. Live prophecy withheld by the budget committee.`,
  });
}

async function generateReading(
  features: ManifestFeatures,
  scores: AuraScores,
): Promise<{ reading: Reading; mode: "live" | "fallback" | "safe"; warnings: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const isProductionDeployment = process.env.VERCEL_ENV === "production";

  if (isProductionDeployment && !apiKey) {
    return {
      reading: buildProductionSafeReading(features),
      mode: "safe",
      warnings: [
        "Live Gemini copy is intentionally disabled on production. This deployment runs in budget-safe mode and returns a fixed executive statement instead.",
      ],
    };
  }

  if (!apiKey) {
    return {
      reading: buildFallbackReading(features, scores),
      mode: "fallback",
      warnings: [
        "GEMINI_API_KEY is not configured, so the narrative copy is using the local contingency generator.",
      ],
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: APP_MODEL,
      contents: buildReadingPrompt(features, scores),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
        topP: 0.9,
        seed: 451,
        responseMimeType: "application/json",
        responseJsonSchema: readingResponseJsonSchema,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response body.");
    }

    const parsed = JSON.parse(text);

    return {
      reading: readingSchema.parse(parsed),
      mode: "live",
      warnings: [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Gemini failure.";

    return {
      reading: buildFallbackReading(features, scores),
      mode: "fallback",
      warnings: [
        `Gemini response validation failed, so the narrative copy fell back to the local contingency generator. ${message}`,
      ],
    };
  }
}

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return Response.json(
      {
        error: "Request body must be valid JSON.",
      },
      { status: 400 },
    );
  }

  const parsedRequest = analyzeRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return Response.json(
      {
        error: "Request body did not match the expected schema.",
        detail: parsedRequest.error.flatten(),
      },
      { status: 400 },
    );
  }

  const manifestText = parsedRequest.data.manifestText.trim();
  const unsupportedKind = detectUnsupportedManifest(manifestText);

  if (unsupportedKind) {
    return Response.json(buildTeapotPayload(unsupportedKind), {
      status: 418,
    });
  }

  const manifestParseResult = parseManifestJson(manifestText);

  if (!manifestParseResult.ok) {
    return Response.json(
      {
        error: manifestParseResult.error,
      },
      { status: 400 },
    );
  }

  const featureParseResult = extractManifestFeatures(manifestParseResult.value);

  if (!featureParseResult.ok) {
    return Response.json(
      {
        error: featureParseResult.error,
      },
      { status: 422 },
    );
  }

  const features = featureParseResult.value;
  const bigThree = detectBigThree(features);
  const scores = computeScores(features);
  const { reading, mode, warnings } = await generateReading(features, scores);

  const result: AnalysisResult = {
    manifestName: features.name ?? "Unnamed package",
    bigThree,
    features,
    scores,
    reading,
    warnings,
    model: {
      id:
        mode === "live"
          ? APP_MODEL
          : mode === "safe"
            ? PRODUCTION_SAFE_MODEL_LABEL
            : FALLBACK_MODEL_LABEL,
      mode,
    },
  };

  const validated = analysisResultSchema.safeParse(result);

  if (!validated.success) {
    return Response.json(
      {
        error: "Internal response schema validation failed.",
        detail: validated.error.flatten(),
      },
      { status: 500 },
    );
  }

  return Response.json(validated.data);
}
