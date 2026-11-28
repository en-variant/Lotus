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
    if (typeof existing._lotusCleanup === "function") {
      existing._lotusCleanup();
    } else {
      existing.remove();
      document.getElementById(restoreButtonId)?.remove();
      document.getElementById(restoreStyleId)?.remove();
    }
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

  const host = document.createElement("div");
  host.id = hostId;
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647";
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = OVERLAY_STYLES;

  const inertManager = createPageInertManager(
    host,
    new Set([restoreButtonId, restoreStyleId])
  );

  let focusTrapActive = true;

  const getFocusableElements = () =>
    Array.from(
      shadow.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      el =>
        !el.hidden &&
        el.getClientRects().length > 0 &&
        window.getComputedStyle(el).visibility !== "hidden"
    );

  const onShadowKeyDown = (event) => {
    if (!focusTrapActive || event.key !== "Tab") {
      return;
    }

    const focusables = getFocusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = shadow.activeElement;

    if (event.shiftKey) {
      if (!active || active === first || active === ui.card || !ui.card.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (!active || active === last || !ui.card.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  };

  const onDocumentFocusIn = (event) => {
    if (!focusTrapActive || !host.isConnected || host.style.display === "none") {
      return;
    }
    if (event.target !== host) {
      const focusables = getFocusableElements();
      const fallback = focusables[0] || ui.card;
      fallback?.focus({ preventScroll: true });
    }
  };

  const removeRestoreUi = () => {
    document.getElementById(restoreButtonId)?.remove();
    document.getElementById(restoreStyleId)?.remove();
  };

  const cleanup = () => {
    focusTrapActive = false;
    shadow.removeEventListener("keydown", onShadowKeyDown);
    document.removeEventListener("focusin", onDocumentFocusIn, true);
    inertManager.restore();
    removeRestoreUi();
    host.remove();
    if (
      previousActiveElement &&
      previousActiveElement.isConnected &&
      typeof previousActiveElement.focus === "function"
    ) {
      previousActiveElement.focus({ preventScroll: true });
    }
  };

  const showOriginalPage = () => {
    focusTrapActive = false;
    inertManager.restore();
    host.style.display = "none";
    removeRestoreUi();

    const restoreStyle = document.createElement("style");
    restoreStyle.id = restoreStyleId;
    restoreStyle.textContent = RESTORE_BUTTON_STYLES;

    const restore = createRestoreButton(() => {
      removeRestoreUi();
      host.style.display = "block";
      inertManager.apply();
      focusTrapActive = true;
      ui.card.focus({ preventScroll: true });
    });

    document.documentElement.append(restoreStyle, restore);
    restore.focus({ preventScroll: true });
  };

  const ui = isTrustedDemoPortal(snapshot)
    ? renderElectricityLookupScreen({
        onShowOriginal: showOriginalPage,
        onStop: cleanup
      })
    : renderUnsupportedPageScreen({
        onShowOriginal: showOriginalPage,
        onStop: cleanup
      });

  host._lotusCleanup = cleanup;
  shadow.append(style, ui.screen);
  shadow.addEventListener("keydown", onShadowKeyDown);
  document.addEventListener("focusin", onDocumentFocusIn, true);
  document.documentElement.append(host);
  inertManager.apply();
  ui.card.focus({ preventScroll: true });
})();
