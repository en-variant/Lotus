import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createLotusPlanServer, DEMO_CONSUMER_FIELD_ID } from "./index.mjs";

const server = createLotusPlanServer();
let baseUrl;

before(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server.closeAllConnections();
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

const requestPlan = (snapshot, init = {}) => fetch(`${baseUrl}/plan`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ snapshot }),
  ...init
});

test("returns the fixed ScreenPlan bound to the matching live snapshot ID", async () => {
  const response = await requestPlan({
    url: "",
    title: "City Electricity Services",
    elements: [{
      id: "e12",
      role: "text-input",
      name: "Consumer Account Number",
      type: "text",
      visible: true,
      context: "Service Connection Particulars"
    }],
    text_blocks: []
  });

  assert.equal(response.status, 200);
  const plan = await response.json();
  assert.equal(plan.screen_id, "lotus-electricity-bill-lookup");
  assert.equal(plan.components.find(component => component.type === "field").bind, "e12");
  assert.ok(plan.components.some(component => component.type === "warning"));
});

test("uses the clearly marked demo ID when the snapshot has no matching field", async () => {
  const response = await requestPlan({ url: "", title: "Demo", elements: [], text_blocks: [] });
  const plan = await response.json();

  assert.equal(response.status, 200);
  assert.equal(plan.components.find(component => component.type === "field").bind, DEMO_CONSUMER_FIELD_ID);
});

test("rejects malformed JSON with HTTP 400", async () => {
  const response = await fetch(`${baseUrl}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not-json"
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /valid JSON/);
});

test("rejects requests without a snapshot element list", async () => {
  const response = await fetch(`${baseUrl}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ snapshot: {} })
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /elements array/);
});

test("rejects snapshots containing input values", async () => {
  const response = await requestPlan({
    url: "",
    elements: [{ id: "e1", role: "text-input", name: "Consumer Number", visible: true, value: "PRIVATE-123" }]
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /omit all element values/);
});

test("rejects a raw URL before planning", async () => {
  const response = await requestPlan({ url: "https://portal.test/?token=secret", elements: [] });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /omit all element values and the raw page URL/);
});

test("rejects bodies larger than the documented limit", async () => {
  const response = await fetch(`${baseUrl}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ snapshot: { url: "", elements: [], text_blocks: ["x".repeat(130 * 1024)] } })
  });
  assert.equal(response.status, 413);
  assert.match((await response.json()).error, /128 KB/);
});

test("supports CORS preflight and rejects unsupported methods/routes", async () => {
  const preflight = await fetch(`${baseUrl}/plan`, { method: "OPTIONS" });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-methods"), "POST, OPTIONS");

  const wrongMethod = await fetch(`${baseUrl}/plan`);
  assert.equal(wrongMethod.status, 405);

  const missingRoute = await fetch(`${baseUrl}/missing`, { method: "POST", body: "{}" });
  assert.equal(missingRoute.status, 404);
});
