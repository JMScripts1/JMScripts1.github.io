// Night sky engine: a small 2D simulation behind the page hero.
// A field of twinkling stars sits at three depths and drifts slightly with the
// cursor for parallax. Every few seconds a shooting star streaks across with a
// fading tail; a click or tap launches a small shower from that point.
// Runs only while the hero is on screen and the tab is visible, and draws a single
// still frame (stars only, no meteors) when the visitor prefers reduced motion.
(() => {
  const canvas = document.querySelector("canvas[data-sky], .hh__canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const hud = {
    fps: document.querySelector("[data-hud=fps]"),
    stars: document.querySelector("[data-hud=stars]"),
    meteors: document.querySelector("[data-hud=meteors]"),
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  let w = 0, h = 0, dpr = 1;
  let stars = [];
  let meteors = [];
  let meteorTotal = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }; // parallax offset, eased toward target
  let running = false, onScreen = true, last = 0, raf = 0, nextMeteor = 0;
  let frames = 0, fpsClock = 0;

  const rand = (a, b) => a + Math.random() * (b - a);

  function makeStar() {
    const z = Math.random() < 0.7 ? rand(0.2, 0.5) : rand(0.5, 1); // most stars are far and faint
    return {
      x: rand(0, w), y: rand(0, h), z,
      r: 0.4 + z * 1.2,
      base: 0.25 + z * 0.6,
      tw: rand(0, Math.PI * 2),
      twSpeed: rand(0.01, 0.04),
      sparkle: z > 0.85 && Math.random() < 0.35, // a few bright ones get a four-point glint
    };
  }

  // A shooting star: a bright head moving fast on a shallow diagonal, leaving a tail.
  function makeMeteor(x, y, angle, speed) {
    meteorTotal++;
    return {
      x: x ?? rand(w * 0.1, w * 1.05),
      y: y ?? rand(-h * 0.1, h * 0.45),
      a: angle ?? rand(Math.PI * 0.72, Math.PI * 0.86), // heading down and to the left
      v: speed ?? rand(9, 15),
      len: rand(110, 220),
      life: 0,
      max: rand(55, 85),
    };
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.min(320, Math.round((w * h) / 3600));
    stars = Array.from({ length: target }, makeStar);
  }

  function drawStar(s) {
    const a = Math.max(0, Math.min(1, s.base + Math.sin(s.tw) * 0.3 * s.z));
    const x = s.x + pointer.x * s.z * 14, y = s.y + pointer.y * s.z * 10;
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
    if (s.sparkle) {
      const l = s.r * 4.5 * (0.7 + 0.3 * Math.sin(s.tw));
      ctx.globalAlpha = a * 0.6;
      ctx.fillRect(x - l, y - 0.5, l * 2, 1);
      ctx.fillRect(x - 0.5, y - l, 1, l * 2);
    }
  }

  function drawMeteor(m) {
    // Fade in quickly, then out over its life.
    const t = m.life / m.max;
    const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
    const dx = Math.cos(m.a), dy = Math.sin(m.a);
    const tx = m.x - dx * m.len, ty = m.y - dy * m.len;
    const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
    g.addColorStop(0, `rgba(250,250,250,${0.95 * fade})`);
    g.addColorStop(0.2, `rgba(220,220,225,${0.45 * fade})`);
    g.addColorStop(1, "rgba(200,200,210,0)");
    ctx.globalAlpha = 1;
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    // head glow
    const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 6);
    hg.addColorStop(0, `rgba(255,255,255,${fade})`);
    hg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4f4f5";
  }

  function step(dt, now) {
    pointer.x += (pointer.tx - pointer.x) * 0.04 * dt;
    pointer.y += (pointer.ty - pointer.y) * 0.04 * dt;
    for (const s of stars) s.tw += s.twSpeed * dt;

    if (now > nextMeteor) {
      meteors.push(makeMeteor());
      nextMeteor = now + rand(1400, 4200);
    }
    for (const m of meteors) {
      m.x += Math.cos(m.a) * m.v * dt;
      m.y += Math.sin(m.a) * m.v * dt;
      m.life += dt;
    }
    meteors = meteors.filter((m) => m.life < m.max);
  }

  function render() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f4f4f5";
    for (const s of stars) drawStar(s);
    for (const m of meteors) drawMeteor(m);
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 16.667, 3); // in 60fps frames, clamped after tab switches
    last = now;
    step(dt, now);
    render();

    frames++;
    if (now - fpsClock > 500) {
      if (hud.fps) hud.fps.textContent = Math.round((frames * 1000) / (now - fpsClock));
      if (hud.stars) hud.stars.textContent = stars.length;
      if (hud.meteors) hud.meteors.textContent = meteorTotal;
      frames = 0; fpsClock = now;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce.matches || !onScreen || document.hidden) return;
    running = true;
    last = fpsClock = performance.now();
    nextMeteor = last + 600;
    frames = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function stillFrame() {
    meteors = [];
    render();
    if (hud.fps) hud.fps.textContent = "0";
    if (hud.stars) hud.stars.textContent = stars.length;
    if (hud.meteors) hud.meteors.textContent = "0";
  }

  // Pointer input, relative to the hero. Listeners are passive and only record state.
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * -2;
    pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * -2;
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { pointer.tx = pointer.ty = 0; }, { passive: true });
  hero.addEventListener("pointerdown", (e) => {
    if (reduce.matches) return;
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    // A small shower fanning out from the click point.
    for (let i = 0; i < 5; i++) {
      const m = makeMeteor(x + rand(-20, 20), y + rand(-20, 20), rand(Math.PI * 0.65, Math.PI * 0.9), rand(8, 14));
      m.len = rand(70, 150);
      meteors.push(m);
    }
  }, { passive: true });

  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    onScreen ? start() : stop();
  });
  io.observe(hero);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); if (!running) render(); }, 120);
  });
  reduce.addEventListener("change", () => (reduce.matches ? (stop(), stillFrame()) : start()));

  resize();
  if (reduce.matches) stillFrame(); else start();
})();
