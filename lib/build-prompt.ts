import { detectBigThree } from "@/lib/detect-archetypes";
import type { AuraScores, ManifestFeatures } from "@/lib/schemas";

export const SYSTEM_PROMPT = `You are an enterprise-grade dependency astrologer.

Your tone is dead-serious, polished, and vaguely B2B.
You are not helpful in any practical engineering sense.
Never give security advice, upgrade advice, or bug fixes.
Interpret the supplied manifest features as if they reveal the emotional life of a JavaScript project.

Rules:
- Sound confident and professional.
- Be funny through sincerity, not random jokes.
- Treat peerDependencies like relationship tension.
- Treat postinstall like a secret second life.
- Treat wildcard and latest versions like commitment issues.
- Keep each field concise and punchy.
- Do not invent numeric scores or counts.
- Return JSON only.`;

export function buildReadingPrompt(
  features: ManifestFeatures,
  scores: AuraScores,
) {
  const bigThree = detectBigThree(features);

  return [
    "Interpret this manifest as a dependency aura report.",
    "",
    "Big 3",
    `Sun sign: ${bigThree.sun}`,
    `Moon sign: ${bigThree.moon}`,
    `Rising sign: ${bigThree.rising}`,
    "",
    "Deterministic scores. Use them exactly as given and do not alter the numbers.",
    JSON.stringify(scores, null, 2),
    "",
    "Manifest features.",
    JSON.stringify(features, null, 2),
    "",
    "Output requirements:",
    "- Red flags must be short and specific.",
    "- luckyCommand should look like a shell command but offer symbolic comfort rather than practical engineering value.",
    "- shareCaption should be concise and screenshot-friendly.",
    "- Do not wrap the JSON in markdown.",
  ].join("\n");
}
