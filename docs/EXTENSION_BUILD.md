# Lotus Extension — Build Instructions

## Prerequisites

- Node.js and npm
- Google Chrome

## Installation

From the Lotus repository root, run:

```bash
cd extension
npm ci
npm run build
```

## Load the Extension

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `Lotus/extension` folder.
5. Enable access to file URLs for local demo testing.

## Development Workflow

Edit the source files inside `extension/src/`.

After modifying the content script or its imported modules, run the following command from the extension directory:

```bash
npm run build
```

Reload the extension and refresh the demo portal.

## Build Architecture

esbuild bundles the content script and shared TypeScript modules into `dist/content-script.js`.

The service worker injects this generated file into the browser.

The `node_modules` and `dist` directories are excluded from Git.

## Frontend File Structure

- `content-script.js` — DOM snapshot collection, privacy sanitizer integration, portal detection, overlay lifecycle and focus management.
- `overlay-components.js` — Reusable UI components, electricity bill lookup screen, input validation and preliminary ScreenPlan renderer.
- `overlay-styles.js` — Responsive styling, visual design, accessibility styling and contrast support.

## Current Implementation

- DOM snapshot collection.
- Stable element ID assignment.
- Accessible name extraction.
- Nearby context extraction.
- Trusted text allowlist.
- Privacy sanitizer integration.
- Simplified electricity bill lookup interface based on Member 2's specification.
- Reusable UI components and responsive design.
- Consumer account number validation.
- Preservation of leading zeros and alphanumeric account numbers.
- Local demo portal restriction.
- Unsupported website fallback screen.
- Fictional demo privacy warning.
- Original-page toggle, restore and stop controls.
- Keyboard focus containment.
- Background page isolation using inert and aria-hidden.
- Event listener cleanup and page state restoration.

## Safety and Privacy

The current implementation is intended for the fictional electricity demo portal only.

- Input values are excluded from DOM snapshots.
- The sanitizer removes unapproved snapshot content.
- Account information entered into the overlay is not transmitted to a backend.
- Dynamic ScreenPlan action buttons are intentionally disabled.
- Real payments, passwords, OTPs and sensitive account information must not be processed.
- The local portal restriction is a temporary demo safeguard, not a production authentication mechanism.

## Testing

The implementation has been tested using automated safety tests, headless Chrome regression tests and manual Chrome testing.

Latest automated results reported by the development agent:

- Safety and privacy tests: 16/16 passed.
- Demo portal functionality: 14/14 passed.
- Unsupported website handling: 3/3 passed.
- Dynamic component safety: 9/9 passed.
- Consumer account validation tests: passed.
- Extension build: successful.

Final manual regression testing and VoiceOver accessibility verification remain pending.

## Pending Integration

- Member 4's backend ScreenPlan endpoint.
- Backend request and response validation.
- Dynamic ScreenPlan rendering integration.
- Choice component support.
- Trusted action mapping and safety validation.
- Live DOM target revalidation.
- Explicit user confirmation before executing actions.
- User profile, language and font scaling integration.
- Full accessibility and integration testing.

## Current Limitation

The electricity bill lookup screen currently operates as a local frontend fallback. It validates input but does not retrieve actual bill information, execute website actions or process payments.

The backend integration is required before Lotus can generate and execute dynamic website-specific experiences.
