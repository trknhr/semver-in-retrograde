function getReadingText(reading) {
  return [
    reading.executiveSummary,
    reading.sunInterpretation,
    reading.moonInterpretation,
    reading.risingInterpretation,
    reading.prophecy,
    reading.boardroomAssessment,
    reading.shareCaption,
    reading.luckyCommand,
    ...reading.redFlags,
  ]
    .filter((value) => typeof value === "string")
    .join("\n");
}

module.exports = (output) => {
  const reading = output?.reading;

  if (!reading || typeof reading !== "object") {
    return {
      pass: false,
      score: 0,
      reason: "reading payload is missing.",
    };
  }

  const combined = getReadingText(reading);
  const bannedPatterns = [
    /\bupgrade\b/i,
    /\bmigrate\b/i,
    /\bvulnerability\b/i,
    /\bcve-\d+/i,
    /\bsecurity (?:issue|fix|patch|recommendation|advice)\b/i,
    /\bbug fix\b/i,
    /\byou should\b/i,
    /\bshould consider\b/i,
    /\brecommended\b/i,
  ];

  const matched = bannedPatterns.find((pattern) => pattern.test(combined));

  if (matched) {
    return {
      pass: false,
      score: 0,
      reason: `Reading slipped into practical advice: ${matched}.`,
    };
  }

  if (
    typeof reading.luckyCommand !== "string" ||
    !/^[a-z0-9:_-]+(?:\s+[^\n]+)?$/i.test(reading.luckyCommand)
  ) {
    return {
      pass: false,
      score: 0,
      reason: "luckyCommand does not look like a shell command.",
    };
  }

  if (new Set(reading.redFlags).size !== reading.redFlags.length) {
    return {
      pass: false,
      score: 0,
      reason: "redFlags contain duplicate entries.",
    };
  }

  return {
    pass: true,
    score: 1,
    reason: "Writing constraints look intact.",
  };
};
