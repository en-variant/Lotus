
(() => {
  const hostId = "lotus-extension-host";
  const existing = document.getElementById(hostId);

  if (existing) {
    existing.remove();
    return;
  }

  const host = document.createElement("div");
  host.id = hostId;
  host.style.cssText =
    "position:fixed;inset:0;z-index:2147483647;";

  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }

    * { box-sizing: border-box; }

    .screen {
      min-height: 100vh;
      overflow-y: auto;
      padding: 32px 18px;
      background: #101d2b;
      color: #172b3a;
      font: 15px/1.5 system-ui, sans-serif;
    }

    .topbar {
      max-width: 900px;
      margin: 0 auto 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 23px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .logo {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: #21c6ad;
      color: #102b35;
      font-size: 23px;
    }

    .status {
      color: #8ee7d7;
      font-size: 12px;
      border: 1px solid #315b60;
      border-radius: 30px;
      padding: 7px 13px;
    }

    .card {
      max-width: 560px;
      margin: 0 auto;
      padding: 35px;
      background: white;
      border-radius: 22px;
      box-shadow: 0 24px 80px #0005;
    }

    .eyebrow {
      color: #159c8d;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    h1 {
      margin: 10px 0;
      font-size: 30px;
      line-height: 1.2;
      color: #142b3c;
    }

    .intro {
      color: #657786;
      margin-bottom: 27px;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 25px;
      color: #71818e;
      font-size: 12px;
    }

    .step span {
      width: 25px;
      height: 25px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #d9f6f0;
      color: #087f70;
      font-weight: 800;
    }

    label {
      display: block;
      margin: 18px 0 7px;
      font-weight: 700;
      color: #233b4b;
    }

    input {
      width: 100%;
      padding: 14px;
      border: 1px solid #d8e1e8;
      border-radius: 10px;
      background: #f9fbfc;
      color: #172b3a;
      font: inherit;
      outline: none;
    }

    input:focus {
      border-color: #16ad9b;
      box-shadow: 0 0 0 3px #16ad9b20;
    }

    .hint {
      margin-top: 6px;
      color: #83919b;
      font-size: 12px;
    }

    .primary {
      width: 100%;
      margin-top: 25px;
      padding: 15px;
      border: 0;
      border-radius: 11px;
      background: #13aa98;
      color: white;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }

    .primary:hover { background: #078d7e; }
    .primary:disabled { opacity: .6; cursor: wait; }

    .message {
      min-height: 24px;
      margin-top: 14px;
      font-size: 13px;
      color: #087f70;
    }

    .footer {
      max-width: 560px;
      margin: 22px auto;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    .footer button {
      border: 0;
      background: transparent;
      color: white;
      padding: 10px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
    }

    #stop { color: #ffaaa8; }

    button:focus-visible {
      outline: 3px solid #f3bd55;
      outline-offset: 3px;
    }

    @media(max-width: 520px) {
      .card { padding: 23px; }
      h1 { font-size: 25px; }
      .screen { padding: 20px 12px; }
    }
  `;

  const screen = document.createElement("main");
  screen.className = "screen";
  screen.setAttribute("aria-label", "Lotus electricity bill assistant");

  screen.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <div class="logo" aria-hidden="true">✿</div>
        LOTUS
      </div>
      <div class="status">● ASSISTANT ACTIVE</div>
    </header>

    <section class="card">
      <div class="eyebrow">Simple. Clear. Accessible.</div>

      <h1>Let's find your electricity bill.</h1>

      <p class="intro">
        Enter your account details below.
        Lotus will help you through the next step.
      </p>

      <div class="step">
        <span>1</span> ACCOUNT DETAILS
        <span>2</span> BILL PROCESS
      </div>

      <form id="bill-form" novalidate>
        <label for="consumer">Consumer Account Number</label>
        <input
          id="consumer"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder="Enter account number"
          aria-describedby="consumer-hint"
        />
        <div class="hint" id="consumer-hint">
          Enter the number shown on your electricity bill.
        </div>

        <label for="section">Section / Subdivision Code</label>
        <input
          id="section"
          type="text"
          autocomplete="off"
          placeholder="Enter section code"
        />

        <button class="primary" id="continue" type="submit">
          Continue →
        </button>

        <div
          class="message"
          id="message"
          role="status"
          aria-live="polite"
        ></div>
      </form>
    </section>

    <footer class="footer">
      <button id="original">↗ Show Original Page</button>
      <button id="stop">Stop Lotus ×</button>
    </footer>
  `;

  shadow.append(style, screen);
  document.documentElement.append(host);

  const form = shadow.getElementById("bill-form");
  const consumer = shadow.getElementById("consumer");
  const section = shadow.getElementById("section");
  const message = shadow.getElementById("message");
  const submit = shadow.getElementById("continue");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const account = consumer.value.trim();
    const subdivision = section.value.trim();

    if (!account) {
      message.textContent = "Please enter your Consumer Account Number.";
      consumer.focus();
      return;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(account)) {
      message.textContent = "Please check your account number.";
      consumer.focus();
      return;
    }

    if (!subdivision) {
      message.textContent = "Please enter your Section / Subdivision Code.";
      section.focus();
      return;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(subdivision)) {
      message.textContent = "Please check your subdivision code.";
      section.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = "Please wait...";
    message.textContent = "Details validated. Preparing the next step...";

    setTimeout(() => {
      submit.disabled = false;
      submit.textContent = "Continue →";
      message.textContent =
        "Your details are valid. Bill lookup integration is not connected yet.";
    }, 700);
  });

  shadow.getElementById("original").addEventListener("click", () => {
    host.style.display = "none";

    const restore = document.createElement("button");
    restore.textContent = "Return to Lotus";
    restore.style.cssText =
      "position:fixed;right:16px;top:16px;z-index:2147483647;padding:12px 18px;border:0;border-radius:10px;background:#13aa98;color:white;font-weight:700;cursor:pointer";

    restore.addEventListener("click", () => {
      restore.remove();
      host.style.display = "block";
    });

    document.documentElement.append(restore);
  });

  shadow.getElementById("stop").addEventListener("click", () => {
    host.remove();
  });
})();
