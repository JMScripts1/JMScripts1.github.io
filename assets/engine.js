// Petal engine: a small 2D particle simulation behind the page hero (home and commissions).
// Petals fall with drag, sway, and a gusting wind field. The cursor (or a finger)
// pushes petals away and drags a wake behind it; a click or tap releases a burst.
// Runs only while the hero is on screen and the tab is visible, and draws a single
// still frame when the visitor prefers reduced motion.
(() => {
  const canvas = document.querySelector("canvas[data-petals], .hh__canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const hud = {
    fps: document.querySelector("[data-hud=fps]"),
    count: document.querySelector("[data-hud=count]"),
    wind: document.querySelector("[data-hud=wind]"),
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const LIGHT = ["#f3b9cc", "#eda3bb", "#f7cfdc", "#e48aab", "#d97798", "#fbe1ea"];
  const DARK = ["#e68aac", "#f2a9c3", "#c9668b", "#f6c3d4", "#b5527a", "#f9d6e2"];
  let palette = darkQuery.matches ? DARK : LIGHT;

  let w = 0, h = 0, dpr = 1;
  let petals = [];
  const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false, t: 0 };
  let windBase = 0.35, windNow = 0, gust = 0, gustTarget = 0, nextGust = 0;
  let running = false, onScreen = true, last = 0, raf = 0;
  let frames = 0, fpsClock = 0;

  const rand = (a, b) => a + Math.random() * (b - a);

  function makePetal(y) {
    const z = rand(0.35, 1); // depth: far petals are smaller, slower, fainter
    return {
      x: rand(-40, w + 40),
      y: y ?? rand(-h, h),
      vx: rand(-0.2, 0.2),
      vy: rand(0.3, 0.8) * z,
      z,
      size: rand(5, 11) * (0.55 + z * 0.65),
      rot: rand(0, Math.PI * 2),
      spin: rand(-0.03, 0.03),
      flip: rand(0, Math.PI * 2),
      flipSpeed: rand(0.02, 0.05),
      sway: rand(0, Math.PI * 2),
      color: palette[(Math.random() * palette.length) | 0],
    };
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.min(170, Math.round((w * h) / 7500));
    while (petals.length < target) petals.push(makePetal());
    if (petals.length > target) petals.length = target;
  }

  function drawPetal(p) {
    // Squash on one axis as the petal tumbles, so it reads as a thin 3D flake.
    const tumble = Math.cos(p.flip);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, 0.35 + 0.65 * Math.abs(tumble));
    ctx.globalAlpha = 0.35 + p.z * 0.55;
    ctx.fillStyle = p.color;
    const s = p.size;
    // Cherry petal outline with the small notch at its tip.
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.72);
    ctx.quadraticCurveTo(s * 0.25, -s * 1.05, s * 0.55, -s * 0.85);
    ctx.bezierCurveTo(s * 0.95, -s * 0.4, s * 0.6, s * 0.6, 0, s);
    ctx.bezierCurveTo(-s * 0.6, s * 0.6, -s * 0.95, -s * 0.4, -s * 0.55, -s * 0.85);
    ctx.quadraticCurveTo(-s * 0.25, -s * 1.05, 0, -s * 0.72);
    ctx.fill();
    ctx.restore();
  }

  function step(dt, now) {
    // Gusts: every few seconds the wind target changes, and the wind eases toward it.
    if (now > nextGust) {
      gustTarget = rand(-0.25, 1.1);
      nextGust = now + rand(2500, 6000);
    }
    gust += (gustTarget - gust) * 0.008 * dt;
    windNow = windBase + gust;

    const pressure = pointer.active ? 1 : 0;
    const R = 130, R2 = R * R;

    for (const p of petals) {
      p.sway += 0.02 * dt;
      p.flip += p.flipSpeed * dt;
      p.rot += p.spin * dt;

      // wind and gravity, scaled by depth for parallax
      p.vx += (windNow * 0.02 + Math.sin(p.sway) * 0.012) * p.z * dt;
      p.vy += 0.006 * p.z * dt;

      if (pressure) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * 0.9;
          p.vx += (dx / d) * f * dt + pointer.vx * 0.04 * f;
          p.vy += (dy / d) * f * dt + pointer.vy * 0.04 * f;
          p.spin += (Math.random() - 0.5) * 0.01 * f;
        }
      }

      // drag keeps terminal velocity low so petals float rather than fall
      const drag = Math.pow(0.965, dt);
      p.vx *= drag; p.vy *= drag;
      p.spin *= Math.pow(0.995, dt);
      p.x += p.vx * dt; p.y += p.vy * dt;

      if (p.y > h + 30) Object.assign(p, makePetal(-20));
      if (p.y < -h) p.y = -20;
      if (p.x > w + 40) p.x = -40;
      if (p.x < -40) p.x = w + 40;
    }

    pointer.vx *= 0.85; pointer.vy *= 0.85;
  }

  function render() {
    ctx.clearRect(0, 0, w, h);
    // far petals first so near ones overlap them
    for (const p of petals) if (p.z < 0.65) drawPetal(p);
    for (const p of petals) if (p.z >= 0.65) drawPetal(p);
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 16.667, 3); // in 60fps frames, clamped after tab switches
    last = now;
    step(dt, now);
    render();

    frames++;
    if (now - fpsClock > 500) {
      const fps = Math.round((frames * 1000) / (now - fpsClock));
      if (hud.fps) hud.fps.textContent = fps;
      if (hud.count) hud.count.textContent = petals.length;
      if (hud.wind) hud.wind.textContent = (windNow >= 0 ? "+" : "") + windNow.toFixed(2);
      frames = 0; fpsClock = now;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce.matches || !onScreen || document.hidden) return;
    running = true;
    last = fpsClock = performance.now();
    frames = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function stillFrame() {
    // Reduced motion: settle petals in place once and leave the scene static.
    for (const p of petals) p.y = rand(0, h);
    render();
    if (hud.fps) hud.fps.textContent = "0";
    if (hud.count) hud.count.textContent = petals.length;
    if (hud.wind) hud.wind.textContent = "0.00";
  }

  // Pointer input, relative to the hero. Listeners are passive and only record state.
  function setPointer(e) {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (pointer.active) { pointer.vx = x - pointer.x; pointer.vy = y - pointer.y; }
    pointer.x = x; pointer.y = y; pointer.active = true;
  }
  hero.addEventListener("pointermove", setPointer, { passive: true });
  hero.addEventListener("pointerdown", (e) => {
    setPointer(e);
    if (reduce.matches) return;
    // Burst: kick nearby petals outward and add a few fresh ones at the click point.
    for (const p of petals) {
      const dx = p.x - pointer.x, dy = p.y - pointer.y;
      const d = Math.hypot(dx, dy);
      if (d < 220 && d > 0.01) {
        const f = (1 - d / 220) * 7;
        p.vx += (dx / d) * f; p.vy += (dy / d) * f - 1.5;
        p.spin += rand(-0.15, 0.15);
      }
    }
    for (let i = 0; i < 6; i++) {
      const p = makePetal(pointer.y);
      p.x = pointer.x; p.vx = rand(-4, 4); p.vy = rand(-5, -1);
      petals[(Math.random() * petals.length) | 0] = p;
    }
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { pointer.active = false; pointer.x = pointer.y = -9999; }, { passive: true });

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

  darkQuery.addEventListener("change", () => {
    palette = darkQuery.matches ? DARK : LIGHT;
    for (const p of petals) p.color = palette[(Math.random() * palette.length) | 0];
    if (!running) render();
  });
  reduce.addEventListener("change", () => (reduce.matches ? (stop(), stillFrame()) : start()));

  resize();
  if (reduce.matches) stillFrame(); else start();
})();
