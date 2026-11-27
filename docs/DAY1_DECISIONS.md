# Day 1 safety and contract review

Member 1: fill in these decisions after checking the implementation guide and shared types. Share the result with Members 3 and 4 before they connect the extension and server.

- **Sensitive fields whose values stay in the browser:** password, OTP, payment card, Aadhaar, and any other field that contains identity or payment secrets. Snapshot only the field type, never its current value.
- **Actions that require a clear user confirmation:** navigation or submission; irreversible actions such as paying, sending, deleting, or confirming a booking require a confirmation card that states exactly what will happen. Voice alone must never trigger them.
- **Steps Lotus must hand back to the original page:** login, OTP, captcha, and any card-detail entry or payment-page step.
- **Contract changes agreed by the team (if any):** none recorded yet.
