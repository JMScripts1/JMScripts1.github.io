/*
  ============================================================
  OPEN SOURCE  (edit this file to add or update free systems)
  ============================================================
  Each entry is one system on the Open source page.
    - "Released" and "In progress" systems get a full card.
    - "Planned" systems show in the smaller "Coming next" list.
  Move an entry up the list to show it first.

  How to edit on GitHub:
    1. Open this file on github.com and click the pencil icon.
    2. Change an entry or copy one and fill it in.
    3. Click "Commit changes". The site updates in about a minute.

  Fields (only title is required):
    title     the system's name
    status    "Released", "In progress", or "Planned"
    icon      backpack, storefront, arrows-left-right, scroll,
              chat-circle-dots, flag-banner, sliders-horizontal, gift,
              package, cube, sword, person-simple-run, floppy-disk, code
    summary   one or two sentences about what it does
    features  short list of what's in it: ["...", "..."]
    tags      tech used, shown as small chips: ["Luau", "Rojo"]
    repo      GitHub link. Leave "" until the repo is public and the
              card shows "Source coming soon" instead
    demo      optional Roblox place link where people can try it
    install   optional Wally line, e.g. 'inventory = "jmscripts1/inventory@0.1.0"'
              (shown with a copy button)
    version   optional, e.g. "v0.1.0"
    media     optional clip or screenshot, same as Completed work:
              "assets/work/inventory.mp4" or a list of two formats
    poster    optional still image shown before a video plays
    art       optional background painting when there's no media yet,
              e.g. "assets/img/blossom-paint.webp"
  ============================================================
*/
window.OPEN_SOURCE = [
  {
    title: "Inventory & Shop System",
    status: "In progress",
    icon: "backpack",
    summary: "A server-authoritative inventory and shop in strictly typed Luau, built to drop into any game. Items, tunables and visuals each live in one module.",
    features: [
      "Saves through ProfileStore with a ready-made profile template",
      "Public add, remove and has calls, plus an equip signal",
      "Buy and sell-back shop where every request is validated on the server",
      "Handles full bags, low funds, spam and malformed requests",
    ],
    tags: ["Luau", "Rojo", "ProfileStore", "MIT"],
    repo: "https://github.com/JMScripts1/Roblox-Inventory-System",
    art: "assets/img/petal-wash.webp",
  },
  {
    title: "Trading",
    status: "Planned",
    icon: "arrows-left-right",
    summary: "Player-to-player trades with a two-step confirm and dupe protection. Works with any inventory that can add, remove and check items.",
  },
  {
    title: "Quests",
    status: "Planned",
    icon: "scroll",
    summary: "Data-driven quests and quest chains with a HUD tracker and rewards.",
  },
  {
    title: "Dialogue",
    status: "Planned",
    icon: "chat-circle-dots",
    summary: "Branching conversations with conditions, choices that fire events, and typewriter text.",
  },
  {
    title: "Rounds and matches",
    status: "Planned",
    icon: "flag-banner",
    summary: "Lobby, intermission, map voting, teams, spawning and win conditions.",
  },
  {
    title: "Settings and input",
    status: "Planned",
    icon: "sliders-horizontal",
    summary: "Rebindable keys with controller and mobile support, plus saved graphics and audio settings.",
  },
  {
    title: "Rewards",
    status: "Planned",
    icon: "gift",
    summary: "Daily login streaks, redeemable codes and playtime rewards.",
  },
];
