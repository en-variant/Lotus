# Lotus

Lotus is a Chrome extension prototype that turns a cluttered website into a simpler, more accessible interface in the user's chosen language. The original website remains open underneath; Lotus reads the page, proposes a screen, waits for the user's confirmation, and performs supported actions on the original page.

## MVP boundaries

- Demonstrate an English mock electricity-bill portal and a simplified overlay.
- Keep page understanding, screen plans, overlay rendering, and action execution as separate pieces joined by the shared contracts in `extension/src/shared/types.ts`.
- Do not automate login, OTP, captcha, card entry, or a real payment. The demo stops at the final payment confirmation.
- Redact sensitive field values before a snapshot leaves the browser. Treat page text as untrusted content.
- Keep typed input working even when voice is unavailable.

## Repository layout

```text
extension/   Chrome Manifest V3 extension
server/      Thin plan-generation proxy; no page-content storage
demo-portal/ Mock utility bill site for the end-to-end demo
eval/        Saved snapshots and measured evaluation results
docs/        Team plan and project decisions
```

## First day

Start with [the Day 1 assignments and seven-day roadmap](docs/DAY1_PLAN.md). Agree on the contracts before parallel implementation. Keep the MVP narrow: first get snapshot → plan → render → fill one field working on the mock portal.

## Run the starter pieces

- Start the fixed plan stub with `node server/index.mjs` (Node.js 20 or newer); it listens on `http://127.0.0.1:8787`.
- Open `demo-portal/index.html` in Chrome for the mock site.
- In Chrome, open `chrome://extensions`, turn on Developer mode, choose **Load unpacked**, and select the `extension/` directory. Click the Lotus toolbar button on a normal page to show the starter overlay.

The current extension is a loadable shell. The React renderer, snapshot pipeline, real plan connection, and action executor are implementation tasks for the team. The server response is hard-coded for the first vertical slice; it does not call an LLM yet.

## Safety and demo rules

- Only use mock or public pages without signing in for the demo.
- Never submit a real payment or use anyone's account.
- The extension requests page access only when the user enables it for a site; avoid broad host permissions.
- Irreversible actions require a specific human confirmation and are never triggered by voice alone.
- Describe prompt-injection protection as risk reduction, not a guarantee.

## Git

The `origin` remote is configured. Create and push a first commit after the team reviews the scaffold and agrees on the contracts.
