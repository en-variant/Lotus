
import type { Action, RiskTier, SnapshotElement } from "./types";

export interface SafetyDecision {
  allowed: boolean;
  requiresConfirmation: boolean;
  reason: string;
}

// Day 1: only explicitly approved demo actions are permitted.
export function validateAction(
  action: Action,
  elements: SnapshotElement[],
  approvedActions: ReadonlyMap<string, RiskTier>
): SafetyDecision {
  const block = (reason: string): SafetyDecision => ({
    allowed: false,
    requiresConfirmation: false,
    reason
  });

  const matches = elements.filter(
    element => element.id === action.target
  );

  if (matches.length !== 1) {
    return block("Target missing or ambiguous.");
  }

  const target = matches[0];

  if (!target.visible) {
    return block("Target is not visible.");
  }

  const description = [
    target.name,
    target.type,
    target.context
  ].join(" ").toLowerCase();

  const restricted =
    /password|otp|captcha|aadhaar|card|cvv|payment|pay now|login|sign in/;

  if (restricted.test(description)) {
    return block("Use the original website for this action.");
  }

  // Risk must come from trusted browser-side rules,
  // not from the AI-generated screen plan.
  const key = `${action.op}:${action.target}`;
  const risk = approvedActions.get(key);

  if (!risk) {
    return block("Action is not approved.");
  }

  if (risk === "never-automate" ||
      risk === "irreversible") {
    return block("Action is restricted for Day 1.");
  }

  if (action.op === "fill") {
    if (target.role !== "text-input") {
      return block("Invalid input target.");
    }
  } else if (action.op === "click") {
    if (target.role !== "button" &&
        target.role !== "link") {
      return block("Invalid click target.");
    }
  } else if (action.op === "select") {
    if (target.role !== "select" ||
        !target.options?.includes(action.value)) {
      return block("Invalid selection.");
    }
  } else if (action.op === "check") {
    if (target.role !== "checkbox" &&
        target.role !== "radio") {
      return block("Invalid checkbox or radio target.");
    }
  } else {
    return block("Unknown action.");
  }

  return {
    allowed: true,
    requiresConfirmation: true,
    reason: "Approved demo action. Confirm before execution."
  };
}
