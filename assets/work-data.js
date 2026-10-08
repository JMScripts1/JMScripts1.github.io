/*
  ============================================================
  COMPLETED WORK  (edit this file to add finished commissions)
  ============================================================
  The "Completed work" section on the commissions page stays hidden
  until there's at least one entry here.

  Adding a clip or screenshot:
    1. On github.com, open the assets/work folder and click
       "Add file" > "Upload files". Drop in your image, GIF or video.
       Keep videos short (5 to 20 seconds) and under about 10 MB.
       Use .mp4 for video. Bigger videos: upload to YouTube instead
       and paste the YouTube link as the media.
    2. Open this file, click the pencil, and add an entry like the
       example below. Newest work goes at the top of the list.
    3. Click "Commit changes". The site updates in about a minute.

  Fields (only title is required):
    title     what you built
    type      Movement, Combat, UI, Data, or Fixes (picks the icon and filter)
    client    who it was for. Use "Private" if they'd rather not be named
    date      when you delivered it, "YYYY-MM" or "YYYY-MM-DD"
    summary   one or two sentences about what it does
    media     "assets/work/your-file.mp4" (or .png/.jpg/.gif/.webp),
              or a YouTube link
    poster    optional still image shown before a video starts playing
              (media can also be a list of the same video in two formats,
              e.g. ["assets/work/clip.webm", "assets/work/clip.mp4"])
    client    can also be "Personal project" for your own work
    proof     a screenshot of the client confirming or vouching for it,
              e.g. "assets/work/vouch-boss-ai.png". Shown as "View proof"
    review    a short quote from the client (keep it to a sentence or two)
    reviewer  who said it, e.g. "Owner of [game name]"
    links     buttons under the entry, e.g. the Roblox game page:
              [{ label: "Play the game", url: "https://www.roblox.com/games/..." }]

  Only post client names, games, and quotes with their permission.
  ============================================================
*/
window.COMPLETED_WORK = [
  {
    title: "Jianghu movement system",
    type: "Movement",
    client: "Personal project",
    summary: "Parkour-style movement for my parry-based Roblox RPG: sprint, slide, double jump, wall run, wall cling, wall boost and vault, with momentum that carries between moves. Chaining moves builds a Flow meter that raises the speed cap.",
    media: ["assets/work/jianghu-movement.webm", "assets/work/jianghu-movement.mp4"],
    poster: "assets/work/jianghu-movement-poster.jpg",
  },
  // Example (remove the slashes at the start of each line to use it):
  // {
  //   title: "Combo melee system",
  //   type: "Combat",
  //   client: "Private",
  //   date: "2026-10",
  //   summary: "Four-hit combos with blocking, parries and server-side hit validation.",
  //   media: "assets/work/combo-melee.mp4",
  //   proof: "assets/work/vouch-combo-melee.png",
  //   review: "Hitboxes feel tight and it was delivered early.",
  //   reviewer: "Game owner",
  //   links: [{ label: "Play the game", url: "https://www.roblox.com/games/..." }],
  // },
];
