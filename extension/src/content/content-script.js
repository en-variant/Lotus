(() => {
  const hostId = "lotus-extension-host";
  const existing = document.getElementById(hostId);
  if (existing) {
    existing.remove();
    return;
  }

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
