// Commission queue: reads window.COMMISSIONS (assets/queue-data.js) and fills in
// the availability badge, the queue section, the start estimate, and the home
// page banner. If the data file is missing or broken, the static fallback text
// in the HTML stays in place.
(() => {
  const data = window.COMMISSIONS;
  if (!data || !Array.isArray(data.projects)) return;

  const DAY = 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const slots = Math.max(1, Number(data.slots) || 1);

  const parseDate = (s) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || "").trim());
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  };
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  const projects = data.projects.filter((p) => p && typeof p === "object");
  const active = projects.filter((p) => p.stage === "in-progress" || p.stage === "review");
  const queued = projects.filter((p) => p.stage === "queued");
  const closed = data.status === "closed";
  const free = Math.max(0, slots - active.length);

  // Estimate when a new request could start: every slot frees up at its project's
  // eta (overdue projects count as finishing today), queued projects take the
  // earliest slot in order, and the new request gets the next one after that.
  function estimateStart() {
    const ends = active.map((p) => {
      const d = parseDate(p.eta);
      return d ? Math.max(d.getTime(), today.getTime()) : Infinity;
    });
    for (let i = 0; i < free; i++) ends.push(today.getTime());
    for (const q of queued) {
      ends.sort((a, b) => a - b);
      const start = ends.shift();
      if (start === undefined || start === Infinity) return null;
      const d = parseDate(q.eta);
      ends.push(d ? Math.max(d.getTime(), start) : start + 14 * DAY);
    }
    ends.sort((a, b) => a - b);
    const next = ends[0];
    return next === undefined || next === Infinity ? null : new Date(next);
  }

  const start = closed ? null : estimateStart();
  const startsNow = start && start.getTime() <= today.getTime();
  const state = closed ? "closed" : startsNow ? "open" : "waitlist";

  const statusText = {
    open: free > 0 ? `Open for commissions, ${plural(free, "slot")} free` : "Open for commissions",
    waitlist: "Booked up, waitlist open",
    closed: "Commissions closed",
  }[state];

  document.querySelectorAll("[data-queue-status]").forEach((el) => {
    el.dataset.state = state;
    const label = el.querySelector("[data-queue-status-text]");
    if (label) label.textContent = statusText;
  });

  document.querySelectorAll("[data-queue-headline]").forEach((el) => {
    el.textContent = {
      open: "Open for Roblox scripting commissions",
      waitlist: "Booked up right now, waitlist open",
      closed: "Commissions are closed for now",
    }[state];
  });

  const estimateText = closed
    ? "Not taking new requests right now"
    : startsNow ? "Right away"
    : start ? `Around ${fmt(start)}`
    : "Ask on Discord";

  document.querySelectorAll("[data-queue-estimate]").forEach((el) => { el.textContent = estimateText; });

  const root = document.getElementById("queue-board");
  if (!root) return;

  const ICONS = { movement: "person-simple-run", combat: "sword", ui: "layout", data: "floppy-disk", fixes: "wrench" };
  const iconFor = (type) => {
    const t = String(type || "").toLowerCase();
    const key = Object.keys(ICONS).find((k) => t.includes(k)) || (t.includes("fix") ? "fixes" : "");
    return ICONS[key] || "code";
  };
  const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="assets/icons.svg#i-${name}"/></svg>`;

  const slotCards = [];
  active.forEach((p) => {
    const eta = parseDate(p.eta);
    const pct = Math.max(0, Math.min(100, Number(p.progress)));
    const showPct = p.stage === "in-progress" && Number.isFinite(pct) && p.progress !== undefined && p.progress !== "";
    slotCards.push(`
      <li class="slot slot--taken">
        <div class="slot__top">
          ${icon(iconFor(p.type), "icon slot__icon")}
          <span class="slot__stage">${p.stage === "review" ? "Waiting on client feedback" : "In progress"}</span>
        </div>
        <h3 class="slot__title">${esc(p.title || "Commission")}</h3>
        <p class="slot__meta">${esc([p.type, p.client === "Private" ? "Private client" : p.client].filter(Boolean).join(" · "))}</p>
        ${showPct ? `<div class="slot__progress"><span class="slot__bar" style="--p:${pct}%"></span><span>${pct}%</span></div>` : ""}
        <p class="slot__eta">${eta ? `Done around ${fmt(eta)}` : "Finish date to be set"}</p>
      </li>`);
  });
  for (let i = 0; i < free; i++) {
    slotCards.push(`
      <li class="slot slot--open">
        <div class="slot__top">${icon("check-circle", "icon slot__icon")}<span class="slot__stage">${closed ? "Closed" : "Open slot"}</span></div>
        <h3 class="slot__title">${closed ? "Not taking requests" : "Available now"}</h3>
        ${closed || i > 0 ? "" : `<a class="slot__cta" href="#request">Request a commission</a>`}
      </li>`);
  }

  const waitlist = queued.length
    ? `<div class="waitlist">
        <h3>Waitlist <span>${plural(queued.length, "project")} booked</span></h3>
        <ol>${queued.map((q) => `<li>${icon(iconFor(q.type))}<span><strong>${esc(q.title || "Commission")}</strong> ${esc(q.type || "")}</span></li>`).join("")}</ol>
      </div>`
    : "";

  const updated = parseDate(data.updated);
  root.innerHTML = `
    <div class="qsum" data-state="${state}">
      <p class="qsum__label">Estimated start for a new request</p>
      <p class="qsum__value">${esc(estimateText)}</p>
      <p class="qsum__detail">${closed ? "Message me on Discord if you'd like a heads-up when I reopen." : `${active.length} of ${slots} slots in use${queued.length ? `, ${plural(queued.length, "project")} waiting` : ""}.`}</p>
      ${data.note ? `<p class="qsum__note">${esc(data.note)}</p>` : ""}
      <p class="qsum__updated">Estimate based on current projects${updated ? `. Updated ${fmt(updated)}.` : "."}</p>
    </div>
    <div class="qboard">
      <ul class="slots">${slotCards.join("")}</ul>
      ${waitlist}
    </div>`;
  root.dataset.ready = "true";
})();
