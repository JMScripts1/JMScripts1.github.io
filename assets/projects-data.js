/*
  ============================================================
  PROJECTS  (edit this file to add or change projects on the home page)
  ============================================================
  How to edit on GitHub:
    1. Open this file on github.com and click the pencil icon.
    2. Copy one of the project blocks below, paste it where you want it
       (top of the list shows first), and change the values.
    3. Click "Commit changes". The site updates in about a minute.

  Screenshots: upload them to the assets/projects folder
  ("Add file" > "Upload files"), then use the path, e.g.
  image: "assets/projects/my-dashboard.png"

  Fields (only title and summary are required):
    title     project name
    area      the filter it belongs to. Use one of:
              "Backend & data", "Systems & DevOps", "Games", "C++", "Web"
              (or a new one; filter buttons appear once you have 4+ projects)
    summary   one or two sentences
    tags      tech used, shown as small chips: ["Python", "SQLite"]
    links     buttons: [{ label: "Source", url: "https://github.com/..." }]
    image     optional screenshot
    steps     optional "how it works" row (looks best on the first project):
              [{ icon: "database", title: "Stores", text: "..." }]
              icons you can use: desktop-tower, database, ticket, bell-ringing,
              chart-line-up, cpu, code, game-controller, wrench, lightning
    facts     optional label/value pairs: [{ label: "Storage", value: "SQLite" }]
    status    optional, e.g. "In progress" (shows a small tag)
    art       optional background painting for a project without screenshots,
              e.g. "assets/img/blossom-paint.webp"
    roadmap   optional milestone track for a project in progress. Mark finished
              ones with done: true; the first unfinished one shows as "Up next":
              [{ title: "Data layer", text: "...", done: true }]
  ============================================================
*/
window.PROJECTS = [
  {
    title: "OpsWatch",
    area: "Systems & DevOps",
    summary: "Self-hosted health monitoring for small IT environments, modeled on the tools managed service providers use every day.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Docker", "GitHub Actions"],
    links: [{ label: "Source", url: "https://github.com/JMScripts1/opswatch" }],
    steps: [
      { icon: "desktop-tower", title: "Agents check", text: "Disk, services, backups, TLS certs, OS updates" },
      { icon: "database", title: "Server stores", text: "Agents push results, no inbound ports needed" },
      { icon: "ticket", title: "Tickets track", text: "One ticket per problem, closed once it clears" },
      { icon: "bell-ringing", title: "Alerts send", text: "Discord or Slack, plus a daily summary" },
    ],
  },
  {
    title: "game-deal-tracker",
    area: "Backend & data",
    summary: "A Python pipeline pulls PC game prices from a public REST API and saves timestamped snapshots to SQLite.",
    tags: ["Python", "SQL", "SQLite", "Pandas", "Plotly Dash"],
    links: [{ label: "Source", url: "https://github.com/JMScripts1/game-deal-tracker" }],
    facts: [
      { label: "Storage", value: "3-table SQLite schema" },
      { label: "Dashboard", value: "Top deals, store comparisons, price trends" },
    ],
  },
  {
    title: "Murim Ascent combat system",
    area: "Games",
    summary: "Parry-based melee combat for a Deepwoken-inspired Roblox game, with M1 feints and cancels, posture, and readable attack tells.",
    tags: ["Luau", "Rojo", "Selene", "LemonSignal"],
    image: "assets/work/murim-combat-poster.jpg",
    status: "Prototype",
    links: [{ label: "Watch it", url: "commissions.html#work" }],
    facts: [
      { label: "Netcode", value: "Client-predicted, server-validated" },
      { label: "Built on", value: "Separate combat and movement state machines" },
    ],
  },
  {
    title: "Tree jumping",
    area: "Games",
    summary: "Aim-and-hop traversal for Naruto-style Roblox games: arc between trees, perch on branches, and chain jumps through a forest.",
    tags: ["Luau", "Rojo"],
    image: "assets/work/tree-jump-poster.jpg",
    links: [{ label: "Watch it", url: "commissions.html#work" }],
    facts: [
      { label: "Controls", value: "Y to hop, Space to launch off a branch" },
      { label: "Level design", value: "Optional landing markers per tree" },
    ],
  },
  {
    title: "Jianghu movement system",
    area: "Games",
    summary: "Momentum-based parkour movement for my parry-focused Roblox RPG. Sprint, slide, wall run, wall boost and vault all chain together, and chaining builds a Flow meter that raises the speed cap.",
    tags: ["Luau", "Rojo", "Wally", "Lune tests"],
    image: "assets/work/jianghu-movement-poster.jpg",
    links: [{ label: "Watch it", url: "commissions.html#work" }],
    steps: [
      { icon: "game-controller", title: "Input", text: "Double-tap to run, hold to sprint, jump to wall run" },
      { icon: "cpu", title: "State machine", text: "One shared FSM drives every move" },
      { icon: "desktop-tower", title: "Server check", text: "Client predicts, server checks speed and corrects" },
      { icon: "lightning", title: "Feel", text: "Spring camera, FOV kicks, sounds and particles" },
    ],
  },
  {
    title: "Inventory & Shop System",
    area: "Games",
    summary: "A server-authoritative inventory and shop for Roblox in strictly typed Luau, built to drop into any game. Items, tunables and visuals each live in one module.",
    tags: ["Luau", "Rojo", "ProfileStore", "luau-lsp", "StyLua", "Selene"],
    status: "In development",
    art: "assets/img/blossom-macro.webp",
    links: [{ label: "Source", url: "https://github.com/JMScripts1/Roblox-Inventory-System" }],
    roadmap: [
      { title: "Data layer", text: "Profile template and saving through ProfileStore", done: true },
      { title: "Inventory API", text: "Public add, remove and has calls, plus an equip signal" },
      { title: "Shop", text: "Buy and sell-back, every request validated" },
      { title: "Placeholder UI", text: "24-slot grid and equipment slots" },
      { title: "Edge cases", text: "Full bags, low funds, spam and malformed requests" },
      { title: "Final UI", text: "Themed styling, tooltips and drag and drop" },
    ],
  },
];
