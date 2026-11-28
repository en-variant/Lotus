# Member 4 — local plan endpoint handoff

## Start the server

From the repository root:

```bash
node server/index.mjs
```

It listens on `http://127.0.0.1:8787`. Only `POST /plan` and its CORS preflight are supported. The server returns a fixed English `ScreenPlan`; there is no LLM call and no request-body logging or storage.

## Request contract for Member 3

Send a sanitized snapshot wrapped in a `snapshot` property:

```json
{
  "snapshot": {
    "url": "",
    "title": "City Electricity Services — Demo Portal",
    "elements": [
      {
        "id": "demo-consumer-number",
        "role": "text-input",
        "name": "Consumer Account Number",
        "type": "text",
        "visible": true,
        "context": "Enter Service Connection Particulars"
      }
    ],
    "text_blocks": []
  },
  "goal": "Find my electricity bill"
}
```

Do not send input values or a raw page URL. The server rejects a snapshot that contains an element `value` property or a non-empty `url`.

## Response contract

If an element is a visible `text-input` whose accessible name/context indicates “Consumer Number” or “Consumer Account Number”, the plan binds to the actual ID in the snapshot. With the example request above, the response is:

```json
{
  "screen_id": "lotus-electricity-bill-lookup",
  "title": "Find Your Electricity Bill",
  "language": "en",
  "components": [
    { "type": "heading", "text": "Find Your Electricity Bill" },
    { "type": "explainer", "text": "Enter the consumer account number from your latest electricity bill or service receipt." },
    { "type": "field", "bind": "demo-consumer-number", "label": "Consumer account number", "input": "text" },
    { "type": "warning", "text": "Fictional demo only. Lotus will not make a payment." }
  ]
}
```

### Temporary demo target ID

The shared placeholder is **`demo-consumer-number`**. The mock portal marks its account-number input with `data-lotus-demo-id="demo-consumer-number"`. Member 3 can preserve that value as the snapshot ID for this input. If the collector instead assigns an ID such as `e12`, it should include the accessible name “Consumer Account Number”; the server will return that actual snapshot ID.

If no matching input is in the snapshot, the server uses the placeholder ID so the fixed plan shape remains easy to connect. Member 3 must treat that as an unresolved placeholder and must not execute an action unless the ID exists in the current live snapshot. Replace the placeholder with the actual ID when the collector is ready.

## Error responses

- Malformed JSON: HTTP 400 with `{ "error": "Request body must be valid JSON." }`.
- Missing `snapshot.elements`: HTTP 400 with an example demo ID.
- Snapshot contains field values or a raw URL: HTTP 400; sanitize it in the browser first.
- Body larger than 128 KB: HTTP 413.
- Unknown route: HTTP 404; unsupported method on `/plan`: HTTP 405.

This endpoint is a local Day 1 stub. Production LLM integration, schema validation, authentication/rate limiting, and hosting are later work.
