// Completed work: reads window.COMPLETED_WORK (assets/work-data.js) and builds the
// showcase on the commissions page. The section stays hidden while the list is
// empty. Videos play muted only while on screen, and never autoplay for visitors
// who prefer reduced motion.
(() => {
  const list = Array.isArray(window.COMPLETED_WORK) ? window.COMPLETED_WORK.filter((w) => w && w.title) : [];
  const section = document.getElementById("work");
  const grid = document.getElementById("work-grid");
  if (!section || !grid || !list.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Only allow web links and files inside the site, so a typo can't inject a script URL.
  const safeUrl = (u) => {
    const s = String(u || "").trim();
    return /^(https?:\/\/|assets\/)/i.test(s) ? s : "";
  };
  const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="assets/icons.svg#i-${name}"/></svg>`;
  const ICONS = { movement: "person-simple-run", combat: "sword", ui: "layout", data: "floppy-disk", fix: "wrench" };
  const typeKey = (t) => Object.keys(ICONS).find((k) => String(t || "").toLowerCase().includes(k)) || "";
  const iconFor = (t) => ICONS[typeKey(t)] || "code";

  const fmtDate = (s) => {
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(s || "").trim());
    if (!m) return esc(s || "");
    const d = new Date(+m[1], +m[2] - 1, +(m[3] || 1));
    return d.toLocaleDateString("en-US", m[3] ? { month: "short", day: "numeric", year: "numeric" } : { month: "short", year: "numeric" });
  };

  const youtubeId = (u) => {
    const m = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/.exec(u);
    return m ? m[1] : "";
  };

  function media(w) {
    const src = safeUrl(w.media);
    if (!src) {
      return `<div class="wk__media wk__media--none">${icon(iconFor(w.type), "icon wk__glyph")}</div>`;
    }
    const yt = youtubeId(src);
    if (yt) {
      return `<div class="wk__media"><button class="wk__yt" type="button" data-yt="${yt}" aria-label="Play video: ${esc(w.title)}">
          <img src="https://i.ytimg.com/vi/${yt}/hqdefault.jpg" alt="" loading="lazy">
          <span class="wk__play">${icon("play")}</span>
        </button></div>`;
    }
    if (/\.(mp4|webm|mov)(\?|$)/i.test(src)) {
      return `<div class="wk__media"><video src="${esc(src)}" muted loop playsinline preload="metadata" ${reduce ? "controls" : ""} aria-label="${esc(w.title)}"></video></div>`;
    }
    return `<a class="wk__media" href="${esc(src)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(w.title)}" loading="lazy"></a>`;
  }

  // Keep rows full at every width: on the 3-column layout one card grows to fill
  // the leftover space (first card spans 2, or last card spans the full row), and
  // on the 2-column layout an odd count makes the first card span both columns.
  const n = list.length;
  function layoutClass(i) {
    const c = [];
    if (n % 3 === 2 && i === 0) c.push("c3-span2");
    if (n % 3 === 1 && i === n - 1) c.push("c3-span3");
    if (n % 2 === 1 && i === 0) c.push("c2-span2");
    return c.join(" ");
  }

  function card(w, i) {
    const meta = [w.type ? esc(w.type) : "", w.date ? fmtDate(w.date) : ""].filter(Boolean).join(" · ");
    const client = w.client ? (w.client === "Private" ? "Private client" : `For ${esc(w.client)}`) : "";
    const proof = safeUrl(w.proof);
    const links = (Array.isArray(w.links) ? w.links : [])
      .map((l) => (l && safeUrl(l.url) ? `<a class="wk__link" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">${esc(l.label || "Open")}${icon("arrow-square-out")}</a>` : ""))
      .join("");
    return `
      <article class="wk ${layoutClass(i)}" data-type="${typeKey(w.type)}">
        ${media(w)}
        <div class="wk__body">
          <p class="wk__meta">${icon(iconFor(w.type))}<span>${meta}</span></p>
          <h3 class="wk__title">${esc(w.title)}</h3>
          ${client ? `<p class="wk__client">${client}</p>` : ""}
          ${w.summary ? `<p class="wk__summary">${esc(w.summary)}</p>` : ""}
          ${w.review ? `<blockquote class="wk__review"><p>“${esc(w.review)}”</p>${w.reviewer ? `<cite>${esc(w.reviewer)}</cite>` : ""}</blockquote>` : ""}
          ${proof || links ? `<div class="wk__actions">
            ${proof ? `<a class="wk__link wk__link--proof" href="${esc(proof)}" target="_blank" rel="noopener">${icon("seal-check")}View proof</a>` : ""}
            ${links}
          </div>` : ""}
        </div>
      </article>`;
  }

  // Filter chips only once there's enough work across more than one type to need them.
  const types = [...new Set(list.map((w) => typeKey(w.type)).filter(Boolean))];
  const filters = document.getElementById("work-filters");
  if (filters && list.length >= 5 && types.length >= 2) {
    const label = { movement: "Movement", combat: "Combat", ui: "UI", data: "Data", fix: "Fixes" };
    filters.innerHTML = [`<button type="button" class="wf is-on" data-f="">All</button>`]
      .concat(types.map((t) => `<button type="button" class="wf" data-f="${t}">${label[t]}</button>`)).join("");
    filters.hidden = false;
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".wf");
      if (!b) return;
      filters.querySelectorAll(".wf").forEach((x) => x.classList.toggle("is-on", x === b));
      grid.querySelectorAll(".wk").forEach((el) => { el.hidden = b.dataset.f && el.dataset.type !== b.dataset.f; });
    });
  }

  grid.innerHTML = list.map(card).join("");
  section.hidden = false;

  const count = document.getElementById("work-count");
  if (count) count.textContent = `${list.length} finished ${list.length === 1 ? "commission" : "commissions"}`;

  // YouTube: load the player only when someone clicks, so the page stays light.
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".wk__yt");
    if (!b) return;
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;
    f.title = b.getAttribute("aria-label");
    f.allow = "autoplay; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    b.replaceWith(f);
  });

  // Local clips: play while visible, pause when scrolled away.
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) en.isIntersecting ? en.target.play().catch(() => {}) : en.target.pause();
    }, { threshold: 0.35 });
    grid.querySelectorAll("video").forEach((v) => io.observe(v));
  }
})();
