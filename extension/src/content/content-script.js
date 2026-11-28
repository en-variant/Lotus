import { sanitizeSnapshot } from "../shared/sanitizer.ts";
import { OVERLAY_STYLES, RESTORE_BUTTON_STYLES } from "./overlay-styles.js";
import {
  renderElectricityLookupScreen,
  renderUnsupportedPageScreen,
  createRestoreButton
} from "./overlay-components.js";
(() => {
  function isVisible(element) {
  if (!element || !element.isConnected) {
    return false;
  }

  if (element.getClientRects().length === 0) {
    return false;
  }

  const style = window.getComputedStyle(element);

  if (
    style.visibility === "hidden" ||
    style.visibility === "collapse"
  ) {
    return false;
  }

  let current = element;

  while (current) {
    const currentStyle = window.getComputedStyle(current);

    if (
      current.hidden ||
      currentStyle.display === "none" ||
      Number(currentStyle.opacity) === 0 ||
      current.getAttribute("aria-hidden") === "true"
    ) {
      return false;
    }

    current = current.parentElement;
  }

  return true;
}
function getElementRole(element) {
  const tag = element.tagName.toLowerCase();

  if (/^h[1-6]$/.test(tag)) {
    return "heading";
  }

  if (tag === "button") {
    return "button";
  }

  if (tag === "a" && element.hasAttribute("href")) {
    return "link";
  }

  if (tag === "select") {
    return "select";
  }

  if (tag === "table") {
    return "table";
  }

  if (tag === "textarea") {
    return "text-input";
  }

  if (tag === "input") {
    const type = element.type;

    if (type === "hidden") {
      return null;
    }

    if (type === "checkbox") {
      return "checkbox";
    }

    if (type === "radio") {
      return "radio";
    }

    if (["submit", "button", "reset"].includes(type)) {
      return "button";
    }

    if (["text", "number", "email", "tel",
         "search", "url", "password"].includes(type)) {
      return "text-input";
    }
  }

  return null;
}
function getAccessibleName(element) {
  const normalize = text =>
    (text || "").replace(/\s+/g, " ").trim();

  const labelledBy = element.getAttribute("aria-labelledby");

  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map(id => document.getElementById(id)?.textContent || "")
      .join(" ");

    if (normalize(text)) {
      return normalize(text);
    }
  }

  const ariaLabel = element.getAttribute("aria-label");

  if (normalize(ariaLabel)) {
    return normalize(ariaLabel);
  }

  if (element.labels?.length) {
    return normalize(
      Array.from(element.labels)
        .map(label => label.textContent)
        .join(" ")
    );
  }

  const tag = element.tagName.toLowerCase();

  if (["input", "textarea", "select"].includes(tag)) {
    return normalize(
      element.getAttribute("placeholder") ||
      element.getAttribute("title") ||
      element.getAttribute("name")
    );
  }

  return normalize(
    element.textContent ||
    element.getAttribute("title")
  );
 }
let nextElementId = 1;
const elementIds = new WeakMap();

function getElementId(element) {
  if (elementIds.has(element)) {
    return elementIds.get(element);
  }

  const id = `e${nextElementId++}`;

  elementIds.set(element, id);
  element.setAttribute("data-lotus-id", id);

  return id;
}
function getContext(element) {
  let container = element.closest(
    "section, form, article, main, fieldset"
  );

  while (container) {
    const headings = container.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, legend"
    );

    const heading = Array.from(headings)
      .filter(item =>
        item !== element &&
        isVisible(item) &&
        (item.compareDocumentPosition(element) &
          Node.DOCUMENT_POSITION_FOLLOWING)
      )
      .pop();

    if (heading) {
      return heading.textContent
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 150);
    }

    container = container.parentElement?.closest(
      "section, form, article, main, fieldset"
    );
  }

  return "";
}
function collectSnapshot() {
  const selector = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "button",
    "a[href]",
    "input",
    "textarea",
    "select",
    "table"
  ].join(",");

  const elements = [];

  document.querySelectorAll(selector).forEach(element => {
    if (element.closest("#lotus-extension-host")) {
      return;
    }

    if (!isVisible(element)) {
      return;
    }

    const role = getElementRole(element);

    if (!role) {
      return;
    }

    const item = {
      id: getElementId(element),
      role: role,
      name: getAccessibleName(element),
      visible: true,
      context: getContext(element)
    };

    if (element.tagName === "INPUT") {
      item.type = element.type;
    }

    if (role === "select") {
      item.options = Array.from(element.options)
        .map(option => option.textContent.trim());
    }

    elements.push(item);
  });

  const textBlocks = Array.from(
    document.querySelectorAll("p, h1, h2, h3, h4, h5, h6")
  )
    .filter(element => isVisible(element))
    .map(element =>
      element.textContent.replace(/\s+/g, " ").trim()
    )
    .filter(Boolean);

  return {
    url: "",
    title: document.title,
    elements: elements,
    text_blocks: textBlocks
 };
}
  const hostId = "lotus-extension-host";
  const restoreButtonId = "lotus-restore-button";
  const restoreStyleId = "lotus-restore-style";
  const existing = document.getElementById(hostId);
  if (existing) {
    existing.__lotusClose?.();
    return;
  }
  const approvedText = new Set([
  "City Electricity Services — Demo Portal",

  "Monthly Energy Consumption and Dues",
  "Enter Service Connection Particulars",
  "Illustrative Current Charges",

  "Section / Subdivision Code",
  "Consumer Account Number",
  "Registered Mobile Number",
  "Fetch Bill Details",

  "text",

  "Consumer Services Portal > Online Bill Enquiry and Payment",

  "Please ensure that the consumer account particulars entered below correspond to the registered service connection. Payments are subject to applicable transaction levies.",

  "Demo portal only. The amounts and account fields are fictional. This page does not process payments."
]);
const rawSnapshot = collectSnapshot();
const snapshot = sanitizeSnapshot(rawSnapshot, approvedText);

  function isTrustedDemoPortal(sanitizedSnapshot) {
    const protocol = window.location.protocol;
    let pathname = "";
    try {
      pathname = decodeURIComponent(window.location.pathname);
    } catch {
      return false;
    }

    const isLocalFileDemo =
      protocol === "file:" && pathname.endsWith("/demo-portal/index.html");

    const isLocalServerDemo =
      (protocol === "http:" || protocol === "https:") &&
      ["127.0.0.1", "localhost", "[::1]"].includes(window.location.hostname) &&
      (pathname === "/" ||
        pathname.endsWith("/index.html") ||
        pathname.endsWith("/demo-portal/") ||
        pathname.endsWith("/demo-portal/index.html"));

    if (!isLocalFileDemo && !isLocalServerDemo) {
      return false;
    }

    return (
      sanitizedSnapshot.title === "City Electricity Services — Demo Portal" &&
      sanitizedSnapshot.text_blocks.includes(
        "Demo portal only. The amounts and account fields are fictional. This page does not process payments."
      ) &&
      sanitizedSnapshot.elements.some(
        el => el.role === "text-input" && el.name === "Consumer Account Number"
      )
    );
  }

  function createPageInertManager(hostEl, excludedIds) {
    const savedStates = [];

    const apply = () => {
      if (savedStates.length > 0) {
        return;
      }
      for (const child of Array.from(document.documentElement.children)) {
        if (
          child === hostEl ||
          child.tagName === "HEAD" ||
          excludedIds.has(child.id)
        ) {
          continue;
        }
        savedStates.push({
          el: child,
          hadInert: Boolean(child.inert),
          prevAriaHidden: child.getAttribute("aria-hidden")
        });
        child.inert = true;
        child.setAttribute("aria-hidden", "true");
      }
    };

    const restore = () => {
      while (savedStates.length > 0) {
        const { el, hadInert, prevAriaHidden } = savedStates.pop();
        if (!el.isConnected) {
          continue;
        }
        el.inert = hadInert;
        if (!hadInert) {
          el.removeAttribute("inert");
        }
        if (prevAriaHidden === null) {
          el.removeAttribute("aria-hidden");
        } else {
          el.setAttribute("aria-hidden", prevAriaHidden);
        }
      }
    };

    return { apply, restore };
  }

  const previousActiveElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const body = document.body;
  const previousBodyInert = body?.inert ?? false;
  const previousAriaHidden = body?.getAttribute("aria-hidden");
  const previousOverflow = document.documentElement.style.overflow;
  let restoreButton;

  const host = document.createElement("div");
  host.id = hostId;
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647";
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    * { box-sizing: border-box; }
    .screen { min-height:100vh; padding:clamp(20px,5vw,64px); overflow:auto; background:#f5f7fa; color:#17202a; font:20px/1.5 system-ui,sans-serif; }
    .topbar { display:flex; justify-content:space-between; align-items:center; max-width:900px; margin:0 auto; }
    .brand { font-size:1rem; font-weight:750; letter-spacing:.04em; }
    .card { max-width:760px; margin:5vh auto; padding:clamp(24px,5vw,48px); border-radius:20px; background:#fff; box-shadow:0 8px 40px #18212b20; }
    h1 { margin:0 0 12px; font-size:clamp(1.8rem,4vw,2.5rem); line-height:1.15; }
    .intro { margin:0 0 28px; font-size:1.1rem; }
    label { display:block; margin-bottom:8px; font-weight:700; }
    input { display:block; width:100%; min-height:58px; padding:12px 14px; border:2px solid #667085; border-radius:10px; background:white; color:#17202a; font:inherit; }
    .help { margin:8px 0 0; color:#475467; font-size:.9rem; }
    .error { margin:12px 0 0; color:#b42318; font-weight:650; }
    .status { margin:16px 0 0; padding:12px 14px; border-radius:10px; background:#eef4ff; color:#193b70; }
    .actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:28px; }
    button { min-height:50px; border:0; border-radius:10px; padding:12px 20px; font:inherit; font-weight:700; cursor:pointer; }
    .primary { background:#155eef; color:white; }
    .secondary { background:#e9edf3; color:#17202a; }
    .top-stop { min-height:44px; padding:9px 14px; }
    .privacy { margin:24px 0 0; color:#475467; font-size:.85rem; }
    button:focus-visible, input:focus-visible { outline:3px solid #f5a623; outline-offset:3px; }
    @media (max-width:600px) { .screen { padding:14px; } .topbar { padding:4px 4px 0; } .card { margin:4vh auto; } .actions { flex-direction:column; } .actions button { width:100%; } }
  `;

  const screen = document.createElement("main");
  screen.className = "screen";
  screen.setAttribute("role", "dialog");
  screen.setAttribute("aria-modal", "true");
  screen.setAttribute("aria-labelledby", "lotus-title");
  screen.innerHTML = `
    <header class="topbar">
      <span class="brand">LOTUS</span>
      <button class="secondary top-stop" id="stop" type="button">Stop Lotus</button>
    </header>
    <section class="card">
      <h1 id="lotus-title">Find Your Electricity Bill</h1>
      <p class="intro">Enter the consumer account number from your latest electricity bill or service receipt.</p>
      <form id="lookup-form" novalidate>
        <label for="consumer-account">Consumer account number</label>
        <input id="consumer-account" name="consumer-account" type="text" inputmode="text" autocomplete="off" aria-describedby="account-help account-error" placeholder="Enter your consumer account number">
        <p class="help" id="account-help">Find it under “Consumer Number” or “Account Number” on your bill.</p>
        <p class="error" id="account-error" role="alert" hidden></p>
        <div class="actions">
          <button class="primary" id="continue" type="submit">Continue</button>
          <button class="secondary" id="original" type="button">Show original page</button>
        </div>
        <p class="status" id="lookup-status" role="status" aria-live="polite" hidden></p>
      </form>
      <p class="privacy">Fictional demo only. Lotus will not make a payment. Until page actions are connected, your number stays in this overlay and is not sent to the plan server.</p>
    </section>`;

  shadow.append(style, screen);
  document.documentElement.append(host);

  const input = shadow.getElementById("consumer-account");
  const form = shadow.getElementById("lookup-form");
  const error = shadow.getElementById("account-error");
  const status = shadow.getElementById("lookup-status");
  const continueButton = shadow.getElementById("continue");

  const restoreBodyState = () => {
    if (!body) return;
    body.inert = previousBodyInert;
    if (previousAriaHidden === null) body.removeAttribute("aria-hidden");
    else body.setAttribute("aria-hidden", previousAriaHidden);
    document.documentElement.style.overflow = previousOverflow;
  };

  const close = () => {
    restoreBodyState();
    restoreButton?.remove();
    host.remove();
  };
  host.__lotusClose = close;

  if (body) {
    body.inert = true;
    body.setAttribute("aria-hidden", "true");
  }
  document.documentElement.style.overflow = "hidden";
  input.focus();

  form.addEventListener("submit", event => {
    event.preventDefault();
    error.hidden = true;
    error.textContent = "";
    status.hidden = true;

    if (!input.value.trim()) {
      error.textContent = "Please enter your consumer account number to continue.";
      error.hidden = false;
      input.focus();
      return;
    }

    // The lookup/action pipeline belongs to the extension integration. Do not
    // transmit this value or pretend a page action has happened before it exists.
    status.textContent = "The Lotus page-action connection is not available yet. Show the original page to use the fictional portal lookup.";
    status.hidden = false;
  });

  shadow.getElementById("original").addEventListener("click", () => {
    restoreBodyState();
    host.style.display = "none";
    restoreButton = document.createElement("button");
    restoreButton.type = "button";
    restoreButton.textContent = "Return to Lotus";
    restoreButton.setAttribute("aria-label", "Return to Lotus simplified screen");
    restoreButton.style.cssText = "position:fixed;right:16px;top:16px;z-index:2147483647;min-height:48px;padding:12px 16px;font:700 16px system-ui;border:0;border-radius:8px;background:#155eef;color:white;cursor:pointer";
    restoreButton.addEventListener("click", () => {
      restoreButton.remove();
      restoreButton = undefined;
      host.style.display = "block";
      if (body) {
        body.inert = true;
        body.setAttribute("aria-hidden", "true");
      }
      document.documentElement.style.overflow = "hidden";
      input.focus();
    }, { once: true });
    document.documentElement.append(restoreButton);
    restoreButton.focus();
  });

  shadow.getElementById("stop").addEventListener("click", close);
  screen.addEventListener("keydown", event => {
    if (event.key === "Escape") close();
  });
})();
