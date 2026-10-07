/*
  ============================================================
  COMMISSION QUEUE  (edit this file to update the website)
  ============================================================
  How to edit on GitHub:
    1. Open this file on github.com and click the pencil icon.
    2. Change the values below.
    3. Click "Commit changes". The site updates in about a minute.

  Rules so nothing breaks:
    - Keep the quotes around text, and the commas between items.
    - Dates are "YYYY-MM-DD", for example "2026-10-24".
    - Delete a project from the list once it's delivered.

  stage can be:
    "in-progress"  you're building it right now (uses a slot)
    "review"       delivered a build, waiting on the client (uses a slot)
    "queued"       booked and deposit paid, but not started yet (waitlist)

  eta = the date you expect to FINISH that project. It's what the site
  uses to estimate when the next slot opens. Leave it "" if unsure.

  client = what to show publicly. Use "Private" to hide who it's for.
  progress = optional, 0 to 100, only shown for in-progress work.
  priority = add  priority: true  to a project when the client paid for
  priority. It gets a "Priority" tag and jumps ahead of the normal waitlist.
  ============================================================
*/
window.COMMISSIONS = {
  // How many projects you take on at the same time.
  slots: 3,

  // "auto" works it out from the projects below.
  // "closed" shows that you aren't taking requests at all right now.
  status: "auto",

  // Priority option shown in the queue. Set available to false to hide it.
  // fee is the extra cost as text, e.g. "+30%" or "$25". Leave "" to say "an extra fee".
  priority: { available: true, fee: "" },

  // Optional short message shown with the queue. Leave "" for none.
  note: "",

  // Change this whenever you edit the file, so visitors know it's current.
  updated: "2026-10-07",

  projects: [
    // Examples (remove the two slashes at the start of a line to use it):
    // { title: "Combo melee system", type: "Combat", client: "Private", stage: "in-progress", progress: 60, eta: "2026-10-20" },
    // { title: "Shop and inventory UI", type: "UI", client: "Private", stage: "queued", eta: "2026-11-02" },
    // { title: "Boss fight AI", type: "Combat", client: "Private", stage: "queued", priority: true, eta: "2026-10-30" },
  ],
};
