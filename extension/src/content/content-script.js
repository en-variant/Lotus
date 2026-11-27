import { sanitizeSnapshot } from "../shared/sanitizer.ts";
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
  const existing = document.getElementById(hostId);
  if (existing) {
    existing.remove();
    document.getElementById("lotus-restore-button")?.remove();
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




  const host = document.createElement("div");
  host.id = hostId;
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647";
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    .screen { box-sizing:border-box; min-height:100vh; padding:clamp(24px,6vw,72px); background:#f5f7fa; color:#17202a; font:20px/1.5 system-ui,sans-serif; }
    .card { max-width:760px; margin:8vh auto; padding:32px; border-radius:20px; background:white; box-shadow:0 8px 40px #18212b20; }
    h1 { font-size:2rem; margin-top:0; }
    p { font-size:1.15rem; }
    .actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:28px; }
    button { border:0; border-radius:10px; padding:14px 20px; font:inherit; font-weight:650; cursor:pointer; }
    .primary { background:#155eef; color:white; } .secondary { background:#e9edf3; color:#17202a; }
    button:focus-visible { outline:3px solid #f5a623; outline-offset:3px; }
  `;
  const screen = document.createElement("main");
  screen.className = "screen";
  screen.setAttribute("aria-label", "Lotus simplified page");
  screen.innerHTML = `
    <section class="card">
      <h1>Lotus is ready</h1>
      <p>This starter screen is the extension shell. The team will connect page understanding and the generated bill experience here.</p>
      <div class="actions">
        <button class="primary" id="original">Show original page</button>
        <button class="secondary" id="stop">Stop Lotus</button>
      </div>
    </section>`;
  shadow.append(style, screen);
  document.documentElement.append(host);

  shadow.getElementById("original").addEventListener("click", () => {
    host.style.display = "none";
    const restore = document.createElement("button");
    restore.id = "lotus-restore-button";
    restore.textContent = "Return to Lotus";
    restore.style.cssText = "position:fixed;right:16px;top:16px;z-index:2147483647;padding:12px 16px;font:600 16px system-ui;border:0;border-radius:8px;background:#155eef;color:white";
    restore.addEventListener("click", () => {
      restore.remove();
      host.style.display = "block";
    }, { once: true });
    document.documentElement.append(restore);
  });
  shadow.getElementById("stop").addEventListener("click", () => host.remove());
})();
