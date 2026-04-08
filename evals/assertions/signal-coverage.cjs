const signalPatterns = {
  latest: [/\blatest\b/i, /\bcommitment\b/i, /\bopen-ended\b/i],
  wildcard: [/\bwildcard\b/i, /\bopen-ended\b/i, /\bflexible\b/i],
  postinstall: [/\bpostinstall\b/i, /\bsecond life\b/i, /\bafter onboarding\b/i],
  peerDependencies: [/\bpeer depend/i, /\btension\b/i, /\bexpectation/i],
  overrides: [/\boverride/i, /\bresolution/i, /\bexception handling\b/i],
};

function collectReadingText(output) {
  const reading = output?.reading;

  if (!reading || typeof reading !== "object") {
    return "";
  }

  return [
    reading.executiveSummary,
    reading.sunInterpretation,
    reading.moonInterpretation,
    reading.risingInterpretation,
    reading.prophecy,
    reading.boardroomAssessment,
    reading.shareCaption,
    ...reading.redFlags,
  ]
    .filter((value) => typeof value === "string")
    .join("\n");
}

module.exports = (output, context) => {
  const requiredSignals = Array.isArray(context.vars.requiredSignals)
    ? context.vars.requiredSignals
    : [];

  if (requiredSignals.length === 0) {
    return {
      pass: true,
      score: 1,
      reason: "No fixture-specific signal coverage was required.",
    };
  }

  const combinedText = collectReadingText(output);
  const missingSignals = requiredSignals.filter((signal) => {
    const patterns = signalPatterns[signal] ?? [];
    return !patterns.some((pattern) => pattern.test(combinedText));
  });

  if (missingSignals.length > 0) {
    return {
      pass: false,
      score: 0,
      reason: `Reading missed expected fixture signals: ${missingSignals.join(", ")}.`,
    };
  }

  return {
    pass: true,
    score: 1,
    reason: `Reading covered fixture signals: ${requiredSignals.join(", ")}.`,
  };
};
