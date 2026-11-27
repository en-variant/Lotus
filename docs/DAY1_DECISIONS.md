
# Day 1 Safety and Contract Review

**Project:** Lotus (Sugama)
**Responsibility:** Member 1
**Related Issue:** #1
**Pull Request:** #5

**Status:** Draft — safety documentation, shared contract review, prototype safety modules and 16 local functional tests completed. Implementation guide review, team acknowledgement and integration pending.

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

Sugama must return control to the original website for:

- Login and authentication.
- OTP verification.
- CAPTCHA verification.
- Credit/debit card entry.
- Payment-related steps.
- Restricted or unsupported actions.
- Actions whose targets cannot be safely verified.

The user must always have access to the original website and the ability to stop Sugama.

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

No immediate contract change requested, pending implementation guide review.

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

Status: Passed without reported compilation errors.

### Functional Test Results

| Metric | Result |
|---|---|
| Total tests | 16 |
| Passed | 16 |
| Failed | 0 |
| Local test success rate | 100% |

### Individual Test Results

| No. | Test | Result |
|---|---|---|
| 1 | Password value removed | PASS |
| 2 | OTP value removed | PASS |
| 3 | All input values omitted | PASS |
| 4 | Hidden element removed | PASS |
| 5 | Private URL removed | PASS |
| 6 | Private text removed | PASS |
| 7 | Approved text preserved | PASS |
| 8 | Missing target blocked | PASS |
| 9 | Password action blocked | PASS |
| 10 | OTP action blocked | PASS |
| 11 | Payment action blocked | PASS |
| 12 | Hidden target blocked | PASS |
| 13 | Unapproved action blocked | PASS |
| 14 | Approved action allowed | PASS |
| 15 | User confirmation required | PASS |
| 16 | Duplicate target blocked | PASS |

### Test Execution Command

Run from the repository root:

    npx --yes tsx extension/src/shared/safety.test.ts

### Final Local Test Output

    Passed: 16
    Failed: 0
    Total: 16
    ALL SAFETY TESTS PASSED!

These results were obtained through local testing in VS Code.

GitHub Actions testing has not been configured or verified.

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

Passing all 16 local tests does not establish complete browser security.

## 11. Implementation Guide Review

The following sections must be reviewed against the shared contracts and safety implementation:

- [ ] Section 4.2 - Page Understanding.
- [ ] Section 4.3 - Planning.
- [ ] Section 4.5 - Action Executor.
- [ ] Section 4.7 - Safety and Trust.

Status: Pending access to the implementation guide.

Any mismatches identified during the review must be documented before final approval.

## 12. Team Acknowledgement

| Member | Responsibility | Status |
|---|---|---|
| Member 1 | Safety and contract review | Draft and prototype completed |
| Member 3 | Chrome extension integration | Acknowledgement pending |
| Member 4 | Mock portal and planning server | Acknowledgement pending |

Members 3 and 4 must review and acknowledge the safety requirements before Issue #1 is marked complete.

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
- [x] Completed TypeScript compilation.
- [x] Passed all 16 local functional tests.
- [x] Uploaded code to GitHub.
- [x] Created Pull Request #5.
- [ ] Completed implementation guide review.
- [ ] Received Member 3 acknowledgement.
- [ ] Received Member 4 acknowledgement.
- [ ] Verified live extension integration.
- [ ] Completed final pull request review.

## 14. Conclusion

The Day 1 safety documentation draft, shared contract review, standalone privacy sanitizer, action safety validator and automated functional tests have been completed.

All 16 local functional tests passed successfully.

The existing shared TypeScript contracts remain unchanged.

Final assignment completion is pending implementation guide review and acknowledgement from Members 3 and 4.

Full browser safety enforcement remains pending integration and end-to-end verification.
