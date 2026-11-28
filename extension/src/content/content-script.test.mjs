import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Window } from "happy-dom";

const script = await readFile(new URL("./content-script.js", import.meta.url), "utf8");

function createPage() {
  const window = new Window({ url: "http://localhost/demo-portal" });
  window.document.body.innerHTML = "<main id='portal'>Mock utility portal</main>";
  return window;
}

test("mounts an accessible bill lookup screen and isolates the page", () => {
  const window = createPage();
  window.eval(script);

  const host = window.document.getElementById("lotus-extension-host");
  const shadow = host.shadowRoot;
  assert.ok(host);
  assert.equal(shadow.querySelector("h1").textContent, "Find Your Electricity Bill");
  assert.equal(shadow.querySelector("label[for='consumer-account']").textContent, "Consumer account number");
  assert.ok(shadow.querySelector("button#continue"));
  assert.ok(shadow.querySelector("button#original"));
  assert.ok(shadow.querySelector("button#stop"));
  assert.equal(window.document.body.inert, true);
  assert.equal(window.document.body.getAttribute("aria-hidden"), "true");
  window.happyDOM.abort();
});

test("rejects an empty account number with an inline accessible error", () => {
  const window = createPage();
  window.eval(script);
  const shadow = window.document.getElementById("lotus-extension-host").shadowRoot;
  const form = shadow.querySelector("#lookup-form");
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  const error = shadow.querySelector("#account-error");
  assert.equal(error.hidden, false);
  assert.equal(error.textContent, "Please enter your consumer account number to continue.");
  assert.equal(shadow.querySelector("#lookup-status").hidden, true);
  window.happyDOM.abort();
});

test("valid input gets an honest integration fallback without a network request", () => {
  const window = createPage();
  let fetchCalls = 0;
  window.fetch = async () => { fetchCalls++; throw new Error("unexpected network request"); };
  window.eval(script);
  const shadow = window.document.getElementById("lotus-extension-host").shadowRoot;
  const input = shadow.querySelector("#consumer-account");
  input.value = "FICT-00123";
  shadow.querySelector("#lookup-form").dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true })
  );

  const status = shadow.querySelector("#lookup-status");
  assert.equal(status.hidden, false);
  assert.match(status.textContent, /page-action connection is not available yet/i);
  assert.doesNotMatch(status.textContent, /FICT-00123/);
  assert.equal(fetchCalls, 0);
  window.happyDOM.abort();
});

test("show original and return controls restore page state, then stop closes Lotus", () => {
  const window = createPage();
  window.eval(script);
  const host = window.document.getElementById("lotus-extension-host");
  const shadow = host.shadowRoot;
  shadow.querySelector("#original").click();

  assert.equal(host.style.display, "none");
  assert.equal(window.document.body.inert, false);
  const returnButton = [...window.document.querySelectorAll("button")]
    .find(button => button.textContent === "Return to Lotus");
  assert.ok(returnButton);
  returnButton.click();
  assert.equal(host.style.display, "block");
  assert.equal(window.document.body.inert, true);

  shadow.querySelector("#stop").click();
  assert.equal(window.document.getElementById("lotus-extension-host"), null);
  assert.equal(window.document.body.inert, false);
  assert.equal(window.document.body.hasAttribute("aria-hidden"), false);
  window.happyDOM.abort();
});

test("running the injected script a second time closes the existing overlay cleanly", () => {
  const window = createPage();
  window.eval(script);
  assert.equal(window.document.body.inert, true);
  window.eval(script);
  assert.equal(window.document.getElementById("lotus-extension-host"), null);
  assert.equal(window.document.body.inert, false);
  window.happyDOM.abort();
});
