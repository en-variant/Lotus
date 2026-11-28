# Lotus — Day 1 Overlay Screen Specification

**Owner:** Member 2  
**Branch:** sanath-mem-2  
**File:** docs/DAY1_OVERLAY_SPEC.md  
**Status:** Ready for Member 3 implementation

## 1. Goal

Design a simple, accessible first-screen overlay that helps users find and enter their electricity consumer account number without confusion.

The screen should guide users toward the next step without collecting unnecessary personal information or initiating payments.

## 2. Screen Title

**Find Your Electricity Bill**

## 3. Introductory Explanation

Enter your electricity consumer account number to get started. You can find this number on your latest electricity bill or electricity service receipt.

## 4. Input Fields

### Field 1 — Consumer Account Number

- Label: Consumer Account Number
- Placeholder: Enter your consumer account number
- Help text: Find this number on your electricity bill under Consumer Number or Account Number.
- Required: Yes
- Input type: Text
- Validation: Do not accept an empty or whitespace-only value. Preserve leading zeros and allow alphanumeric account numbers.

### Field 2 — Section / Subdivision Code

- Label: Section / Subdivision Code
- Placeholder: Enter section code (e.g. 204)
- Help text: Find this code in the service connection details on your electricity bill.
- Required: Confirm with the portal integration requirements before making it mandatory.

**Note:** The demo portal contains both fields. The registered mobile number is not requested on this first screen because it is optional in the demo portal and is not necessary for the initial design.

## 5. Main Button

**Button label:** Continue

Expected behaviour:
- Validate that the consumer account number is entered.
- Prevent submission when the required field is empty.
- Show a loading state while the lookup request is being processed.
- Never initiate payment.
- Never request an OTP, password, card number or payment credentials.

## 6. Secondary Controls

**Show original page**
- Label: Show original page
- Placement: Bottom-left of the overlay.
- Behaviour: Temporarily hides the Lotus overlay and reveals the underlying electricity portal.

**Stop Lotus**
- Label: Stop Lotus
- Placement: Bottom-right of the overlay.
- Behaviour: Closes the Lotus overlay.

## 7. Loading State

While processing the consumer-number lookup, display:

**Finding your electricity bill...**

The Continue button should be disabled while loading to prevent repeated submissions.

## 8. Error and Fallback Messages

### Empty field

Please enter your consumer account number to continue.

### Invalid
