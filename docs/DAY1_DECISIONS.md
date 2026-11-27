# Day 1 Safety and Contract Review

**Status:** Draft — shared types and Day 1 plan reviewed. Implementation guide review pending.

## 1. Sensitive field values

The following values must remain inside the browser:

- Passwords and OTPs.
- Aadhaar and other identity numbers.
- Credit/debit card details, CVV and payment credentials.
- Consumer numbers and other personal account information.
- Authentication tokens and session information.

For Day 1, omit all current input values from the snapshot.

## 2. Allowed snapshot information

The following information may be sent to the local plan server after sanitisation:

- Element ID.
- Element role.
- Accessible name.
- Field type.
- Visibility status.
- Non-sensitive options.
- Short, non-sensitive context.
- Sanitised page title, URL and relevant page text.

Raw form values and sensitive information must not be transmitted, stored or logged.

## 3. Action confirmation rules

- `read`: No additional confirmation required.
- `fill`: Only fill permitted fields following user interaction.
- `navigate`: Require explicit user confirmation.
- `irreversible`: Require a confirmation card explaining the exact action.
- `never-automate`: Block automated execution.

Form submissions require explicit confirmation. Voice alone must not trigger irreversible actions.

The browser must independently validate the action risk and verify the target element before execution. If the target is missing or has changed, stop and show a fallback instead of guessing.

## 4. Original website handoff

Sugama must return control to the original website for:

- Login and authentication.
- OTP verification.
- CAPTCHA.
- Card-detail entry.
- Payment-related steps.

The user must always have access to the original page and the option to stop Sugama.

## 5. Shared contract review

The existing `SnapshotElement`, `Snapshot`, `Action`, `ScreenPlan` and `RiskTier` types provide a suitable baseline for Day 1.

Potential safety improvements:

- Prevent sensitive values from entering `SnapshotElement.value`.
- Sanitise URLs, labels, context, options and text blocks.
- Validate action targets against the current snapshot.
- Independently verify AI-generated risk classifications.
- Consider an explicit handoff mechanism in a future contract revision.

Recommendation: retain the existing contract shapes for Day 1 and enforce safety through runtime validation. Any future contract changes must be agreed upon by all team members.

No immediate contract change requested, pending implementation guide review.

## 6. Day 1 demo restrictions

- Use only fictional consumer numbers and bill information.
- Use the mock electricity portal.
- Use a fixed screen plan without real LLM calls.
- Do not automate login, OTP or CAPTCHA.
- Stop before payment.
- Do not store or log sensitive information.

## 7. Team acknowledgement

- Member 1: Draft review prepared.
- Member 3: Acknowledgement pending.
- Member 4: Acknowledgement pending.

Final approval is pending review of implementation guide sections 4.2, 4.3, 4.5 and 4.7.
