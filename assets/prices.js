// Prices: reads window.PRICES (assets/prices-data.js), builds the tabbed price list
// on the commissions page, fills the form's "Job size" dropdown, and writes the
// lowest price into any [data-price-from] element. Without the data file the
// section keeps its fallback text and the dropdown only offers "Not sure".
(() => {
  const data = window.PRICES;
  const cats = data && Array.isArray(data.categories) ? data.categories.filter((c) => c && c.title && Array.isArray(c.tiers) && c.tiers.length) : [];
  if (!cats.length) return;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ICONS = new Set(["person-simple-run", "sword", "layout", "floppy-disk", "wrench", "code"]);
  const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="assets/icons.svg#i-${ICONS.has(name) ? name : "code"}"/></svg>`;
  const rate = Number(data.robuxPerDollar) || 100;
  const range = (t) => (t.min === t.max ? `$${t.min}` : `$${t.min}-${t.max}`);
  const robux = (t) => {
    const f = (n) => Math.round(n * rate).toLocaleString("en-US");
    return t.min === t.max ? `${f(t.min)} R$` : `${f(t.min)}-${f(t.max)} R$`;
  };
  const minOf = (c) => Math.min(...c.tiers.map((t) => Number(t.min) || 0));

  document.querySelectorAll("[data-price-launch]").forEach((el) => { el.hidden = !data.launch; });
  document.querySelectorAll("[data-price-from]").forEach((el) => { el.textContent = `$${Math.min(...cats.map(minOf))}`; });

  // Price list: a tab per service, each panel lists that service's tiers.
  const board = document.getElementById("prices-board");
  if (board) {
    const tabs = cats.map((c, i) => `
      <button class="pt" type="button" role="tab" id="pt-${i}" aria-controls="pp-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
        ${icon(c.icon)}<span class="pt__name">${esc(c.title)}</span><span class="pt__from">from $${minOf(c)}</span>
      </button>`).join("");
    const panels = cats.map((c, i) => `
      <div class="pp" role="tabpanel" id="pp-${i}" aria-labelledby="pt-${i}" tabindex="0"${i === 0 ? "" : " hidden"}>
        <ul class="tiers">
          ${c.tiers.map((t) => `
            <li class="tier">
              <div class="tier__text"><h3>${esc(t.name)}</h3>${t.detail ? `<p>${esc(t.detail)}</p>` : ""}</div>
              <div class="tier__price"><strong>${range(t)}${t.each ? "<small> each</small>" : ""}</strong><span>${robux(t)}</span></div>
            </li>`).join("")}
        </ul>
      </div>`).join("");
    board.innerHTML = `<div class="ptabs" role="tablist" aria-label="Services">${tabs}</div><div class="ppanels">${panels}</div>`;

    const tabEls = [...board.querySelectorAll(".pt")];
    const select = (i, focus) => {
      tabEls.forEach((t, j) => {
        const on = i === j;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(`pp-${j}`).hidden = !on;
      });
      if (focus) tabEls[i].focus();
    };
    tabEls.forEach((t, i) => t.addEventListener("click", () => select(i)));
    // Arrow keys move between tabs, as screen reader users expect from a tab list.
    board.querySelector(".ptabs").addEventListener("keydown", (e) => {
      const i = tabEls.indexOf(document.activeElement);
      if (i < 0) return;
      const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabEls.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select((next + tabEls.length) % tabEls.length, true);
    });
    board.hidden = false;
    const fallback = document.getElementById("prices-fallback");
    if (fallback) fallback.hidden = true;
  }

  // Form dropdown: one group per service, plus "Not sure" already in the HTML.
  const tier = document.getElementById("f-tier");
  if (tier) {
    tier.insertAdjacentHTML("beforeend", cats.map((c) => `
      <optgroup label="${esc(c.title)}">
        ${c.tiers.map((t) => `<option>${esc(`${c.title}: ${t.name} (${range(t)}${t.each ? " each" : ""})`)}</option>`).join("")}
      </optgroup>`).join(""));
  }
})();
