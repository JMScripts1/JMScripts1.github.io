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
              "Backend & data", "Systems & DevOps", "C++", "Web"
              (or a new one; filter buttons appear once you have 4+ projects)
    summary   one or two sentences
    tags      tech used, shown as small chips: ["Python", "SQLite"]
    links     buttons: [{ label: "Source", url: "https://github.com/..." }]
    image     optional screenshot
    imageDark optional dark mode version of the screenshot
    site      optional live page. The screenshot links here and a
              "Live page" button is added before your other links.
    steps     optional "how it works" row (looks best on the first project):
              [{ icon: "database", title: "Stores", text: "..." }]
              icons you can use: desktop-tower, database, ticket, bell-ringing,
              chart-line-up, cpu, code, game-controller, wrench, lightning
    facts     optional label/value pairs: [{ label: "Storage", value: "SQLite" }]
    status    optional, e.g. "In progress" (shows a small tag)
    art       optional background painting for a project without screenshots,
              e.g. "assets/img/starfield.webp"
    roadmap   optional milestone track for a project in progress. Mark finished
              ones with done: true; the first unfinished one shows as "Up next":
              [{ title: "Data layer", text: "...", done: true }]
  ============================================================
*/
window.PROJECTS = [
  {
    title: "OpsWatch",
    area: "Systems & DevOps",
    status: "In progress",
    summary: "Self-hosted IT health monitoring modelled on the remote monitoring tools managed service providers use. Linux and Windows agents report to a FastAPI server over HTTPS.",
    tags: ["Python", "FastAPI", "PostgreSQL", "Docker Compose", "GitHub Actions", "PowerShell", "pytest"],
    links: [{ label: "Source", url: "https://github.com/JMScripts1/opswatch" }],
    steps: [
      { icon: "desktop-tower", title: "Agents check", text: "Disk, services, backup age, TLS expiry, pending updates" },
      { icon: "database", title: "Server stores", text: "FastAPI and PostgreSQL, run with Docker Compose" },
      { icon: "ticket", title: "Rules engine", text: "One ticket per problem, escalated, closed once it clears" },
      { icon: "bell-ringing", title: "Alerts send", text: "Discord or Slack, plus a daily summary" },
    ],
    facts: [
      { label: "CI", value: "Lint, pytest and a Docker build on every push" },
    ],
  },
  {
    title: "Game Deal Tracker",
    area: "Backend & data",
    summary: "An automated pipeline pulls PC game prices from a public REST API into a normalized SQLite database, and SQL queries feed a Plotly Dash dashboard.",
    tags: ["Python", "SQL", "SQLite", "Pandas", "Plotly Dash"],
    site: "https://jmscripts1.github.io/game-deal-tracker/",
    image: "assets/projects/game-deal-tracker-dark.webp",
    links: [{ label: "Source", url: "https://github.com/JMScripts1/game-deal-tracker" }],
    facts: [
      { label: "Storage", value: "3-table SQLite schema" },
      { label: "Dashboard", value: "Top deals, store comparisons, price trends" },
    ],
  },
];
