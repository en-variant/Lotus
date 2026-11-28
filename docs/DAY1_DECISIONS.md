
# Day 1 Safety and Contract Review

**Project:** Lotus
**Responsibility:** Member 1
**Related Issue:** #1
**Pull Request:** #5

**Status:** Implementation-guide and shared-contract reviews completed. Standalone safety modules and all 33 repository checks are documented. Browser integration remains with the extension implementation.

## 1. Sensitive Field Values

The following values must remain inside the browser:

- Passwords and OTPs.
- Aadhaar and other identity numbers.
- Credit/debit card details, CVV and payment credentials.
- Consumer numbers and personal account information.
- Authentication tokens and session information.
- Other sensitive personal or financial information.

For Day 1, all current input values must be omitted from the snapshot.

Sensitive information must not be transmitted to the planning server, stored in logs or included in AI prompts.

## 2. Allowed Snapshot Information

The following information may be sent to the local planning server after sanitisation:

- Internally generated, non-sensitive element IDs.
- Element roles.
- Accessible names.
- Field types.
- Visibility status.
- Non-sensitive options.
- Short, non-sensitive context.
- Sanitised page titles and relevant page text.

Raw URLs must not be transmitted because they may contain authentication tokens or personal information.

The current Day 1 sanitizer uses an explicit allowlist of approved static demo text.

Hidden elements and current input values are excluded.

## 3. Action Confirmation Rules

The existing RiskTier classifications are:

| Risk Tier | Safety Requirement |
|---|---|
| read | No additional confirmation required for permitted read-only operations. |
| fill | Only approved fields may be filled following user interaction. |
| navigate | Explicit user confirmation required. |
| irreversible | Requires explicit confirmation in future supported workflows; blocked for Day 1. |
| never-automate | Automated execution is prohibited. |

Additional rules:

- Form submissions require explicit user confirmation.
- Voice commands alone must not trigger irreversible actions.
- AI-generated risk classifications must not be trusted without independent browser-side validation.
- Action targets must be checked against the current website state.
- Missing, duplicate, hidden or changed targets must cause execution to stop.
- The system must never guess an alternative target.
- Unknown or unapproved actions must be blocked.

The current Day 1 validator conservatively requires confirmation for every approved executable action.

## 4. Original Website Handoff

Lotus must return control to the original website for:

- Login and authentication.
- OTP verification.
- CAPTCHA verification.
- Credit/debit card entry.
- Payment-related steps.
- Restricted or unsupported actions.
- Actions whose targets cannot be safely verified.

The user must always have access to the original website and the ability to stop Lotus.

## 5. Shared TypeScript Contract Review

The following existing contracts were reviewed:

- SnapshotElement
- Snapshot
- ScreenComponent
- ScreenPlan
- Action
- RiskTier
- ActionResult

The existing contracts provide a suitable preliminary baseline for the Day 1 prototype.

### Identified Safety Improvements

- Prevent sensitive values from entering SnapshotElement.value.
- Sanitise page titles, URLs, accessible names, context, options and text blocks.
- Ensure element IDs contain no personal information.
- Validate action targets against the current website state.
- Independently verify action risk using trusted browser-side rules.
- Consider an explicit original-page handoff mechanism in a future contract revision.

### Contract Decision

Retain the existing TypeScript contract shapes for Day 1 and enforce additional safety rules through runtime validation.

No immediate contract shape change requested for Day 1. The optional `SnapshotElement.value` property means privacy must be enforced by the browser sanitizer before a request is sent; the type alone cannot guarantee redaction.

Any future changes to shared contracts must be discussed and agreed upon by the team.

The original types.ts file remains unchanged.

## 6. Day 1 Demo Restrictions

The Day 1 demonstration must follow these restrictions:

- Use only the fictional mock electricity portal.
- Use fictional consumer numbers and bill information.
- Do not use real personal or financial information.
- Use a fixed screen plan without real LLM calls.
- Do not automate login, OTP or CAPTCHA.
- Do not automate real payments.
- Stop before payment.
- Do not store or log sensitive information.
- Block actions outside the approved demo workflow.

## 7. Safety Implementation

The following TypeScript modules were implemented as additional Member 1 contributions.

### 7.1 Snapshot Privacy Sanitizer

File: extension/src/shared/sanitizer.ts

Responsibilities:

- Remove all current input values.
- Exclude hidden elements.
- Omit raw page URLs.
- Filter page text using approved static text.
- Filter accessible names, context and options.
- Return a sanitised snapshot for the planning server.

The sanitizer is intended to run inside the browser before snapshot transmission.

### 7.2 Action Safety Validator

File: extension/src/shared/safety.ts

Responsibilities:

- Detect missing or duplicate action targets.
- Block hidden targets.
- Block recognised restricted authentication and payment actions.
- Reject unapproved actions.
- Validate action and element-role compatibility.
- Validate available selection options.
- Block irreversible and never-automate actions for Day 1.
- Require confirmation for approved executable actions.

The validator follows a default-deny approach using trusted browser-side action approvals.

### 7.3 Automated Safety Tests

File: extension/src/shared/safety.test.ts

Responsibilities:

- Verify snapshot privacy behaviour.
- Verify action safety decisions.
- Report passed and failed tests.
- Detect regressions in the standalone safety functions.

## 8. Testing Results

### TypeScript Compilation

The repository has no production extension bundle/type-check command yet. The safety utility tests are run through `tsx`; this verifies their exercised behavior but is not a full extension build.

### Functional Test Results

| Metric | Result |
|---|---|
| Total automated checks | 33 |
| Passed | 33 |
| Failed | 0 |
| Test success rate | 100% |

### Individual Test Results

| No. | Test | Result |
|---|---|---|
| Safety and privacy assertions | 16 | PASS |
| Server request/response cases | 8 | PASS |
| Portal lookup cases | 4 | PASS |
| Overlay behavior cases | 5 | PASS |

### Test Execution Command

Run all checks from the repository root:

    npm test

Individual suites can be run with `npm run test:safety`, `npm run test:server`, `npm run test:portal`, or `npm run test:overlay`.

The repository test command completed successfully: 33 automated checks passed and 0 failed. These checks cover the standalone safety utilities, the local server, the mock portal, and the overlay behavior. They do not replace manual Chrome testing or end-to-end extension/server integration. GitHub Actions testing has not been configured.

## 9. Integration Requirements

### Member 3 - Chrome Extension

- Call sanitizeSnapshot() before sending snapshots to the planning server.
- Provide trusted, non-sensitive static text allowlists.
- Generate non-sensitive and unique element IDs.
- Maintain trusted browser-side action approval rules.
- Call validateAction() before executing website actions.
- Use current, unsanitised local element metadata for safety validation without transmitting sensitive values.
- Revalidate the live DOM immediately before execution.
- Stop execution if an element has changed or disappeared.
- Enforce explicit user confirmation.
- Restrict execution to the approved fictional demo portal.
- Provide original-page handoff and stop controls.

### Member 4 - Planning Server

- Accept only the required sanitised snapshot information.
- Do not store or log sensitive information.
- Use fictional demo data.
- Return the fixed Day 1 screen plan.
- Do not request sensitive field values.
- Do not initiate real payments or authentication actions.

## 10. Known Limitations

The current implementation is a Day 1 prototype.

- The sanitizer depends on correctly configured static text allowlists.
- Element IDs must be generated safely by the extension.
- Keyword-based restricted-action detection cannot guarantee complete safety.
- Action approvals must come from trusted browser-side rules.
- The validator returns a confirmation requirement but does not itself display or enforce a confirmation interface.
- Live DOM revalidation must be implemented by the action executor.
- The standalone functions have not yet been verified through complete browser-to-server integration.
- The implementation is not approved for arbitrary real-world websites or real financial transactions.

Passing the automated checks does not establish complete browser security.

## 11. Implementation Guide Review

Reviewed the supplied `Sugama Implementation Guide.docx` sections against `extension/src/shared/types.ts`, `sanitizer.ts`, and `safety.ts`.

### Section 4.2 — Page understanding

- The `SnapshotElement` contract carries an ID, role, accessible name, field type, optional value/options, visibility and context. `Snapshot` carries URL, title, elements and text blocks. These cover the guide's core snapshot fields.
- The sanitizer removes input values and raw URLs, drops hidden elements, and allowlists text. This is stricter than the guide's minimum privacy requirement and is appropriate for the fictional Day 1 flow.
- The guide also calls for table-row text, compact snapshots, truncation, and stable IDs attached to DOM elements. Those are snapshot-collector responsibilities and are not implemented by the standalone sanitizer.
- The guide names the DOM attribute `data-sugama-id`; this project uses the rebranded `data-lotus-id` convention. The extension implementation must use the same stable ID in the snapshot and live DOM.

### Section 4.3 — Planning

- `ScreenPlan` represents the required screen ID, title, language and components. The server must validate that a field/button target refers to an ID in the submitted snapshot; the model or server must not invent selectors or URLs.
- The guide also calls for schema validation, retry/fallback behavior, untrusted page text handling and risk labels derived by browser-side rules. The Day 1 endpoint is a fixed stub, so these LLM/schema/retry features are later work, not claims of the current implementation.
- The guide's full request may include goal, profile and short history. The Day 1 stub only needs the snapshot to choose a demo plan and ignores those optional inputs.

### Section 4.5 — Action executor

- The shared `Action` type covers fill, click, select and check. `validateAction()` checks unique visible targets, approved operations, target roles/options and restricted actions, then requires confirmation.
- The guide additionally requires native input setters/events, scrolling/highlighting, waiting for DOM changes, re-snapshotting and verifying each action. Those belong to the executor and are not implemented by these standalone safety modules; do not describe them as complete until Member 3 integrates them.

### Section 4.7 — Safety and trust

- The validator uses a trusted browser-side approval map and blocks irreversible and never-automate actions for Day 1. The sanitizer omits values and raw URLs. The notes correctly require human confirmation and handoff for authentication and payment steps.
- The guide warns that page text is untrusted and prompt injection is reduced, not eliminated. There is no LLM in the Day 1 flow; if one is added later, schema checks, known-ID checks, browser-derived risk and human confirmation remain required.
- The current keyword checks are defense in depth, not a complete classifier. Keep the prototype restricted to the fictional portal; never claim the rules make arbitrary websites safe.

### Contract decision

No immediate contract shape change requested for Day 1. Preserve the existing shared types and enforce privacy, target membership and risk rules at runtime. The main implementation gap is wiring the sanitizer and validator into the content-script request/action paths.

## 12. Handoff Status (Coordination, Not a PR Gate)

| Member | Responsibility | Status |
|---|---|---|
| Member 1 | Safety and contract review | Guide and contract review documented |
| Member 2 | Overlay screen specification | Separate deliverable in `docs/DAY1_OVERLAY_SPEC.md` |
| Member 3 | Chrome extension integration | Must wire these modules into the browser flow |
| Member 4 | Mock portal and planning server | Use the agreed `POST /plan` request/response contract |

Sharing the safety note with Members 3 and 4 is a useful handoff. Their acknowledgement is a coordination check, not a requirement for approving this documentation PR. Integration and end-to-end verification remain separate work.

## 13. Final Completion Checklist

- [x] Reviewed shared TypeScript contracts.
- [x] Documented sensitive field restrictions.
- [x] Documented allowed snapshot information.
- [x] Documented action confirmation rules.
- [x] Documented original website handoff requirements.
- [x] Documented shared contract recommendations.
- [x] Defined fictional-data-only demo restrictions.
- [x] Implemented snapshot privacy sanitizer.
- [x] Implemented action safety validator.
- [x] Created automated safety tests.
- [x] Added a reproducible repository test command.
- [x] Passed all 33 automated checks (16 safety, 8 server, 4 portal, 5 overlay).
- [x] Uploaded code to GitHub.
- [x] Created Pull Request #5.
- [x] Completed implementation guide review for sections 4.2, 4.3, 4.5 and 4.7.
- [x] Documented handoff rules for Members 3 and 4 (acknowledgement is not a PR gate).
- [ ] Verified live extension integration.
- [ ] Completed final pull request review.

## 14. Conclusion

The Day 1 safety documentation draft, shared contract review, standalone privacy sanitizer, action safety validator and automated functional tests have been completed.

All 33 automated checks currently pass. Live browser-to-server integration remains pending Member 3's snapshot and action-execution work.

The existing shared TypeScript contracts remain unchanged.

The documentation and guide-review portion of Member 1's assignment is complete. Browser integration and the final group demo remain separate follow-up work.

Full browser safety enforcement remains pending integration and end-to-end verification.
