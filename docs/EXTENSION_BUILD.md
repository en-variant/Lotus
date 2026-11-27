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

## Load the extension

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `Lotus/extension` folder.
5. Enable access to file URLs for local demo testing.

## Development workflow

Edit the source files inside `extension/src/`.

After modifying the content script or its imported modules, run:

```bash
npm run build
```

Reload the extension and refresh the demo portal.

## Build architecture

esbuild bundles the content script and shared TypeScript modules into `dist/content-script.js`.

The service worker injects this generated file into the browser.

The `node_modules` and `dist` directories are excluded from Git.

## Current implementation

- DOM snapshot collection
- Element ID assignment
- Accessible name extraction
- Nearby context extraction
- Trusted text allowlist
- Privacy sanitizer integration
- Original-page toggle and cleanup

## Pending integration

- Member 2's simplified overlay specification
- Member 4's backend ScreenPlan integration
- Action safety and final integration testing

Privacy testing has been performed on the fictional electricity demo portal only.
