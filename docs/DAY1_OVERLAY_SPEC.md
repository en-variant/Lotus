# Lotus — Day 1 overlay screen specification

**Purpose:** show one clear first step for the fictional electricity-bill demo. This is implementation guidance for Member 3; it does not authorize payment or any real-site action.

## Screen wireframe

```text
┌────────────────────────────────────────────────────────────┐
│ Lotus                                         [Stop Lotus] │
│                                                            │
│                  Find Your Electricity Bill               │
│   Enter the consumer account number from your latest       │
│   electricity bill or service receipt.                     │
│                                                            │
│   Consumer account number                                  │
│   [ Enter your consumer account number                  ]  │
│   Find it under “Consumer Number” or “Account Number.”      │
│                                                            │
│                       [ Continue ]                         │
│                                                            │
│   [ Show original page ]                                   │
│   Demo only. Lotus will not make a payment.                 │
└────────────────────────────────────────────────────────────┘
```

## Exact screen copy

- **Title:** Find Your Electricity Bill
- **Explanation:** Enter the consumer account number from your latest electricity bill or service receipt.
- **Field label:** Consumer account number
- **Placeholder:** Enter your consumer account number
- **Help text:** Find it under “Consumer Number” or “Account Number” on your bill.
- **Primary button:** Continue
- **Original page control:** Show original page
- **Stop control:** Stop Lotus
- **Privacy note:** Demo only. Lotus will not make a payment.

## Field behavior

- Require a non-empty, non-whitespace value before continuing.
- Preserve leading zeroes and accept letters and digits; treat the account number as text, not a number.
- Associate the visible label with the input. Keep keyboard focus visible and move focus to an inline error if the user submits an empty value.
- Do not ask for a registered mobile number, OTP, password, Aadhaar, card details, or payment credentials on this screen.
- Do not include the typed account number in a snapshot or send it to `POST /plan`. Member 3 may use it only for the user-confirmed local fill action on the fictional portal.

## Primary button states

1. **Ready:** Continue is enabled after a value is entered.
2. **Empty input error:** “Please enter your consumer account number to continue.” Do not submit.
3. **Loading:** show “Finding your electricity bill…” and disable Continue to prevent repeated submission.
4. **Lookup unavailable:** “We couldn’t continue on this demo page. You can show the original page and try there.” Keep Show original page available.

Continue starts only the demo lookup/fill step. It must never submit a payment, trigger a payment form, or imply that a bill was retrieved when it was not.

## Secondary controls

- **Show original page:** place in the lower-left area of the screen. Temporarily hide the Lotus overlay and reveal the underlying portal. Provide a clearly visible “Return to Lotus” control while the overlay is hidden.
- **Stop Lotus:** place in the top-right corner. Close the overlay and restore the original page's prior interaction/accessibility state.

## Demo target ID for Member 3

The mock portal marks its consumer-number input with the easy-to-find HTML attribute:

```html
data-lotus-demo-id="demo-consumer-number"
```

For the first integration, Member 3 may use **`demo-consumer-number`** as the snapshot ID for that input. If the collector generates its normal `eN` IDs instead, Member 4's server will match the visible input by its accessible name and return the actual snapshot ID. The literal demo ID is only a placeholder until that mapping is connected; never execute an action if the returned ID is not present in the current live snapshot.

## Out of scope for this screen

Voice input, language/profile controls, the bill summary, payment, login, OTP and CAPTCHA. The user must be handed back to the original page for login, OTP, CAPTCHA or payment-related steps.
