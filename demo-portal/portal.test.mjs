import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Window } from "happy-dom";

const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const pageScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(pageScript, "portal must provide its inline demo behavior");

function createPortal() {
  const window = new Window({ url: "http://localhost/demo-portal" });
  const body = html.match(/<body>([\s\S]*?)<\/body>/i)?.[1];
  assert.ok(body);
  window.document.body.innerHTML = body;
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.eval(pageScript);
  return window;
}

test("portal labels the demo target and starts with summary hidden", () => {
  const window = createPortal();
  const input = window.document.querySelector("#consumer-number");
  assert.equal(input.dataset.lotusDemoId, "demo-consumer-number");
  assert.equal(window.document.querySelector("label[for='consumer-number']").textContent.trim(), "Consumer Account Number");
  assert.equal(window.document.querySelector("#bill-summary").hidden, true);
  assert.match(window.document.body.textContent, /does not connect to an electricity provider/i);
  window.happyDOM.abort();
});

test("empty account number shows validation and does not reveal fictional bill", () => {
  const window = createPortal();
  const form = window.document.querySelector("#bill-form");
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  assert.match(window.document.querySelector("#lookup-message").textContent, /enter a fictional consumer account number/i);
  assert.equal(window.document.querySelector("#bill-summary").hidden, true);
  window.happyDOM.abort();
});

test("fictional account submission reveals the fixed bill without echoing the account", () => {
  const window = createPortal();
  const input = window.document.querySelector("#consumer-number");
  input.value = "FAKE-000123";
  window.document.querySelector("#bill-form").dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true })
  );

  assert.equal(window.document.querySelector("#bill-summary").hidden, false);
  assert.match(window.document.querySelector("#bill-summary").textContent, /15 December 2026/);
  assert.match(window.document.querySelector("#bill-summary").textContent, /₹ 18\.00/);
  assert.match(window.document.querySelector("#bill-summary").textContent, /₹ 495\.00/);
  assert.match(window.document.querySelector("#lookup-message").textContent, /No provider was contacted/);
  assert.doesNotMatch(window.document.body.textContent, /FAKE-000123/);
  window.happyDOM.abort();
});

test("starting another lookup resets the form and hides the bill", () => {
  const window = createPortal();
  window.document.querySelector("#consumer-number").value = "FAKE-0042";
  window.document.querySelector("#bill-form").dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true })
  );
  window.document.querySelector("#new-lookup").click();

  assert.equal(window.document.querySelector("#consumer-number").value, "");
  assert.equal(window.document.querySelector("#bill-summary").hidden, true);
  assert.equal(window.document.querySelector("#lookup-message").textContent, "");
  window.happyDOM.abort();
});
