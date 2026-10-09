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

// Off-the-clock media: a beat player with a seekable waveform, and the edit
// preview. Starting one pauses the other.
const beat = document.querySelector(".beat");
const edit = document.querySelector(".edit");
const editVideo = edit && edit.querySelector("video");
const beatAudio = beat && beat.querySelector("audio");

if (beat) {
  const btn = beat.querySelector(".beat__play");
  const use = btn.querySelector("use");
  const wave = beat.querySelector(".beat__wave");
  const now = beat.querySelector("[data-beat-now]");
  const peaks = beat.dataset.peaks.split(",").map(Number);
  wave.innerHTML = peaks.map((h) => `<i style="height:${Math.round(h * 100)}%"></i>`).join("");
  const bars = [...wave.children];
  const total = 82;
  const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

  const render = () => {
    const t = beatAudio.currentTime || 0;
    const lit = Math.round((t / (beatAudio.duration || total)) * bars.length);
    bars.forEach((b, i) => b.classList.toggle("is-on", i < lit));
    now.textContent = fmt(t);
    wave.setAttribute("aria-valuenow", Math.round(t));
  };
  const setPlaying = (on) => {
    btn.setAttribute("aria-pressed", on);
    btn.setAttribute("aria-label", on ? "Pause beat" : "Play beat");
    use.setAttribute("href", `assets/icons.svg#i-${on ? "pause" : "play-fill"}`);
  };

  btn.addEventListener("click", () => {
    if (beatAudio.paused) {
      if (editVideo) editVideo.pause();
      beatAudio.volume = 0.7;
      beatAudio.play().catch(() => {});
    } else {
      beatAudio.pause();
    }
  });
  beatAudio.addEventListener("play", () => setPlaying(true));
  beatAudio.addEventListener("pause", () => setPlaying(false));
  beatAudio.addEventListener("ended", () => { beatAudio.currentTime = 0; render(); });
  beatAudio.addEventListener("timeupdate", render);

  const seekTo = (x) => {
    const r = wave.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (x - r.left) / r.width));
    if (beatAudio.readyState === 0) beatAudio.load();
    beatAudio.currentTime = f * (beatAudio.duration || total);
    render();
  };
  wave.addEventListener("pointerdown", (e) => {
    seekTo(e.clientX);
    wave.setPointerCapture(e.pointerId);
    const move = (ev) => seekTo(ev.clientX);
    wave.addEventListener("pointermove", move);
    wave.addEventListener("pointerup", () => wave.removeEventListener("pointermove", move), { once: true });
  });
  wave.addEventListener("keydown", (e) => {
    const step = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0;
    if (!step) return;
    e.preventDefault();
    beatAudio.currentTime = Math.min(total, Math.max(0, beatAudio.currentTime + step));
    render();
  });
}

if (edit) {
  edit.addEventListener("click", () => {
    if (editVideo.paused) {
      if (beatAudio) beatAudio.pause();
      editVideo.play().catch(() => {});
    } else {
      editVideo.pause();
    }
  });
  editVideo.addEventListener("play", () => { edit.classList.add("is-playing"); edit.setAttribute("aria-label", "Pause edit"); });
  editVideo.addEventListener("pause", () => { edit.classList.remove("is-playing"); edit.setAttribute("aria-label", "Play edit with sound"); });
  editVideo.addEventListener("ended", () => { editVideo.currentTime = 0; });
}
