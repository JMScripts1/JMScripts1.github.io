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
    title: "Roblox games",
    area: "Games",
    summary: "In progress in Roblox Studio with Luau. They'll show up here once they ship.",
    tags: ["Luau", "Roblox Studio"],
    status: "In progress",
    art: "assets/img/blossom-paint.webp",
  },
];
