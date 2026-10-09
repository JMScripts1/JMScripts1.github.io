// Open source: reads window.OPEN_SOURCE (assets/oss-data.js) and builds the
// systems list. Released and in-progress systems get a full card; planned ones
// go in the smaller "Coming next" list, which hides itself when empty.
(() => {
  const all = Array.isArray(window.OPEN_SOURCE) ? window.OPEN_SOURCE.filter((s) => s && s.title) : [];
  const listEl = document.getElementById("oss-list");
  const nextEl = document.getElementById("oss-next");
  if (!listEl || !all.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Only allow web links and files inside the site, so a typo can't inject a script URL.
  const safeUrl = (u) => { const s = String(u || "").trim(); return /^(https?:\/\/|assets\/)/i.test(s) ? s : ""; };
  const ICONS = new Set(["backpack", "storefront", "arrows-left-right", "scroll", "chat-circle-dots", "flag-banner", "sliders-horizontal", "gift", "package", "cube", "sword", "person-simple-run", "floppy-disk", "code"]);
  const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="assets/icons.svg#i-${name}"/></svg>`;
  const sysIcon = (name, cls) => icon(ICONS.has(name) ? name : "code", cls);
  const isPlanned = (s) => /^planned/i.test(String(s.status || ""));
  const statusKey = (s) => (/^released/i.test(String(s.status || "")) ? "released" : "progress");

  function media(s) {
    const files = (Array.isArray(s.media) ? s.media : [s.media]).map(safeUrl).filter(Boolean);
    const src = files[0];
    if (src && /\.(mp4|webm|mov)(\?|$)/i.test(src)) {
      const poster = safeUrl(s.poster);
      const type = (f) => (/\.webm(\?|$)/i.test(f) ? "video/webm" : /\.mov(\?|$)/i.test(f) ? "video/quicktime" : "video/mp4");
      return `<div class="sys__media"><video${poster ? ` poster="${esc(poster)}"` : ""} muted loop playsinline preload="${poster ? "none" : "metadata"}" ${reduce ? "controls" : ""} aria-label="${esc(s.title)} demo">${files.map((f) => `<source src="${esc(f)}" type="${type(f)}">`).join("")}</video></div>`;
    }
    if (src) return `<div class="sys__media"><img src="${esc(src)}" alt="${esc(s.title)}" loading="lazy"></div>`;
    const art = safeUrl(s.art);
    return `<div class="sys__media sys__media--art">${art ? `<img src="${esc(art)}" alt="" loading="lazy">` : ""}${sysIcon(s.icon, "icon sys__glyph")}</div>`;
  }

  function card(s) {
    const key = statusKey(s);
    const repo = safeUrl(s.repo), demo = safeUrl(s.demo);
    const features = (Array.isArray(s.features) ? s.features : []).filter(Boolean);
    const tags = (Array.isArray(s.tags) ? s.tags : []).filter(Boolean);
    const source = repo
      ? `<a class="btn btn--primary" href="${esc(repo)}" target="_blank" rel="noopener">${icon("github-logo")}View source</a>`
      : `<span class="sys__soon">${icon("git-fork")}Source coming soon</span>`;
    return `
      <article class="sys" data-status="${key}">
        ${media(s)}
        <div class="sys__body">
          <p class="sys__status">${esc(s.status || "In progress")}${s.version ? `<span>${esc(s.version)}</span>` : ""}</p>
          <h3 class="sys__title">${esc(s.title)}</h3>
          ${s.summary ? `<p class="sys__summary">${esc(s.summary)}</p>` : ""}
          ${features.length ? `<ul class="sys__features" aria-label="${key === "released" ? "What's in it" : "What it's built to do"}">${features.map((f) => `<li>${icon("check")}<span>${esc(f)}</span></li>`).join("")}</ul>` : ""}
          ${s.install ? `<button class="sys__install copy" type="button" data-copy="${esc(s.install)}" aria-label="Copy Wally line">
              <span class="copy__label">${esc(s.install)}</span>${icon("copy", "icon copy__icon")}
            </button>` : ""}
          ${tags.length ? `<ul class="chips" aria-label="Built with">${tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          <div class="sys__actions">
            ${source}
            ${demo ? `<a class="btn btn--ghost" href="${esc(demo)}" target="_blank" rel="noopener">${icon("game-controller")}Try the demo</a>` : ""}
          </div>
        </div>
      </article>`;
  }

  const live = all.filter((s) => !isPlanned(s));
  const planned = all.filter(isPlanned);

  listEl.innerHTML = live.length
    ? live.map(card).join("")
    : `<p class="oss__empty">The first system is on its way. Follow along on <a href="https://github.com/JMScripts1" target="_blank" rel="noopener">GitHub</a>.</p>`;

  if (nextEl) {
    const ul = nextEl.querySelector("ul");
    if (planned.length && ul) {
      ul.innerHTML = planned.map((s) => `
        <li>
          ${sysIcon(s.icon)}
          <div><h4>${esc(s.title)}</h4>${s.summary ? `<p>${esc(s.summary)}</p>` : ""}</div>
        </li>`).join("");
      nextEl.hidden = false;
    }
  }

  // Wire up copy buttons that were added after main.js ran.
  listEl.querySelectorAll(".sys__install").forEach((btn) => {
    const label = btn.querySelector(".copy__label");
    const use = btn.querySelector(".copy__icon use");
    const original = label.textContent;
    let timer;
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { return; }
      label.textContent = "Copied";
      use.setAttribute("href", "assets/icons.svg#i-check");
      btn.dataset.state = "done";
      clearTimeout(timer);
      timer = setTimeout(() => { label.textContent = original; use.setAttribute("href", "assets/icons.svg#i-copy"); delete btn.dataset.state; }, 1800);
    });
  });

  // Demo clips: play while visible, pause when scrolled away.
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) en.isIntersecting ? en.target.play().catch(() => {}) : en.target.pause();
    }, { threshold: 0.35 });
    listEl.querySelectorAll("video").forEach((v) => io.observe(v));
  }
})();
