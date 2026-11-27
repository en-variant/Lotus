/** Shared browser/server contracts. Keep these stable while team members work in parallel. */

export type Language = "en" | "kn" | "hi" | string;
export type Persona = "power-user" | "first-time-user";

export interface Profile {
  language: Language;
  fontScale: number;
  contrast: "normal" | "high";
  voice: boolean;
  persona: Persona;
}

export type ElementRole =
  | "link"
  | "button"
  | "text-input"
  | "select"
  | "checkbox"
  | "radio"
  | "table"
  | "heading";

export interface SnapshotElement {
  id: string;
  role: ElementRole;
  name: string;
  type?: string;
  /** Sensitive values (password, OTP, card, Aadhaar, etc.) must never be included. */
  value?: string;
  options?: string[];
  visible: boolean;
  context?: string;
}

export interface Snapshot {
  url: string;
  title: string;
  elements: SnapshotElement[];
  text_blocks: string[];
}

export type ScreenComponent =
  | { type: "heading"; text: string }
  | { type: "explainer"; text: string }
  | { type: "field"; bind: string; label: string; input: "text" | "number" }
  | { type: "choice"; bind: string; label: string; options: string[] }
  | { type: "fee_table"; rows: Array<{ label: string; amount: string; explain: string }> }
  | { type: "summary"; label: string; value: string }
  | { type: "warning"; text: string }
  | { type: "button"; label: string; action: Action; risk: RiskTier };

export interface ScreenPlan {
  screen_id: string;
  title: string;
  language: Language;
  components: ScreenComponent[];
}

export type Action =
  | { op: "fill"; target: string; value: string }
  | { op: "click"; target: string }
  | { op: "select"; target: string; value: string }
  | { op: "check"; target: string; value: boolean };

export type RiskTier = "read" | "fill" | "navigate" | "irreversible" | "never-automate";

export interface ActionResult {
  ok: boolean;
  observed_change: string;
  error?: string;
}
