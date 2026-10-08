// Projects: reads window.PROJECTS (assets/projects-data.js) and rebuilds the
// home page Projects grid. The grid already has hand-written cards in the HTML,
// so if the data file is missing or broken those stay in place.
(() => {
  const list = Array.isArray(window.PROJECTS) ? window.PROJECTS.filter((p) => p && p.title) : [];
  const grid = document.getElementById("projects-grid");
  if (!grid || !list.length) return;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Web links, files in the site, or another page of the site (e.g. "commissions.html#work").
  const safeUrl = (u) => { const s = String(u || "").trim(); return /^(https?:\/\/|assets\/|[\w-]+\.html(#[\w-]+)?$)/i.test(s) ? s : ""; };
  const ICONS = new Set(["desktop-tower", "database", "ticket", "bell-ringing", "chart-line-up", "cpu", "code", "game-controller", "wrench", "lightning", "check-circle", "clock-countdown"]);
  const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="assets/icons.svg#i-${ICONS.has(name) ? name : "code"}"/></svg>`;
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Same row-filling rule as Completed work: on 3 columns the first card spans 2
  // and/or the last card spans the row so no row is left with a gap; on 2 columns
  // an odd count makes the first card span both.
  const n = list.length;
  const layout = (i) => {
    const c = [];
    if ((n % 3 === 2 || (n % 3 === 0 && n >= 3)) && i === 0) c.push("c3-span2");
    if ((n % 3 === 1 || (n % 3 === 0 && n >= 3)) && i === n - 1) c.push("c3-span3");
    if (n % 2 === 1 && i === 0) c.push("c2-span2");
    return c.join(" ");
  };

  function card(p, i) {
    const art = safeUrl(p.art), img = safeUrl(p.image);
    const links = (Array.isArray(p.links) ? p.links : [])
      .filter((l) => l && safeUrl(l.url))
      .map((l) => `<a class="pj__link" href="${esc(safeUrl(l.url))}"${/^https?:/i.test(l.url) ? ' target="_blank" rel="noopener"' : ""}>${esc(l.label || "Open")}<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#i-arrow-up-right"/></svg></a>`)
      .join("");
    const steps = Array.isArray(p.steps) && p.steps.length
      ? `<ol class="flow pj__flow" aria-label="How ${esc(p.title)} works">${p.steps.map((s) => `
          <li class="flow__step">${icon(s.icon)}<strong>${esc(s.title)}</strong><span>${esc(s.text)}</span></li>`).join("")}</ol>`
      : "";
    const facts = Array.isArray(p.facts) && p.facts.length
      ? `<dl class="facts">${p.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}</dl>`
      : "";
    // Milestone track: done ones fill in, the first unfinished one is "Up next".
    const road = Array.isArray(p.roadmap) ? p.roadmap.filter((m) => m && m.title) : [];
    const next = road.findIndex((m) => !m.done);
    const roadmap = road.length
      ? `<div class="road">
          <p class="road__count"><strong>${road.filter((m) => m.done).length} of ${road.length}</strong> milestones done</p>
          <ol class="road__list" aria-label="${esc(p.title)} roadmap">${road.map((m, j) => {
            const st = m.done ? "done" : j === next ? "next" : "todo";
            const tag = st === "done" ? "Done" : st === "next" ? "Up next" : "Planned";
            return `
            <li class="road__step is-${st}">
              <span class="road__state">${st === "done" ? icon("check-circle") : st === "next" ? icon("clock-countdown") : ""}${tag}</span>
              <strong>${esc(m.title)}</strong>${m.text ? `<span>${esc(m.text)}</span>` : ""}
            </li>`;
          }).join("")}</ol>
        </div>`
      : "";
    const tags = Array.isArray(p.tags) && p.tags.length
      ? `<ul class="chips" aria-label="Built with">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
      : "";
    return `
      <article class="pj ${layout(i)}${art ? " pj--art" : ""}${img ? " pj--img" : ""}${roadmap ? " pj--road" : ""}" data-area="${slug(p.area)}">
        ${art ? `<img class="pj__art" src="${esc(art)}" alt="" loading="lazy">` : ""}
        ${img ? `<a class="pj__shot" href="${esc(img)}" target="_blank" rel="noopener"><img src="${esc(img)}" alt="Screenshot of ${esc(p.title)}" loading="lazy"></a>` : ""}
        <div class="pj__body">
          <div class="tile__head">
            <h3 class="tile__title">${esc(p.title)}</h3>
            ${links ? `<div class="pj__links">${links}</div>` : ""}
          </div>
          ${p.area || p.status ? `<p class="pj__area">${esc(p.area || "")}${p.status ? `<span class="pj__status${roadmap ? " pj__status--live" : ""}">${esc(p.status)}</span>` : ""}</p>` : ""}
          <p class="tile__body">${esc(p.summary)}</p>
          ${steps}${facts}${roadmap}${tags}
        </div>
      </article>`;
  }

  grid.className = "pgrid";
  grid.innerHTML = list.map(card).join("");

  // Area filters once there are enough projects to need them.
  const areas = [...new Map(list.filter((p) => p.area).map((p) => [slug(p.area), p.area])).entries()];
  const filters = document.getElementById("projects-filters");
  if (filters && list.length >= 4 && areas.length >= 2) {
    filters.innerHTML = `<button type="button" class="wf is-on" data-f="">All</button>` +
      areas.map(([k, label]) => `<button type="button" class="wf" data-f="${k}">${esc(label)}</button>`).join("");
    filters.hidden = false;
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".wf");
      if (!b) return;
      filters.querySelectorAll(".wf").forEach((x) => x.classList.toggle("is-on", x === b));
      grid.classList.toggle("is-filtered", !!b.dataset.f);
      grid.querySelectorAll(".pj").forEach((el) => { el.hidden = !!b.dataset.f && el.dataset.area !== b.dataset.f; });
    });
  }
})();
