(() => {
  const hostId = "lotus-extension-host";
  const existing = document.getElementById(hostId);
  if (existing) {
    existing.__lotusClose?.();
    return;
  }

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
