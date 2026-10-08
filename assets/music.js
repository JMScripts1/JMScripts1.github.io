// Background music toggle for the commissions page.
// Browsers only allow sound after the visitor interacts with the page, so music
// starts when they press the toggle. The choice is remembered: if they left it on,
// it resumes on their first click or key press on the next visit.
//
// The track is only downloaded once someone turns music on. It loops with a
// crossfade: the silent tail is trimmed and the next pass fades in while the
// current one fades out, so there's no gap or jump at the loop point.
(() => {
  const MUSIC_FILE = "assets/audio/portfolio-music.mp3";
  const VOLUME = 0.12;      // overall loudness, 0 to 1. Kept very low on purpose.
  const CROSSFADE = 3;      // seconds the end of the track overlaps the start
  const STORE_KEY = "jm-music-on";

  const btn = document.querySelector(".music");
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!btn || !AC || !window.fetch) { if (btn) btn.hidden = true; return; }
  const label = btn.querySelector(".music__label");
  const iconUse = btn.querySelector(".music__icon use");

  let ctx, master, buffer, loopEnd, loading = null;
  let playing = false, nextStart = 0, scheduler = 0;
  const voices = new Set();

  const remember = (on) => { try { localStorage.setItem(STORE_KEY, on ? "1" : "0"); } catch {} };
  const wasOn = () => { try { return localStorage.getItem(STORE_KEY) === "1"; } catch { return false; } };

  function setUI(state) {
    const on = state === "on";
    btn.setAttribute("aria-pressed", String(on));
    btn.dataset.on = on ? "true" : "false";
    label.textContent = state === "loading" ? "Loading music" : on ? "Music on" : "Music off";
    iconUse.setAttribute("href", `assets/icons.svg#i-${on || state === "loading" ? "music-notes" : "speaker-simple-slash"}`);
  }

  // Where the music actually ends: skip the near-silent tail of the file.
  function findEnd(buf) {
    const ch = buf.getChannelData(0);
    for (let i = ch.length - 1; i > 0; i -= 64) {
      if (Math.abs(ch[i]) > 0.01) return Math.min(buf.duration, (i + 2048) / buf.sampleRate);
    }
    return buf.duration;
  }

  function load() {
    if (!loading) {
      loading = fetch(MUSIC_FILE)
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then((data) => new Promise((res, rej) => ctx.decodeAudioData(data, res, rej)))
        .then((buf) => { buffer = buf; loopEnd = findEnd(buf); });
      loading.catch(() => { loading = null; });
    }
    return loading;
  }

  // Start one pass of the track at `when`, fading in (except the very first pass,
  // which the master fade already covers) and fading out over the crossfade.
  function startPass(when, first) {
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = buffer;
    src.connect(g); g.connect(master);
    const len = loopEnd;
    const xf = Math.min(CROSSFADE, len / 4);
    g.gain.setValueAtTime(first ? 1 : 0, when);
    if (!first) g.gain.linearRampToValueAtTime(1, when + xf);
    g.gain.setValueAtTime(1, when + len - xf);
    g.gain.linearRampToValueAtTime(0, when + len);
    src.start(when, 0, len);
    voices.add(src);
    src.onended = () => voices.delete(src);
    nextStart = when + len - xf;
  }

  // Keeps queuing the next pass a little before it's needed. Uses the audio clock,
  // so while the context is suspended (music paused) nothing advances.
  function tick() {
    if (playing && buffer && ctx.currentTime > nextStart - 1.5) startPass(nextStart, false);
  }

  function fadeTo(value, seconds) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(value, t + seconds);
  }

  async function play() {
    if (playing) return;
    playing = true;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
    }
    await ctx.resume();
    if (!buffer) {
      setUI("loading");
      try { await load(); } catch {
        playing = false; setUI("off"); label.textContent = "Music unavailable";
        return;
      }
      if (!playing) return; // turned off while it was loading
      startPass(ctx.currentTime + 0.05, true);
    }
    if (!scheduler) scheduler = setInterval(tick, 500);
    fadeTo(VOLUME, 2.5);
    setUI("on");
  }

  function stop() {
    if (!playing) return;
    playing = false;
    setUI("off");
    if (!ctx) return;
    fadeTo(0, 0.8);
    // Suspend after the fade so the track picks up where it left off next time.
    setTimeout(() => { if (!playing) ctx.suspend(); }, 900);
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (playing) { stop(); remember(false); } else { play(); remember(true); }
  });

  // Pause while the tab is in the background, resume when it comes back.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) { stop(); btn.dataset.resume = "true"; }
    else if (!document.hidden && btn.dataset.resume === "true") { delete btn.dataset.resume; play(); }
  });

  setUI("off");
  btn.hidden = false;

  // Returning visitor who left music on: start on their first interaction.
  if (wasOn()) {
    label.textContent = "Music on (click anywhere)";
    const resume = (e) => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      // A press on the toggle itself is handled by its own click handler.
      if (e && btn.contains(e.target)) { setUI("off"); return; }
      if (!playing) play();
    };
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);
  }
})();
