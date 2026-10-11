/*
  ============================================================
  PRICES  (edit this file to change commission prices)
  ============================================================
  These fill the "Prices" section on the commissions page and the
  "Job size" dropdown in the request form.

  How to edit on GitHub:
    1. Open this file on github.com and click the pencil icon.
    2. Change a min or max (in USD), or copy a tier and edit it.
    3. Click "Commit changes". The site updates in about a minute.

  Fields:
    robuxPerDollar  how many Robux count as $1 (Robux prices are worked out from this)
    launch          true shows the "launch prices" note. Set to false once you raise prices
    categories      one per service. Each has:
      title         shown on the tab
      icon          person-simple-run, sword, layout, floppy-disk, wrench
      tiers         the price list for that service:
        name        short name of the job
        detail      what it includes, one line
        min, max    price range in USD
        each        optional, true for per-item prices (shows "each")
  ============================================================
*/
window.PRICES = {
  robuxPerDollar: 100,
  launch: true,
  categories: [
    {
      title: "Movement",
      icon: "person-simple-run",
      tiers: [
        { name: "One mechanic", detail: "Sprint and stamina, dash, double jump, or slide", min: 5, max: 15 },
        { name: "Movement kit", detail: "3 to 4 moves that share momentum", min: 25, max: 50 },
        { name: "Full parkour", detail: "Wall run, vault, climb and momentum, like the Jianghu system", min: 60, max: 110 },
      ],
    },
    {
      title: "Combat",
      icon: "sword",
      tiers: [
        { name: "Basic melee", detail: "M1 combo, hitboxes, damage and cooldowns", min: 15, max: 25 },
        { name: "Full melee", detail: "Blocking, parries, stuns and server-side checks", min: 40, max: 80 },
        { name: "Extra ability", detail: "Code only, hooked up to your VFX", min: 5, max: 15, each: true },
      ],
    },
    {
      title: "UI",
      icon: "layout",
      tiers: [
        { name: "One menu or HUD", detail: "Your design, wired up with tweens", min: 5, max: 15 },
        { name: "Shop or inventory UI", detail: "Connected to your game's data", min: 25, max: 50 },
        { name: "Full UI flow", detail: "Main menu, settings, shop and HUD", min: 50, max: 90 },
      ],
    },
    {
      title: "Data",
      icon: "floppy-disk",
      tiers: [
        { name: "Saving and currency", detail: "DataStores, leaderstats and currencies", min: 10, max: 20 },
        { name: "Levels and XP", detail: "XP curve, level ups and rewards", min: 15, max: 35 },
        { name: "Quests or daily rewards", detail: "Quest tracking or login streaks, saved per player", min: 25, max: 60 },
      ],
    },
    {
      title: "Fixes",
      icon: "wrench",
      tiers: [
        { name: "Small bug fix", detail: "One bug in one script", min: 5, max: 10 },
        { name: "Script cleanup", detail: "Fix or tidy up one script or system", min: 10, max: 30 },
      ],
    },
  ],
};
