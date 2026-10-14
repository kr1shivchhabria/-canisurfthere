// oceancanvas.jsx
// a flowing ocean drawn by hand on a canvas (no library needed).
//
// what you see:
//   - layers of swells (crests) that travel downward, toward the beach
//   - white foam on every crest, plus a lacy dashed line behind it
//   - little glints of light on the water
//   - (if shore is on) a wavy shoreline where water slides up and down the wet sand
//
// scrolling makes the waves rush downward faster, like the sea is pouring toward the sand.

import { useEffect, useRef } from 'react';

// color sets. "stops" are the water gradient from top to bottom.
// "crest" is the light blue of the wave faces and "foam" is the white of the foam (as r,g,b)
const palettes = {
  // landing page: deep blue far away, bright turquoise near the shore
  shore: { stops: [[0, '#052d52'], [0.35, '#0a5b95'], [0.7, '#1f93d3'], [1, '#69cdf0']], foam: '255,255,255', crest: '170,232,255' },
  // darker, calmer water for the story section
  deep: { stops: [[0, '#052a4a'], [0.5, '#06365c'], [1, '#0b5a94']], foam: '190,230,255', crest: '80,165,225' },
  // the field guide section: bright shallow water at the top (next to the sand), deeper at the bottom
  lagoon: { stops: [[0, '#7fd3f2'], [0.18, '#3fa6e4'], [0.55, '#1a82c6'], [1, '#0a5b95']], foam: '255,255,255', crest: '190,236,255' },
  // the checker page background: a bright sky blue sea
  sky: { stops: [[0, '#0b5a94'], [0.45, '#2790d1'], [1, '#6cc6ef']], foam: '255,255,255', crest: '170,232,255' },
};

const STEP = 12; // how many pixels apart we sample the wave line (smaller = smoother but slower)
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function OceanCanvas({ palette = 'sky', shore = false, shoreAt = 0.736, speed = 1, crests = 9 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const colors = palettes[palette];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- the state that changes every frame ----
    let w = 0; // canvas width in css pixels
    let h = 0; // canvas height in css pixels
    let time = reduceMotion ? 4 : 0; // seconds, drives the side-to-side wobble
    let travel = 0; // how far the crests have moved toward the shore
    let boost = 0; // extra speed that comes from scrolling (fades away on its own)
    let lastScroll = window.scrollY;
    let lastFrame = performance.now();
    let frameId = 0;
    let visible = true;

    // little glints of light. x and y are between 0 and 1
    const sparkles = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      phase: Math.random() * 6.28,
      size: 0.8 + Math.random() * 1.8,
      rate: 0.6 + Math.random() * 1.4,
    }));

    // ---------- make the canvas the right size (and sharp on retina screens) ----------
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    // ---------- one frame ----------
    function draw() {
      if (!w || !h) return;
      // where the open water ends. with a shore, the water stops "shoreat" of the way down (0.5 = halfway)
      const waterEnd = shore ? h * shoreAt : h;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);

      // 1. the sea itself: a plain gradient
      const sea = ctx.createLinearGradient(0, 0, 0, waterEnd);
      colors.stops.forEach(([at, color]) => sea.addColorStop(at, color));
      ctx.fillStyle = sea;
      ctx.fillRect(0, 0, w, h);

      // 2. the crests. "p" is how far along each crest is (0 = far away, 1 = at the beach)
      const order = [];
      for (let k = 0; k < crests; k++) {
        let p = (k + travel) / crests;
        p -= Math.floor(p); // wraps around so a crest that reaches the beach starts again far away
        order.push({ k, p });
      }
      order.sort((a, b) => a.p - b.p); // far crests first, so near crests draw on top
      order.forEach(({ k, p }) => drawCrest(k, p, waterEnd));

      // 3. glints and 4. the shoreline
      drawSparkles(waterEnd);
      if (shore) drawShore(waterEnd);
    }

    // ---------- one wave crest ----------
    function drawCrest(k, p, waterEnd) {
      const baseY = p * waterEnd; // waves near the beach are lower on the screen
      const amp = 8 + 30 * p; // waves get taller as they near the shore
      const thick = 26 + 100 * p; // and their lit face gets wider
      // fade in far away, fade out right at the end of their trip
      const fade = Math.min(1, p / 0.1) * Math.min(1, (1 - p) / 0.05);
      const phase = k * 1.9; // each crest wiggles differently

      // work out the wavy line once, then reuse it for the fill and the foam
      const xs = [];
      const ys = [];
      for (let x = -STEP; x <= w + STEP; x += STEP) {
        const u = x / w; // 0 to 1 across the screen
        // three sine waves added together make the line look natural instead of perfectly regular
        const y =
          baseY +
          Math.sin(u * 5.2 + time * 0.45 + phase) * amp +
          Math.sin(u * 11 - time * 0.8 + phase * 2.1) * amp * 0.4 +
          Math.sin(u * 2.4 + time * 0.2 + k) * amp * 1.1;
        xs.push(x);
        ys.push(y);
      }
      const traceTop = (offset = 0) => {
        ctx.beginPath();
        xs.forEach((x, i) => (i ? ctx.lineTo(x, ys[i] + offset) : ctx.moveTo(x, ys[i] + offset)));
      };

      // the lit face of the wave: light blue at the crest, fading to nothing
      traceTop();
      for (let i = xs.length - 1; i >= 0; i--) ctx.lineTo(xs[i], ys[i] + thick);
      ctx.closePath();
      const face = ctx.createLinearGradient(0, baseY - amp * 2, 0, baseY + thick + amp * 2);
      face.addColorStop(0, `rgba(${colors.crest},${0.42 * fade})`);
      face.addColorStop(0.4, `rgba(${colors.crest},${0.14 * fade})`);
      face.addColorStop(1, `rgba(${colors.crest},0)`);
      ctx.fillStyle = face;
      ctx.fill();

      // white foam along the crest (thicker and brighter near the beach)
      traceTop();
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.2 + 3.5 * p;
      ctx.strokeStyle = `rgba(${colors.foam},${(0.18 + 0.55 * p) * fade})`;
      ctx.stroke();

      // a lacy dashed line just behind the foam that slowly slides along
      traceTop(5 + 10 * p);
      ctx.setLineDash([16, 14]);
      ctx.lineDashOffset = -time * 28;
      ctx.lineWidth = 1 + 1.5 * p;
      ctx.strokeStyle = `rgba(${colors.foam},${0.3 * fade})`;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ---------- glints of light on the water ----------
    function drawSparkles(waterEnd) {
      sparkles.forEach((s) => {
        let y = s.y + travel * 0.03; // they drift toward the shore too
        y -= Math.floor(y);
        const py = y * waterEnd;
        // sin makes it fade in and out, power of 4 makes the glint short and sharp
        const glow = Math.pow((Math.sin(time * s.rate + s.phase) + 1) / 2, 4);
        if (glow < 0.05) return;
        const px = s.x * w;
        ctx.fillStyle = `rgba(255,255,255,${glow * 0.85})`;
        // a little plus-shaped sparkle
        ctx.fillRect(px - s.size * 3, py - s.size * 0.5, s.size * 6, s.size);
        ctx.fillRect(px - s.size * 0.5, py - s.size * 3, s.size, s.size * 6);
      });
    }

    // ---------- the shoreline: foam, wet sand and water sliding up the beach ----------
    function drawShore(waterEnd) {
      const surge = clamp(boost * 8, -15, 40); // scrolling pushes the shoreline a little further down
      const push = (Math.sin(time * 0.55) + 1) / 2; // 0 to 1: water running up the sand, then back

      // the shoreline (edge) and the tip of the thin sheet of water that runs up the sand (tip)
      const xs = [];
      const edge = [];
      const tip = [];
      for (let x = -STEP; x <= w + STEP; x += STEP) {
        const u = x / w;
        const e =
          waterEnd + surge +
          Math.sin(u * 7 + time * 0.7) * 16 +
          Math.sin(u * 13 - time * 1.1) * 7 +
          Math.sin(u * 3 + time * 0.35) * 14;
        xs.push(x);
        edge.push(e);
        tip.push(e + 16 + push * 38 + Math.sin(u * 9 - time * 0.9) * 8);
      }
      // draws a line through a list of y values (plus an optional offset)
      const trace = (list, offset = 0) => {
        ctx.beginPath();
        xs.forEach((x, i) => (i ? ctx.lineTo(x, list[i] + offset) : ctx.moveTo(x, list[i] + offset)));
      };
      // draws a shape between two lines
      const band = (top, topOffset, bottom, bottomOffset) => {
        trace(top, topOffset);
        for (let i = xs.length - 1; i >= 0; i--) ctx.lineTo(xs[i], bottom[i] + bottomOffset);
        ctx.closePath();
      };

      // 1. erase everything below the shoreline, so the sand behind the canvas shows through
      ctx.globalCompositeOperation = 'destination-out';
      trace(edge);
      ctx.lineTo(w + STEP, h + 10);
      ctx.lineTo(-STEP, h + 10);
      ctx.closePath();
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // 2. wet sand: a darker, damp strip just below the water
      band(edge, 0, edge, 150);
      const wet = ctx.createLinearGradient(0, waterEnd - 30, 0, waterEnd + 190);
      wet.addColorStop(0, 'rgba(140,100,52,0.6)');
      wet.addColorStop(1, 'rgba(140,100,52,0)');
      ctx.fillStyle = wet;
      ctx.fill();

      // 3. the thin sheet of water running up the sand (see-through, so you can see the sand under it)
      band(edge, -6, tip, 0);
      const sheet = ctx.createLinearGradient(0, waterEnd - 20, 0, waterEnd + 90);
      sheet.addColorStop(0, 'rgba(105,205,240,0.42)');
      sheet.addColorStop(1, 'rgba(240,252,255,0.34)');
      ctx.fillStyle = sheet;
      ctx.fill();
      // bright line where the sheet ends
      trace(tip);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + 0.6 * push})`;
      ctx.stroke();

      // 4. the main foam line at the shoreline (a soft wide glow, then a crisp line on top)
      trace(edge);
      ctx.lineWidth = 18;
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.stroke();
      ctx.shadowColor = 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 7;
      ctx.strokeStyle = 'rgba(255,255,255,0.92)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. lacy foam bubbles just below the line
      trace(edge, 11);
      ctx.setLineDash([3, 13]);
      ctx.lineDashOffset = -time * 20;
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ---------- the animation loop ----------
    function frame(now) {
      frameId = requestAnimationFrame(frame);
      if (!visible) return; // do nothing while the canvas is off screen

      const dt = Math.min(0.05, (now - lastFrame) / 1000); // seconds since the last frame
      lastFrame = now;

      // scrolling adds speed. scrolling down = waves rush toward the shore, scrolling up = they pull back
      const scrollDelta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      boost = clamp((boost + scrollDelta * 0.005) * 0.92, -4, 6);

      time += dt * speed;
      travel += (0.5 * speed + boost) * dt; // 0.5 is the calm everyday speed
      draw();
    }

    // ---------- start everything ----------
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // pause when the canvas is not on screen (saves battery)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastFrame = performance.now();
      lastScroll = window.scrollY;
    });
    visibilityObserver.observe(canvas);

    // people who asked for less motion just get one still picture
    if (!reduceMotion) frameId = requestAnimationFrame(frame);

    // clean up when the component goes away
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [palette, shore, shoreAt, speed, crests]);

  return <canvas ref={canvasRef} className="ocean-canvas" aria-hidden="true" />;
}
