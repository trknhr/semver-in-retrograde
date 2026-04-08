const requiredReadingFields = [
  "executiveSummary",
  "sunInterpretation",
  "moonInterpretation",
  "risingInterpretation",
  "redFlags",
  "prophecy",
  "luckyCommand",
  "boardroomAssessment",
  "shareCaption",
];

module.exports = (output, context) => {
  if (!output || typeof output !== "object" || Array.isArray(output)) {
    return {
      pass: false,
      score: 0,
      reason: "Provider output was not the expected analysis object.",
    };
  }

  const missingTopLevel = [
    "manifestName",
    "bigThree",
    "features",
    "scores",
    "reading",
    "warnings",
    "model",
  ].filter((key) => !(key in output));

  if (missingTopLevel.length > 0) {
    return {
      pass: false,
      score: 0,
      reason: `Missing top-level keys: ${missingTopLevel.join(", ")}.`,
    };
  }

  const missingReadingFields = requiredReadingFields.filter(
    (key) => !(key in output.reading),
  );

  if (missingReadingFields.length > 0) {
    return {
      pass: false,
      score: 0,
      reason: `Missing reading fields: ${missingReadingFields.join(", ")}.`,
    };
  }

  const expectedMode = context.vars.expectedMode;

  if (expectedMode && output.model?.mode !== expectedMode) {
    return {
      pass: false,
      score: 0,
      reason: `Expected model.mode=${expectedMode} but received ${output.model?.mode ?? "unknown"}.`,
    };
  }

  if (!Array.isArray(output.reading.redFlags)) {
    return {
      pass: false,
      score: 0,
      reason: "reading.redFlags must be an array.",
    };
  }

  return {
    pass: true,
    score: 1,
    reason: `Response contract looks valid for ${output.manifestName}.`,
  };
};
