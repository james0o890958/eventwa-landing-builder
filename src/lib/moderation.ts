export type ModerationSeverity = "allow" | "warn" | "block";

export interface ModerationResult {
  severity: ModerationSeverity;
  reason?: string;
  matches: string[];
}

const MODERATION_RULES: Array<{
  severity: Exclude<ModerationSeverity, "allow">;
  reason: string;
  patterns: RegExp[];
}> = [
  {
    severity: "block",
    reason: "Threats or encouragement of self-harm are not allowed.",
    patterns: [
      /\b(kill\s+(yourself|urself|you)|kys)\b/i,
      /\b(i\s+will\s+kill\s+you|i'?ll\s+kill\s+you)\b/i,
      /\b(go\s+die|drop\s+dead)\b/i,
    ],
  },
  {
    severity: "block",
    reason: "Harassing or abusive comments are not allowed.",
    patterns: [
      /\b(stupid\s+(idiot|fool)|worthless|dumb\s+(idiot|fool))\b/i,
      /\b(fuck\s+you|f\*+k\s+you|shut\s+the\s+fuck\s+up)\b/i,
    ],
  },
  {
    severity: "block",
    reason: "Spam, scams, and suspicious promotions are not allowed.",
    patterns: [
      /\b(whatsapp|telegram)\b.*\b(make money|investment|crypto|forex|guaranteed)\b/i,
      /\b(make\s+\$?\d+\s+(daily|weekly)|guaranteed\s+profit|double\s+your\s+money)\b/i,
      /\b(click\s+here|free\s+money|limited\s+offer)\b/i,
    ],
  },
  {
    severity: "warn",
    reason: "Comments with repeated links may be treated as spam.",
    patterns: [
      /(https?:\/\/|www\.)\S+.*(https?:\/\/|www\.)\S+/i,
    ],
  },
];

export const moderateComment = (content: string): ModerationResult => {
  const text = content.trim();
  if (!text) {
    return { severity: "block", reason: "Please enter a comment.", matches: [] };
  }

  const matched = MODERATION_RULES.find((rule) =>
    rule.patterns.some((pattern) => pattern.test(text))
  );

  if (!matched) {
    return { severity: "allow", matches: [] };
  }

  return {
    severity: matched.severity,
    reason: matched.reason,
    matches: matched.patterns
      .filter((pattern) => pattern.test(text))
      .map((pattern) => pattern.source),
  };
};
