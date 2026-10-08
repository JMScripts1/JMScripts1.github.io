// Background music toggle for the commissions page.
// Browsers only allow sound after the visitor interacts with the page, so music
// starts when they press the toggle. The choice is remembered: if they left it on,
// it resumes on their first click or key press on the next visit.
//
// By default the music is generated live with the Web Audio API: a soft pad that
// drifts between chords, plus sparse koto-like notes from a Japanese pentatonic
// scale. No audio file to download, and no licensing to worry about.
//
// To use your own track instead, put the file in assets/audio/ and set MUSIC_FILE,
// e.g. "assets/audio/ambience.mp3". Only use music you made or have the rights to.
(() => {
  const MUSIC_FILE = "";
  const VOLUME = 0.12; // overall loudness, 0 to 1. Kept very low on purpose.
  const STORE_KEY = "jm-music-on";

  const btn = document.querySelector(".music");
  if (!btn || !(window.AudioContext || window.webkitAudioContext)) {
    if (btn) btn.hidden = true;
    return;
  }
  const label = btn.querySelector(".music__label");
  const iconUse = btn.querySelector(".music__icon use");

  let ctx, master, playing = false, timers = [], fileEl = null;

  const remember = (on) => { try { localStorage.setItem(STORE_KEY, on ? "1" : "0"); } catch {} };
  const wasOn = () => { try { return localStorage.getItem(STORE_KEY) === "1"; } catch { return false; } };

  function setUI(on) {
    btn.setAttribute("aria-pressed", String(on));
    btn.dataset.on = on ? "true" : "false";
    label.textContent = on ? "Music on" : "Music off";
    iconUse.setAttribute("href", `assets/icons.svg#i-${on ? "music-notes" : "speaker-simple-slash"}`);
  }

  function setup() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;

    // A simple feedback delay with a lowpass in the loop stands in for reverb.
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.42;
    const fb = ctx.createGain(); fb.gain.value = 0.38;
    const damp = ctx.createBiquadFilter(); damp.type = "lowpass"; damp.frequency.value = 2200;
    delay.connect(damp); damp.connect(fb); fb.connect(delay);
    const wet = ctx.createGain(); wet.gain.value = 0.5;
    delay.connect(wet);

    const bus = ctx.createGain();
    bus.connect(master); bus.connect(delay); wet.connect(master);
    master.connect(ctx.destination);
    return bus;
  }

  // ---- Generative ambience -------------------------------------------------
  // D "yo" pentatonic (D E G A B) keeps every note consonant with the pad.
  const SCALE = [293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99];
  const CHORDS = [
    [146.83, 220.0, 293.66, 369.99], // D
    [123.47, 185.0, 246.94, 293.66], // Bm
    [98.0, 146.83, 196.0, 246.94],   // G
    [110.0, 164.81, 220.0, 277.18],  // A
  ];

  function padChord(bus, freqs, at, dur) {
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.Q.value = 0.3;
    g.connect(lp); lp.connect(bus);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(0.16, at + dur * 0.35);
    g.gain.linearRampToValueAtTime(0, at + dur);
    for (const f of freqs) {
      for (const detune of [-6, 6]) {
        const o = ctx.createOscillator();
        o.type = "triangle"; o.frequency.value = f; o.detune.value = detune;
        o.connect(g); o.start(at); o.stop(at + dur + 0.1);
      }
    }
  }

  function pluck(bus, freq, at) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq;
    o2.type = "sine"; o2.frequency.value = freq * 2.01; // faint overtone for a koto-ish edge
    const g2 = ctx.createGain(); g2.gain.value = 0.18;
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(bus);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(0.22, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, at + 2.8);
    o.start(at); o2.start(at); o.stop(at + 3); o2.stop(at + 3);
  }

  function startGenerative(bus) {
    const CHORD_LEN = 8; // seconds per chord
    let chordIndex = 0, nextChord = ctx.currentTime + 0.05;
    let nextNote = ctx.currentTime + 1.2;
    // Look-ahead scheduler: every 250ms, queue anything due in the next second.
    const tick = () => {
      if (!playing) return;
      const ahead = ctx.currentTime + 1;
      while (nextChord < ahead) {
        padChord(bus, CHORDS[chordIndex % CHORDS.length], nextChord, CHORD_LEN + 2);
        chordIndex++; nextChord += CHORD_LEN;
      }
      while (nextNote < ahead) {
        if (Math.random() < 0.7) pluck(bus, SCALE[(Math.random() * SCALE.length) | 0], nextNote);
        nextNote += [0.9, 1.4, 1.8, 2.6, 3.2][(Math.random() * 5) | 0];
      }
      timers.push(setTimeout(tick, 250));
    };
    tick();
  }

  // ---- Play / stop ---------------------------------------------------------
  function fadeTo(value, seconds) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(value, t + seconds);
  }

  async function play() {
    if (playing) return;
    if (!ctx) {
      const bus = setup();
      if (MUSIC_FILE) {
        fileEl = new Audio(MUSIC_FILE);
        fileEl.loop = true;
        ctx.createMediaElementSource(fileEl).connect(bus);
      }
      btn._bus = bus;
    }
    await ctx.resume();
    playing = true;
    if (fileEl) fileEl.play().catch(() => {});
    else startGenerative(btn._bus);
    fadeTo(VOLUME, 2.5);
    setUI(true);
  }

  function stop() {
    if (!playing) return;
    playing = false;
    timers.forEach(clearTimeout); timers = [];
    fadeTo(0, 0.8);
    setTimeout(() => { if (!playing) { if (fileEl) fileEl.pause(); ctx.suspend(); } }, 900);
    setUI(false);
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (playing) { stop(); remember(false); } else { play(); remember(true); }
  });

  // Pause while the tab is in the background, resume when it comes back.
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden && playing) { stop(); btn.dataset.resume = "true"; }
    else if (!document.hidden && btn.dataset.resume === "true") { delete btn.dataset.resume; play(); }
  });

  setUI(false);
  btn.hidden = false;

  // Returning visitor who left music on: start on their first interaction.
  if (wasOn()) {
    btn.dataset.pending = "true";
    label.textContent = "Music on (click anywhere)";
    const resume = (e) => {
      delete btn.dataset.pending;
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      // A press on the toggle itself is handled by its own click handler.
      if (e && btn.contains(e.target)) { setUI(false); return; }
      if (!playing) play();
    };
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
  }
})();
