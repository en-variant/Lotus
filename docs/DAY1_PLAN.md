# Lotus — Day 1 work plan

**Today’s objective:** each person produces a concrete piece that fits together into the first demo slice. At the end of Day 1, a teammate should be able to open the mock electricity portal, enable Lotus, and see a simplified bill lookup screen. The screen may use a fixed plan today. It must not make a real payment or send sensitive field values to the server.

This plan assigns the work for today only. Members 1 and 2 have smaller, review/design tasks; Members 3 and 4 have the main implementation tasks. Do not add voice, real LLM calls, login automation, or real payment processing today.

## What you should have open

- This plan: `docs/DAY1_PLAN.md`
- Product guide: `Sugama Implementation Guide.docx`
- Shared contracts: `extension/src/shared/types.ts`
- Mock portal: `demo-portal/index.html`
- Extension manifest and shell: `extension/manifest.json` and `extension/src/content/content-script.js`
- Local plan endpoint: `server/index.mjs`

## Before work starts — all four together (15 minutes)

1. Read the Day 1 objective above aloud and agree that the demo stops before any payment.
2. Open the mock portal in Chrome. Use only the fictional data already on that page.
3. Agree that today’s first interaction is: **show a bill lookup screen with a consumer-number input**. Showing the bill summary is a follow-on if the first interaction works early.
4. Open `extension/src/shared/types.ts`. Keep these contract shapes as the baseline. If a change is necessary, tell all four people and update the shared types before coding against the change.
5. Exchange contact details and use the handoffs in this plan. Ask for help as soon as a dependency is blocked; do not wait until the end of the day.

---

## Member 1 — contract and safety owner (small assignment, about 1–1.5 hours)

### Goal

Give the implementers a short, unambiguous rule sheet for what page data Lotus may send and which actions need a human. This task is complete when Members 3 and 4 can implement the first slice without guessing about sensitive data or confirmation rules.

### Steps 

1. Read guide sections **4.2 Page understanding**, **4.3 Planning**, **4.5 Action executor**, and **4.7 Safety and trust**.
2. Inspect `extension/src/shared/types.ts`, especially `SnapshotElement`, `Action`, and `RiskTier`.
3. Update `docs/DAY1_DECISIONS.md` with the following in plain language:
   - Which values must never leave the browser (at minimum password, OTP, card, and Aadhaar values).
   - Which snapshot information is okay to send for the mock demo (role, accessible name, element ID, visibility, short context, and non-sensitive options).
   - Which operations need a user tap/confirmation, and which steps must be handed back to the original website (login, OTP, captcha, card entry/payment).
   - Any mismatch between the guide and the shared TypeScript types. If there is no mismatch, explicitly write “No contract change requested.”
4. Send the completed note to Members 3 and 4. Ask each to reply that they understand the rules before their pieces are connected.
5. Review the result of the full demo with the team at end of day. Record any data or safety issue that appeared.

### Deliverable

`docs/DAY1_DECISIONS.md`, completed and shared with Members 3 and 4. 

### End goal / acceptance check

- The note answers every bullet in step 3.
- It says that sensitive values stay in the browser.
- It says that this demo stops before payment and does not automate login, OTP, or captcha.
- Members 3 and 4 acknowledge the note.

### Do not take on today

Do not implement the executor, review every UI detail, or build server security. Keep this a short unblocker task; after it is accepted, help the group run the demo or document issues.

---

## Member 2 — overlay screen designer (small assignment, about 1.5–2 hours)

### Goal

Specify exactly what the first Lotus screen should show so Member 3 can implement it without making UI decisions. The first screen is for a person who needs help finding and entering a utility consumer number.

### Steps

1. Load the current `extension/` directory as an unpacked extension in Chrome and click the toolbar button on `demo-portal/index.html`.
2. Look at the current placeholder. Decide what should replace its text and controls for the first bill lookup step.
3. Create `docs/DAY1_OVERLAY_SPEC.md` with a simple wireframe (text is fine) and exact copy for:
   - Screen title.
   - One-sentence explanation of where to find the consumer number.
   - Consumer-number field label and example/help text.
   - Main button label.
   - “Show original page” and “Stop Lotus” control labels and placement.
   - Loading text and a plain-language error/fallback message.
4. Include basic behavior: field must have a visible label; keyboard focus must be visible; pressing the main button should not trigger payment; “Show original page” reveals the underlying portal; “Stop Lotus” closes the overlay.
5. Send the spec to Member 3. If Member 3 has already completed the snapshot/server wiring, implement only the static first-screen markup/styles in the existing content script and coordinate before editing the same file.
6. At end of day, compare the rendered screen against the spec and write down any mismatch.

### Deliverable

`docs/DAY1_OVERLAY_SPEC.md`, with exact wording and a wireframe. If time allows and Member 3 is not editing the file, also provide the static screen markup/styles.

### End goal / acceptance check

- The screen can be understood without explaining it verbally.
- It has one clear next step, a labeled consumer-number field, a main button, and the original-page/stop controls.
- The spec defines loading and failure states.
- Member 3 confirms the spec is implementable and uses it for the first screen.

### Do not take on today

Do not build voice input, Kannada/Hindi translations, profile settings, or the complete component library. Those are later tasks; today is one carefully specified screen.

---

## Member 3 — extension and first-screen implementation (main assignment, about 4–6 hours)

### Goal

Make the Chrome extension open a Lotus overlay on the mock site and display a useful first bill-lookup screen. A hard-coded plan is acceptable today; getting the extension shell → overlay path working is the priority.

### Steps

1. Load `extension/` as an unpacked extension. Confirm the toolbar click injects `extension/src/content/content-script.js` and that clicking it again closes the overlay.
2. Read Member 2’s `docs/DAY1_OVERLAY_SPEC.md`. Tell Member 2 immediately if any requirement is unclear or too large for today.
3. Replace the placeholder content in `extension/src/content/content-script.js` with the specified bill lookup screen. Keep it isolated in the existing Shadow DOM so the website’s styles do not break it.
4. Implement the consumer-number field with a real associated label and a keyboard-visible focus state. Make “Show original page” and “Stop Lotus” work as the spec describes.
5. Implement `collectSnapshot()` in the content script. For the mock page, collect visible headings, buttons, links, text inputs, and selects. Give each element an ID such as `e1`, add that ID to the DOM element as `data-lotus-id`, and collect its role, accessible name, visible state, and short nearby context.
6. Never include current values from password, OTP, card, Aadhaar, or other sensitive fields. For today, it is acceptable to omit all input values from the snapshot.
7. Connect the extension to `POST http://127.0.0.1:8787/plan` if Member 4’s endpoint is ready. Send a JSON body containing the agreed `Snapshot`, and render the returned `ScreenPlan`. If the endpoint is not ready, show the screen from a local fixed plan and record that the server hookup remains open.
8. If the snapshot ID referenced by the response is not present in the current snapshot, show a clear fallback/error state; do not guess a DOM selector.
9. Coordinate file ownership: Member 2 may provide a spec but should not edit this file while you are implementing it unless you agree on a handoff first.

### Deliverable

Updated `extension/src/content/content-script.js` and, if the endpoint is connected, a working content-script-to-server request. Keep any additional files under `extension/src/` and update the manifest only if needed.

### End goal / acceptance check

On a normal Chrome tab displaying `demo-portal/index.html`:

1. Clicking the Lotus toolbar icon opens one overlay, not duplicates.
2. The overlay shows the bill lookup screen described by Member 2’s spec.
3. “Show original page” temporarily reveals the portal; return control restores the overlay.
4. “Stop Lotus” removes the overlay.
5. The snapshot contains visible page controls with stable IDs and names, and no sensitive values.
6. If wired today, the plan request succeeds against Member 4’s local server. Otherwise, the fixed-plan fallback works and the missing connection is listed as a blocker.

### Do not take on today

Do not implement payment, voice, multi-step navigation, cache, or advanced accessibility-tree support. Do not add broad `host_permissions` to the manifest.

---

## Member 4 — mock portal and local plan endpoint (main assignment, about 4–6 hours)

### Goal

Make a believable but safe utility-bill demo page and a local `/plan` endpoint that Member 3 can connect to. Use fictional information only. The endpoint returns a fixed, schema-shaped plan today; it does not need an LLM.

### Steps

1. Start the current server with `node server/index.mjs` and confirm it listens at `http://127.0.0.1:8787`.
2. Review `demo-portal/index.html`. Keep the page intentionally cluttered and English-only, but ensure the key elements have labels or accessible names so Member 3’s snapshot can identify them.
3. Improve the mock lookup flow: submitting a fictional consumer number displays a fictional bill summary with amount, due date, energy charge, and convenience fee. Mark the page as a demo and make clear that it does not take payment.
4. Read Member 3’s snapshot request shape. Agree with Member 3 which snapshot element ID should be bound to the consumer-number field and what the plan should return. Do not assume IDs; they are generated from the page snapshot.
5. Update `server/index.mjs` so `POST /plan` accepts JSON and returns a `ScreenPlan` matching the agreed shape and actual snapshot IDs. For today, fixed English text is sufficient.
6. Return `Content-Type: application/json`, handle `OPTIONS` for a local browser request, and return a clear 400 response for malformed JSON. Do not write request bodies to disk or log page contents or input values.
7. Send Member 3 a concise integration note: start command, endpoint URL, example request JSON, example response JSON, and any CORS behavior they need to know.
8. At end of day, walk through the portal lookup with the group and correct any mismatch between the plan and the visible page.

### Deliverables

- Updated `demo-portal/index.html` with a functional fictional lookup and bill summary.
- Updated `server/index.mjs` with a local JSON `/plan` endpoint.
- A request/response example sent to Member 3 (it may be recorded in `docs/DAY1_DECISIONS.md` or sent in the group chat).

### End goal / acceptance check

- The portal lookup responds to a fictional consumer number and displays the bill details without contacting a real service.
- The bill details include a fee breakdown with a plain visible convenience-fee line.
- `POST /plan` returns valid JSON with `screen_id`, `title`, `language`, and `components` matching `ScreenPlan`.
- The response references only element IDs from the snapshot Member 3 sent.
- Malformed JSON gets a clear client error; request content is not persisted or printed.
- Member 3 can start the server and connect to it from the extension.

### Do not take on today

Do not add an LLM key, call a paid model, store snapshots, process real payments, or build authentication. The fixed response is enough for the first end-to-end slice.

---

## End-of-day group walkthrough (30–45 minutes)

Run this together and mark each line **Pass**, **Fail**, or **Blocked**:

1. Open `demo-portal/index.html` in Chrome.
2. Confirm the page clearly says it is fictional and cannot take payments.
3. Click the extension icon and confirm one overlay appears.
4. Confirm the screen gives one clear consumer-number task.
5. Confirm “Show original page” and “Stop Lotus” behave correctly.
6. If the server is connected, confirm the screen plan is returned by the local `/plan` endpoint. If not, confirm the hard-coded plan works and record the server connection as the first task tomorrow.
7. Confirm no account value or sensitive field value is sent to or logged by the server.
8. Write down failures, owner, and next action. Do not report incomplete steps as working.

## Definition of done for Day 1

The team has a safe mock portal, a documented first-screen design, completed safety/contract decisions, a loadable extension shell, and a demonstrated overlay on the mock portal. The preferred stretch outcome is that the extension sends a snapshot to the local fixed-plan endpoint and renders its response. A hard-coded plan is a valid Day 1 fallback if the server connection blocks the demo.

## Seven-day outcome map

| Day | Focus | Exit outcome |
|---|---|---|
| 1 | Contracts, scaffold, mock portal, fixed plan, first overlay slice | Team can demonstrate a safe simplified screen on the mock portal |
| 2 | Snapshot quality and executor | Reliable visible-element snapshot; fill/click with outcome checks on the mock |
| 3 | Overlay and profile | React overlay, large-print/high-contrast profile, original-page/stop controls |
| 4 | Proxy and planning | Validated plan response, safe known-ID targets, basic cache and failure fallback |
| 5 | Multi-step bill flow and safety | Fee summary, confirmation card, login/OTP/payment handoff behavior |
| 6 | Language/voice and evaluation | Typed path complete; test Kannada/Hindi voice on demo devices; begin measured evaluation |
| 7 | Stabilize and present | Freeze features, fix blockers, rehearse demo, prepare honest results and backup recording |

This is a sequencing guide, not a promise that every stretch feature fits. Protect the end-to-end mock flow first; cut optional voice/API integrations before safety, typed input, or the final confirmation flow.
