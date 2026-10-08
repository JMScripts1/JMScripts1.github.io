document.getElementById("year").textContent = new Date().getFullYear();

// Fade sections in once as they enter the viewport.
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

// Copy buttons (email, Discord username), with a short confirmation.
document.querySelectorAll(".copy").forEach((btn) => {
  const label = btn.querySelector(".copy__label");
  const icon = btn.querySelector(".copy__icon use");
  const original = label.textContent;
  let timer;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch {
      if (btn.dataset.copy.includes("@")) window.location.href = "mailto:" + btn.dataset.copy;
      return;
    }
    label.textContent = "Copied";
    icon.setAttribute("href", "assets/icons.svg#i-check");
    btn.dataset.state = "done";
    clearTimeout(timer);
    timer = setTimeout(() => {
      label.textContent = original;
      icon.setAttribute("href", "assets/icons.svg#i-copy");
      delete btn.dataset.state;
    }, 1800);
  });
});

// Off-the-clock players: load SoundCloud and TikTok only when someone clicks.
const EMBEDS = {
  soundcloud: { src: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/woahqi&color=%239b3760&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&visual=false", title: "My beats on SoundCloud" },
  tiktok: { src: "https://www.tiktok.com/player/v1/7252436817214000389?autoplay=1&description=0&music_info=0&rel=0", title: "My edit on TikTok" },
};
document.querySelectorAll(".offclock__play").forEach((btn) => {
  btn.addEventListener("click", () => {
    const e = EMBEDS[btn.dataset.embed];
    const f = document.createElement("iframe");
    f.src = e.src;
    f.title = e.title;
    f.dataset.kind = btn.dataset.embed;
    f.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
    f.loading = "lazy";
    btn.replaceWith(f);
  });
});
