import { z } from "zod";

export const analyzeRequestSchema = z.object({
  manifestText: z.string().min(1).max(40000),
});

export const manifestFeaturesSchema = z.object({
  name: z.string().nullable(),
  private: z.boolean(),
  packageManager: z.string().nullable(),
  dependencyCount: z.number().int().nonnegative(),
  devDependencyCount: z.number().int().nonnegative(),
  peerDependencyCount: z.number().int().nonnegative(),
  optionalDependencyCount: z.number().int().nonnegative(),
  overrideCount: z.number().int().nonnegative(),
  resolutionCount: z.number().int().nonnegative(),
  scriptCount: z.number().int().nonnegative(),
  hasTestScript: z.boolean(),
  hasPostinstall: z.boolean(),
  wildcardVersionCount: z.number().int().nonnegative(),
  caretVersionCount: z.number().int().nonnegative(),
  tildeVersionCount: z.number().int().nonnegative(),
  latestTagCount: z.number().int().nonnegative(),
  workspaceHints: z.number().int().nonnegative(),
  pinnedVersionCount: z.number().int().nonnegative(),
  totalDependencyEntries: z.number().int().nonnegative(),
  prePostScriptCount: z.number().int().nonnegative(),
  suspiciousScriptCount: z.number().int().nonnegative(),
  frameworks: z.array(z.string()),
  testTools: z.array(z.string()),
  buildTools: z.array(z.string()),
});

export type ManifestFeatures = z.infer<typeof manifestFeaturesSchema>;

export const auraScoresSchema = z.object({
  auraStability: z.number().int().min(0).max(100),
  chaosIndex: z.number().int().min(0).max(100),
  peerDependencyTension: z.number().int().min(0).max(100),
  boundaryIssues: z.number().int().min(0).max(100),
  trustIssues: z.number().int().min(0).max(100),
  mercurySeverity: z.number().int().min(0).max(100),
  mercuryStatus: z.string(),
});

export type AuraScores = z.infer<typeof auraScoresSchema>;

export const readingSchema = z.object({
  executiveSummary: z.string().min(1).max(420),
  sunInterpretation: z.string().min(1).max(320),
  moonInterpretation: z.string().min(1).max(320),
  risingInterpretation: z.string().min(1).max(320),
  redFlags: z.array(z.string().min(1).max(160)).max(4),
  prophecy: z.string().min(1).max(320),
  luckyCommand: z.string().min(1).max(160),
  boardroomAssessment: z.string().min(1).max(340),
  shareCaption: z.string().min(1).max(300),
});

export type Reading = z.infer<typeof readingSchema>;

export const analysisResultSchema = z.object({
  manifestName: z.string(),
  bigThree: z.object({
    sun: z.string(),
    moon: z.string(),
    rising: z.string(),
  }),
  features: manifestFeaturesSchema,
  scores: auraScoresSchema,
  reading: readingSchema,
  warnings: z.array(z.string()),
  model: z.object({
    id: z.string(),
    mode: z.enum(["live", "fallback"]),
  }),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const readingResponseJsonSchema = {
  type: "object",
  properties: {
    executiveSummary: {
      type: "string",
      description: "A concise executive summary in polished B2B language.",
    },
    sunInterpretation: {
      type: "string",
      description: "Interpretation of the framework-derived sun sign.",
    },
    moonInterpretation: {
      type: "string",
      description: "Interpretation of the testing-stack moon sign.",
    },
    risingInterpretation: {
      type: "string",
      description: "Interpretation of the package-manager-derived rising sign.",
    },
    redFlags: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 4,
      description: "Short red flags framed as governance concerns.",
    },
    prophecy: {
      type: "string",
      description: "A concise prophecy about the package ecosystem future.",
    },
    luckyCommand: {
      type: "string",
      description:
        "A plausible but not actually helpful shell command for symbolic reassurance.",
    },
    boardroomAssessment: {
      type: "string",
      description: "A stern executive assessment with no practical advice.",
    },
    shareCaption: {
      type: "string",
      description: "A concise caption suitable for social sharing.",
    },
  },
  required: [
    "executiveSummary",
    "sunInterpretation",
    "moonInterpretation",
    "risingInterpretation",
    "redFlags",
    "prophecy",
    "luckyCommand",
    "boardroomAssessment",
    "shareCaption",
  ],
} as const;
