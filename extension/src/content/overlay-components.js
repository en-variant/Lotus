// Reusable, safe DOM UI primitives for Lotus overlays and future ScreenPlan rendering.

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Create an inline SVG element safely without innerHTML.
 * @param {string} tag
 * @param {Record<string, string>} attrs
 * @returns {SVGElement}
 */
function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

/**
 * Create the geometric Lotus brand emblem SVG.
 * @returns {SVGElement}
 */
export function createLotusLogo() {
  const svg = createSvgElement("svg", {
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": "true",
    focusable: "false"
  });

  // Outer left & right petals
  svg.append(
    createSvgElement("path", {
      d: "M16 25C10.5 25 5.5 21.4 4.5 15.2C8.4 15.3 12 17.4 14.3 20.8",
      fill: "#C4B5FD"
    }),
    createSvgElement("path", {
      d: "M16 25C21.5 25 26.5 21.4 27.5 15.2C23.6 15.3 20 17.4 17.7 20.8",
      fill: "#C4B5FD"
    }),
    // Inner left & right petals
    createSvgElement("path", {
      d: "M16 25C11.5 22.8 8.8 17.5 9.6 10.6C13.2 12.1 15.4 15.4 16 19.6",
      fill: "#8B5CF6"
    }),
    createSvgElement("path", {
      d: "M16 25C20.5 22.8 23.2 17.5 22.4 10.6C18.8 12.1 16.6 15.4 16 19.6",
      fill: "#8B5CF6"
    }),
    // Center crown petal
    createSvgElement("path", {
      d: "M16 5.5C19.3 9.7 19.8 17.3 16 24.5C12.2 17.3 12.7 9.7 16 5.5Z",
      fill: "#5B21B6"
    }),
    // Subtle base stem/bowl accent
    createSvgElement("path", {
      d: "M9.5 26.2C11.6 27.1 13.8 27.5 16 27.5C18.2 27.5 20.4 27.1 22.5 26.2",
      stroke: "#5B21B6",
      "stroke-width": "1.8",
      "stroke-linecap": "round"
    })
  );

  return svg;
}

/**
 * Create a small accessible status icon for error or warning banners.
 * @param {"error" | "info" | "warning"} kind
 * @returns {SVGElement}
 */
function createBannerIcon(kind) {
  const svg = createSvgElement("svg", {
    viewBox: "0 0 20 20",
    fill: "none",
    class: "lotus-banner-icon",
    "aria-hidden": "true",
    focusable: "false"
  });

  if (kind === "error" || kind === "warning") {
    svg.append(
      createSvgElement("circle", {
        cx: "10",
        cy: "10",
        r: "8.25",
        stroke: "currentColor",
        "stroke-width": "1.75"
      }),
      createSvgElement("path", {
        d: "M10 6.2V10.6",
        stroke: "currentColor",
        "stroke-width": "1.85",
        "stroke-linecap": "round"
      }),
      createSvgElement("circle", {
        cx: "10",
        cy: "13.7",
        r: "1",
        fill: "currentColor"
      })
    );
  } else {
    svg.append(
      createSvgElement("circle", {
        cx: "10",
        cy: "10",
        r: "8.25",
        stroke: "currentColor",
        "stroke-width": "1.75"
      }),
      createSvgElement("path", {
        d: "M7.1 10.2L9.1 12.2L13.1 8",
        stroke: "currentColor",
        "stroke-width": "1.85",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      })
    );
  }

  return svg;
}

/**
 * Create a reusable loading spinner indicator for future backend ScreenPlan fetches.
 * @param {string} [label]
 * @returns {HTMLDivElement}
 */
export function createLoadingIndicator(label = "Loading...") {
  const wrapper = document.createElement("div");
  wrapper.className = "lotus-banner lotus-banner--status";
  wrapper.setAttribute("role", "status");
  wrapper.setAttribute("aria-live", "polite");

  const spinner = document.createElement("span");
  spinner.className = "lotus-spinner";
  spinner.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.textContent = label;

  wrapper.append(spinner, text);
  return wrapper;
}

/**
 * Create a reusable banner element (error, status, or warning).
 * @param {{ id?: string, variant?: "error" | "status" | "warning", role?: string, ariaLive?: string, hidden?: boolean }} options
 * @returns {HTMLDivElement}
 */
export function createBanner({
  id,
  variant = "status",
  role = "status",
  ariaLive,
  hidden = false
}) {
  const banner = document.createElement("div");
  if (id) banner.id = id;
  banner.className = `lotus-banner lotus-banner--${variant}`;
  if (role) banner.setAttribute("role", role);
  if (ariaLive) banner.setAttribute("aria-live", ariaLive);
  if (hidden) banner.hidden = true;
  return banner;
}

/**
 * Safely update a banner's visibility, icon/spinner, and textContent.
 * @param {HTMLElement} banner
 * @param {{ visible: boolean, text?: string, loading?: boolean, iconKind?: "error" | "info" | "warning" }} state
 */
export function setBannerState(banner, { visible, text = "", loading = false, iconKind = "info" }) {
  banner.replaceChildren();

  if (!visible || !text) {
    banner.hidden = true;
    return;
  }

  banner.hidden = false;
  if (loading) {
    const spinner = document.createElement("span");
    spinner.className = "lotus-spinner";
    spinner.setAttribute("aria-hidden", "true");
    banner.append(spinner);
  } else {
    banner.append(createBannerIcon(iconKind));
  }

  const message = document.createElement("span");
  message.textContent = text;
  banner.append(message);
}

/**
 * Toggle a button's loading state for future async backend calls.
 * @param {HTMLButtonElement} button
 * @param {boolean} isLoading
 * @param {string} [loadingLabel]
 * @param {string} [idleLabel]
 */
export function setButtonLoading(button, isLoading, loadingLabel = "Working...", idleLabel) {
  if (!button.dataset.idleLabel) {
    button.dataset.idleLabel = idleLabel || button.textContent || "";
  }
  const restLabel = idleLabel || button.dataset.idleLabel;

  button.replaceChildren();
  if (isLoading) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    const spinner = document.createElement("span");
    spinner.className = "lotus-spinner";
    spinner.setAttribute("aria-hidden", "true");
    const span = document.createElement("span");
    span.textContent = loadingLabel;
    button.append(spinner, span);
  } else {
    button.disabled = false;
    button.removeAttribute("aria-busy");
    button.textContent = restLabel;
  }
}

/**
 * Create a heading element aligned with ScreenComponent { type: "heading" }.
 * @param {string} text
 * @param {{ id?: string, level?: 1 | 2 | 3 }} [options]
 * @returns {HTMLHeadingElement}
 */
export function createHeading(text, { id, level = 1 } = {}) {
  const tag = level === 2 ? "h2" : level === 3 ? "h3" : "h1";
  const heading = document.createElement(tag);
  if (id) heading.id = id;
  heading.className = "lotus-heading";
  heading.textContent = text;
  return heading;
}

/**
 * Create an explainer paragraph aligned with ScreenComponent { type: "explainer" }.
 * @param {string} text
 * @param {{ className?: string }} [options]
 * @returns {HTMLParagraphElement}
 */
export function createExplainer(text, { className = "intro lotus-explainer" } = {}) {
  const p = document.createElement("p");
  p.className = className;
  p.textContent = text;
  return p;
}

/**
 * Create an accessible form field aligned with ScreenComponent { type: "field" }.
 * @param {{
 *   id: string,
 *   label: string,
 *   required?: boolean,
 *   tagText?: string,
 *   placeholder?: string,
 *   helpId?: string,
 *   helpText?: string,
 *   inputType?: string,
 *   autocomplete?: string,
 *   inputMode?: string
 * }} config
 */
export function createField({
  id,
  label,
  required = false,
  tagText,
  placeholder = "",
  helpId,
  helpText = "",
  inputType = "text",
  autocomplete = "off",
  inputMode
}) {
  const container = document.createElement("div");
  container.className = "field lotus-field";

  const labelRow = document.createElement("div");
  labelRow.className = "field-label-row";

  const labelEl = document.createElement("label");
  labelEl.setAttribute("for", id);
  labelEl.textContent = label;
  labelRow.append(labelEl);

  const badgeLabel = tagText ?? (required ? "Required" : "Optional");
  if (badgeLabel) {
    const tag = document.createElement("span");
    tag.className = required ? "field-tag field-tag--required" : "field-tag field-tag--optional";
    tag.textContent = badgeLabel;
    labelRow.append(tag);
  }

  const input = document.createElement("input");
  input.id = id;
  input.className = "lotus-input";
  input.type = inputType;
  input.placeholder = placeholder;
  input.setAttribute("autocomplete", autocomplete);
  if (inputMode) input.setAttribute("inputmode", inputMode);
  if (required) {
    input.required = true;
    input.setAttribute("aria-required", "true");
  }
  if (helpId) {
    input.setAttribute("aria-describedby", helpId);
  }

  container.append(labelRow, input);

  let helpEl = null;
  if (helpText) {
    helpEl = document.createElement("small");
    if (helpId) helpEl.id = helpId;
    helpEl.className = "lotus-help";
    helpEl.textContent = helpText;
    container.append(helpEl);
  }

  return { container, input, labelEl, helpEl };
}

/**
 * Create a styled action button aligned with ScreenComponent { type: "button" }.
 * @param {{
 *   id?: string,
 *   label: string,
 *   variant?: "primary" | "secondary" | "stop",
 *   className?: string,
 *   type?: "button" | "submit",
 *   onClick?: (event: MouseEvent) => void
 * }} config
 * @returns {HTMLButtonElement}
 */
export function createButton({
  id,
  label,
  variant = "secondary",
  className = "",
  type = "button",
  onClick
}) {
  const btn = document.createElement("button");
  if (id) btn.id = id;
  btn.type = type;

  const variantClass =
    variant === "primary"
      ? "primary lotus-btn lotus-btn--primary"
      : variant === "stop"
        ? "secondary lotus-btn lotus-btn--stop"
        : "secondary lotus-btn lotus-btn--secondary";

  btn.className = className ? `${variantClass} ${className}` : variantClass;
  btn.textContent = label;

  if (typeof onClick === "function") {
    btn.addEventListener("click", onClick);
  }

  return btn;
}

/**
 * Create the reusable Lotus overlay shell with header and handoff/stop footer.
 * @param {{
 *   brandName?: string,
 *   badgeText?: string,
 *   titleId?: string,
 *   contrast?: "normal" | "high",
 *   onShowOriginal: () => void,
 *   onStop: () => void
 * }} options
 */
export function createOverlayShell({
  brandName = "Lotus",
  badgeText = "Guided View",
  titleId = "lotus-title",
  contrast = "normal",
  onShowOriginal,
  onStop
}) {
  const screen = document.createElement("main");
  screen.className = "screen";
  screen.setAttribute("aria-label", "Lotus simplified page");
  if (contrast === "high") {
    screen.setAttribute("data-contrast", "high");
  }

  const card = document.createElement("section");
  card.className = "card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", titleId);
  card.setAttribute("tabindex", "-1");

  const header = document.createElement("header");
  header.className = "lotus-header";

  const brand = document.createElement("div");
  brand.className = "brand";

  const brandMark = document.createElement("span");
  brandMark.className = "brand-mark";
  brandMark.append(createLotusLogo());

  const brandLabel = document.createElement("span");
  brandLabel.className = "brand-name";
  brandLabel.textContent = brandName;

  brand.append(brandMark, brandLabel);

  const pill = document.createElement("span");
  pill.className = "brand-pill";
  pill.textContent = badgeText;

  header.append(brand, pill);

  const body = document.createElement("div");
  body.className = "lotus-body";

  const actions = document.createElement("div");
  actions.className = "actions";

  const originalBtn = createButton({
    id: "original",
    label: "Show original page",
    variant: "secondary",
    onClick: onShowOriginal
  });

  const stopBtn = createButton({
    id: "stop",
    label: "Stop Lotus",
    variant: "stop",
    onClick: onStop
  });

  actions.append(originalBtn, stopBtn);
  card.append(header, body, actions);
  screen.append(card);

  return { screen, card, body, originalBtn, stopBtn };
}

const FORBIDDEN_BINDINGS = new Set(["__proto__", "constructor", "prototype"]);
const VALID_BINDING_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

/**
 * Validate a dynamic ScreenPlan field binding name and reject missing, invalid, or duplicate bindings.
 * @param {unknown} rawBind
 * @param {Set<string>} seenBindings
 * @returns {string | null}
 */
function validateFieldBinding(rawBind, seenBindings) {
  if (typeof rawBind !== "string") return null;
  const bind = rawBind.trim();
  if (!bind || !VALID_BINDING_PATTERN.test(bind) || FORBIDDEN_BINDINGS.has(bind)) {
    return null;
  }
  if (seenBindings.has(bind)) {
    return null;
  }
  return bind;
}

/**
 * Safely render validated ScreenComponent items (from ScreenPlan) using textContent.
 * Dynamic action execution remains disabled until validateAction(), trusted action mapping,
 * live DOM target revalidation, and explicit user confirmation are connected.
 * @param {Array<Record<string, any>>} components
 * @returns {{
 *   fragment: DocumentFragment,
 *   values: Map<string, string>,
 *   rejected: Array<{ index: number, type: string, reason: string }>
 * }}
 */
export function renderScreenPlanComponents(components) {
  const fragment = document.createDocumentFragment();
  const values = new Map();
  const seenBindings = new Set();
  const rejected = [];

  if (!Array.isArray(components)) {
    return { fragment, values, rejected };
  }

  components.forEach((comp, index) => {
    if (!comp || typeof comp !== "object") {
      rejected.push({ index, type: "unknown", reason: "Invalid component entry." });
      return;
    }

    switch (comp.type) {
      case "heading": {
        fragment.append(createHeading(String(comp.text ?? ""), { level: index === 0 ? 1 : 2 }));
        break;
      }
      case "explainer": {
        fragment.append(createExplainer(String(comp.text ?? "")));
        break;
      }
      case "field": {
        const bind = validateFieldBinding(comp.bind, seenBindings);
        if (!bind) {
          rejected.push({
            index,
            type: "field",
            reason: "Missing, duplicate, or invalid field binding."
          });
          return;
        }
        seenBindings.add(bind);
        values.set(bind, "");

        const { container, input } = createField({
          id: `lotus-field-${bind}`,
          label: String(comp.label ?? ""),
          required: false,
          tagText: "",
          inputType: "text",
          inputMode: comp.input === "number" ? "numeric" : undefined
        });
        // Keep field values strictly in local Map memory; never transmit or execute unvalidated actions.
        input.addEventListener("input", () => {
          values.set(bind, input.value);
        });
        fragment.append(container);
        break;
      }
      case "warning": {
        const banner = createBanner({ variant: "warning", role: "note" });
        setBannerState(banner, {
          visible: true,
          text: String(comp.text ?? ""),
          iconKind: "warning"
        });
        fragment.append(banner);
        break;
      }
      case "summary": {
        const row = document.createElement("div");
        row.className = "lotus-summary";
        const label = document.createElement("span");
        label.className = "lotus-summary-label";
        label.textContent = String(comp.label ?? "");
        const value = document.createElement("span");
        value.className = "lotus-summary-value";
        value.textContent = String(comp.value ?? "");
        row.append(label, value);
        fragment.append(row);
        break;
      }
      case "fee_table": {
        const table = document.createElement("table");
        table.className = "lotus-table";
        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        for (const col of ["Item", "Amount", "Details"]) {
          const th = document.createElement("th");
          th.scope = "col";
          th.textContent = col;
          headRow.append(th);
        }
        thead.append(headRow);
        const tbody = document.createElement("tbody");
        const rows = Array.isArray(comp.rows) ? comp.rows : [];
        for (const r of rows) {
          const tr = document.createElement("tr");
          for (const cellText of [r?.label, r?.amount, r?.explain]) {
            const td = document.createElement("td");
            td.textContent = String(cellText ?? "");
            tr.append(td);
          }
          tbody.append(tr);
        }
        table.append(thead, tbody);
        fragment.append(table);
        break;
      }
      case "button": {
        // Do not trust backend-supplied risk classifications or execute unvalidated actions.
        const btn = createButton({
          label: String(comp.label ?? "Continue"),
          variant: "secondary"
        });
        btn.disabled = true;
        btn.setAttribute("aria-disabled", "true");
        fragment.append(btn);
        break;
      }
      default:
        rejected.push({
          index,
          type: String(comp.type ?? "unknown"),
          reason: "Unsupported ScreenComponent type."
        });
        break;
    }
  });

  return { fragment, values, rejected };
}

/**
 * Validate a consumer account number string.
 * Rejects empty and whitespace-only values; preserves leading zeros and alphanumeric characters.
 * @param {string} rawValue
 * @returns {{ valid: boolean, value: string, error: string }}
 */
export function validateConsumerAccountNumber(rawValue) {
  const trimmed = String(rawValue ?? "").trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      value: "",
      error: "Please enter your consumer account number to continue."
    };
  }

  return {
    valid: true,
    value: trimmed,
    error: ""
  };
}

/**
 * Build the Electricity Bill Lookup overlay screen with safe DOM construction
 * and strict client-side validation (no network calls, no simulated lookup).
 * @param {{ onShowOriginal: () => void, onStop: () => void }} options
 */
export function renderElectricityLookupScreen({ onShowOriginal, onStop }) {
  const shell = createOverlayShell({
    brandName: "Lotus",
    badgeText: "Guided View",
    titleId: "lotus-title",
    onShowOriginal,
    onStop
  });

  const heading = createHeading("Find Your Electricity Bill", {
    id: "lotus-title",
    level: 1
  });

  const intro = createExplainer(
    "Enter your electricity consumer account number to get started. You can find this number on your latest electricity bill or electricity service receipt."
  );

  const demoNotice = createBanner({
    id: "demo-notice",
    variant: "warning",
    role: "note"
  });
  demoNotice.classList.add("lotus-demo-notice");
  setBannerState(demoNotice, {
    visible: true,
    text: "Fictional demo only. Do not enter real consumer account numbers or personal information.",
    iconKind: "warning"
  });

  const form = document.createElement("form");
  form.id = "lookup-form";
  form.noValidate = true;

  const consumerField = createField({
    id: "consumer-number",
    label: "Consumer Account Number",
    required: true,
    tagText: "Required",
    placeholder: "e.g. 0041289A",
    helpId: "consumer-help",
    helpText: "Find this number on your electricity bill under Consumer Number or Account Number. Leading zeros and letters are preserved.",
    inputType: "text",
    autocomplete: "off"
  });

  const sectionField = createField({
    id: "section-code",
    label: "Section / Subdivision Code",
    required: false,
    tagText: "Optional",
    placeholder: "Enter section code (e.g. 204 or S04)",
    helpId: "section-help",
    helpText: "Find this code in the service connection details on your electricity bill.",
    inputType: "text",
    autocomplete: "off"
  });

  const errorBanner = createBanner({
    id: "lookup-error",
    variant: "error",
    role: "alert",
    hidden: true
  });

  const continueBtn = createButton({
    id: "continue",
    label: "Continue",
    variant: "primary",
    className: "continue",
    type: "submit"
  });

  const statusBanner = createBanner({
    id: "lookup-status",
    variant: "status",
    role: "status",
    ariaLive: "polite",
    hidden: false
  });

  const clearErrorState = () => {
    consumerField.input.removeAttribute("aria-invalid");
    consumerField.input.setAttribute("aria-describedby", "consumer-help");
    setBannerState(errorBanner, { visible: false });
  };

  const clearStatusState = () => {
    setBannerState(statusBanner, { visible: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = validateConsumerAccountNumber(consumerField.input.value);
    if (!result.valid) {
      consumerField.input.setAttribute("aria-invalid", "true");
      consumerField.input.setAttribute("aria-describedby", "consumer-help lookup-error");
      setBannerState(errorBanner, {
        visible: true,
        text: result.error,
        iconKind: "error"
      });
      clearStatusState();
      consumerField.input.focus();
      return;
    }

    // Keep sanitized/trimmed string locally in memory only; never transmit or convert to Number.
    clearErrorState();
    setBannerState(statusBanner, {
      visible: true,
      text: "Your account number is ready. Bill lookup is not connected yet.",
      iconKind: "info"
    });
  };

  consumerField.input.addEventListener("input", () => {
    clearStatusState();
    if (consumerField.input.getAttribute("aria-invalid") === "true") {
      const check = validateConsumerAccountNumber(consumerField.input.value);
      if (check.valid) {
        clearErrorState();
      }
    }
  });

  sectionField.input.addEventListener("input", () => {
    clearStatusState();
  });

  form.addEventListener("submit", handleSubmit);

  form.append(
    consumerField.container,
    sectionField.container,
    errorBanner,
    continueBtn,
    statusBanner
  );

  shell.body.append(heading, intro, demoNotice, form);

  return {
    ...shell,
    form,
    demoNotice,
    consumerInput: consumerField.input,
    sectionInput: sectionField.input,
    errorBanner,
    statusBanner,
    continueBtn
  };
}

/**
 * Build the safe notice screen shown on unsupported websites without collecting any data.
 * @param {{ onShowOriginal: () => void, onStop: () => void }} options
 */
export function renderUnsupportedPageScreen({ onShowOriginal, onStop }) {
  const shell = createOverlayShell({
    brandName: "Lotus",
    badgeText: "Guided View",
    titleId: "lotus-title",
    onShowOriginal,
    onStop
  });

  const heading = createHeading("Page Not Supported Yet", {
    id: "lotus-title",
    level: 1
  });

  const intro = createExplainer(
    "Lotus currently supports only the trusted local fictional electricity demo portal. No account information is collected on this website."
  );

  const notice = createBanner({
    id: "unsupported-notice",
    variant: "warning",
    role: "note"
  });
  notice.classList.add("lotus-demo-notice");
  setBannerState(notice, {
    visible: true,
    text: "Use \"Show original page\" to return to this website directly, or \"Stop Lotus\" to close this overlay.",
    iconKind: "warning"
  });

  shell.body.append(heading, intro, notice);

  return {
    ...shell,
    notice
  };
}

/**
 * Create the styled floating "Return to Lotus" button for the original-page handoff.
 * @param {() => void} onRestore
 * @returns {HTMLButtonElement}
 */
export function createRestoreButton(onRestore) {
  const restore = document.createElement("button");
  restore.id = "lotus-restore-button";
  restore.type = "button";

  const iconWrap = document.createElement("span");
  iconWrap.style.cssText = "display:inline-flex;width:18px;height:18px;";
  const logo = createLotusLogo();
  logo.setAttribute("width", "18");
  logo.setAttribute("height", "18");
  iconWrap.append(logo);

  const label = document.createElement("span");
  label.textContent = "Return to Lotus";

  restore.append(iconWrap, label);
  restore.addEventListener("click", onRestore, { once: true });
  return restore;
}
