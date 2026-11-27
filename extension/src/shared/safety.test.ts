
import { sanitizeSnapshot } from "./sanitizer";
import { validateAction } from "./safety";
import type {
  Snapshot,
  SnapshotElement,
  RiskTier
} from "./types";

let passed = 0;
let failed = 0;

function test(name: string, condition: boolean) {
  if (condition) {
    console.log("PASS: " + name);
    passed++;
  } else {
    console.error("FAIL: " + name);
    failed++;
  }
}

const elements: SnapshotElement[] = [
  {
    id: "e1",
    role: "text-input",
    name: "Password",
    type: "password",
    value: "fake-password",
    visible: true
  },
  {
    id: "e2",
    role: "text-input",
    name: "OTP",
    value: "123456",
    visible: true
  },
  {
    id: "e3",
    role: "button",
    name: "View Bill",
    visible: true
  },
  {
    id: "e4",
    role: "button",
    name: "Pay Now",
    visible: true
  },
  {
    id: "e5",
    role: "button",
    name: "Hidden Button",
    visible: false
  }
];

const snapshot: Snapshot = {
  url: "https://example.com?token=fake-secret",
  title: "Electricity Portal",
  elements,
  text_blocks: [
    "Electricity Bill",
    "Private Account Information"
  ]
};

const approvedText = new Set([
  "Electricity Portal",
  "Electricity Bill",
  "View Bill"
]);

const sanitized = sanitizeSnapshot(
  snapshot,
  approvedText
);

console.log("\n=== PRIVACY TESTS ===");

test(
  "Password value removed",
  !JSON.stringify(sanitized).includes("fake-password")
);

test(
  "OTP value removed",
  !JSON.stringify(sanitized).includes("123456")
);

test(
  "All input values omitted",
  sanitized.elements.every(e => !("value" in e))
);

test(
  "Hidden element removed",
  !sanitized.elements.some(e => e.id === "e5")
);

test(
  "Private URL removed",
  sanitized.url === ""
);

test(
  "Private text removed",
  !sanitized.text_blocks.includes(
    "Private Account Information"
  )
);

test(
  "Approved text preserved",
  sanitized.text_blocks.includes("Electricity Bill")
);

console.log("\n=== ACTION SAFETY TESTS ===");

const approvedActions = new Map<string, RiskTier>([
  ["click:e3", "navigate"],
  ["click:e4", "irreversible"],
  ["fill:e1", "fill"],
  ["fill:e2", "fill"],
  ["click:e5", "navigate"]
]);

test(
  "Missing target blocked",
  !validateAction(
    { op: "click", target: "e99" },
    elements,
    approvedActions
  ).allowed
);

test(
  "Password action blocked",
  !validateAction(
    { op: "fill", target: "e1", value: "demo" },
    elements,
    approvedActions
  ).allowed
);

test(
  "OTP action blocked",
  !validateAction(
    { op: "fill", target: "e2", value: "123456" },
    elements,
    approvedActions
  ).allowed
);

test(
  "Payment action blocked",
  !validateAction(
    { op: "click", target: "e4" },
    elements,
    approvedActions
  ).allowed
);

test(
  "Hidden target blocked",
  !validateAction(
    { op: "click", target: "e5" },
    elements,
    approvedActions
  ).allowed
);

test(
  "Unapproved action blocked",
  !validateAction(
    { op: "click", target: "e3" },
    elements,
    new Map()
  ).allowed
);

const decision = validateAction(
  { op: "click", target: "e3" },
  elements,
  approvedActions
);

test(
  "Approved action allowed",
  decision.allowed
);

test(
  "User confirmation required",
  decision.requiresConfirmation
);

test(
  "Duplicate target blocked",
  !validateAction(
    { op: "click", target: "e3" },
    [...elements, elements[2]],
    approvedActions
  ).allowed
);

console.log("\n=== FINAL TEST REPORT ===");
console.log("Passed: " + passed);
console.log("Failed: " + failed);
console.log("Total: " + (passed + failed));

if (failed > 0) {
  throw new Error("Safety tests failed.");
}

console.log("ALL SAFETY TESTS PASSED!");
