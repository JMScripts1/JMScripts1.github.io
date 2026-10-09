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
    code      instead of media, a code sample to show on the card:
              "assets/work/your-snippet.luau" (upload the file to assets/work
              first). Keep it to about 30 lines with few comments
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
    title: "Tree jumping",
    type: "Movement",
    client: "Personal project",
    summary: "Naruto-style tree hopping: aim at a tree and press Y to arc onto it, perch on the branch and aim with the camera, then launch with Space or chain straight to the next tree. Designers can place exact landing spots, and the server checks every jump.",
    media: ["assets/work/tree-jump.webm", "assets/work/tree-jump.mp4"],
    poster: "assets/work/tree-jump-poster.jpg",
  },
  {
    title: "Murim Ascent combat system",
    type: "Combat",
    client: "Personal project",
    summary: "Parry-focused melee combat for a Deepwoken-style Roblox game: M1 strings with feints and cancels, a posture system, and clear visual tells before big attacks. The client plays every action instantly while the server checks each move and cooldown against its own copy of the fight.",
    media: ["assets/work/murim-combat.webm", "assets/work/murim-combat.mp4"],
    poster: "assets/work/murim-combat-poster.jpg",
  },
  {
    title: "Jianghu movement system",
    type: "Movement",
    client: "Personal project",
    summary: "Parkour-style movement for my parry-based Roblox RPG: sprint, slide, double jump, wall run, wall cling, wall boost and vault, with momentum that carries between moves. Chaining moves builds a Flow meter that raises the speed cap.",
    media: ["assets/work/jianghu-movement.webm", "assets/work/jianghu-movement.mp4"],
    poster: "assets/work/jianghu-movement-poster.jpg",
  },
  {
    title: "Landing logic cleanup",
    type: "Fixes",
    client: "Personal project",
    summary: "The client and server each had their own copy of the landing logic, and they drifted apart: the server kept dropping sprint to walk on landing and rubber-banding players. I merged both into one shared function and added a check that fails at startup if any state can't reach a landing.",
    code: "assets/work/landing-resolution.luau",
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
