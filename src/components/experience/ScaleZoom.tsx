"use client";

import { useEffect, useRef, useState } from "react";
import { getSource } from "@/data/sources";
import { useCanvasLoop } from "./useCanvasLoop";

type Thing = { name: string; size: number; text: string; kind: string; sources: string[] };

const LY = 9.46e15; // metres in a light-year (NASA: 9.5 trillion km)

/** Sizes are widths (diameters), from the sources listed with each one. */
const THINGS: Thing[] = [
  { name: "An atom", size: 1e-10, text: "about 0.1 nanometres wide", kind: "atom", sources: ["nise-how-small-nano"] },
  { name: "A virus", size: 1e-7, text: "about 100 nanometres", kind: "virus", sources: ["nise-how-small-nano"] },
  { name: "A red blood cell", size: 1e-5, text: "about 10 micrometres", kind: "cell", sources: ["nise-how-small-nano"] },
  { name: "A human hair", size: 1e-4, text: "about 0.1 millimetres thick", kind: "hair", sources: ["nise-how-small-nano"] },
  { name: "You", size: 1.7, text: "a typical adult is about 1.7 metres tall", kind: "you", sources: [] },
  { name: "Earth", size: 12756e3, text: "12,756 km across", kind: "earth", sources: ["nasa-earth-facts"] },
  { name: "The Sun", size: 1.4e9, text: "about 1.4 million km across", kind: "sun", sources: ["nasa-sun-facts"] },
  { name: "Earth's path around the Sun", size: 2 * 8 * 60 * 3e8, text: "we are about 8 light-minutes from the Sun", kind: "orbit", sources: ["nasa-how-big-is-space"] },
  { name: "The whole Solar System", size: 2 * 1.87 * LY, text: "light takes about 1.87 years to reach its outer edge, the Oort Cloud", kind: "oort", sources: ["nasa-how-big-is-space"] },
  { name: "The Milky Way", size: 1e5 * LY, text: "about 100,000 light-years across", kind: "galaxy", sources: ["nasa-how-big-is-space"] },
  { name: "The observable universe", size: 93e9 * LY, text: "about 93 billion light-years across", kind: "universe", sources: ["britannica-observable-universe"] },
];

const MIN = -10.6;
const MAX = 27.1;
const clampV = (v: number) => Math.min(MAX, Math.max(MIN, v));

function human(m: number) {
  if (m < 1e-6) return `${+(m * 1e9).toPrecision(2)} nanometres`;
  if (m < 1e-3) return `${+(m * 1e6).toPrecision(2)} micrometres`;
  if (m < 1) return `${+(m * 1e3).toPrecision(2)} millimetres`;
  if (m < 1e3) return `${+m.toPrecision(2)} metres`;
  if (m < 0.01 * LY) return `${(m / 1e3).toLocaleString("en-GB", { maximumSignificantDigits: 2 })} km`;
  return `${(m / LY).toLocaleString("en-GB", { maximumSignificantDigits: 2 })} light-years`;
}

const spiral = Array.from({ length: 900 }, (_, i) => {
  const arm = i % 2;
  const t = Math.random();
  const a = t * 9 + arm * Math.PI + (Math.random() - 0.5) * 0.5;
  const r = Math.pow(t, 0.7);
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.9, s: Math.random() };
});
const speckle = Array.from({ length: 700 }, () => {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random());
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: Math.random() };
});

function draw(ctx: CanvasRenderingContext2D, k: string, cx: number, cy: number, r: number, h: number) {
  ctx.save();
  switch (k) {
    case "atom": {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(200,205,215,0.35)");
      g.addColorStop(1, "rgba(200,205,215,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.fill();
      ctx.fillStyle = "#d8c7a8";
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, r * 0.04), 0, 7);
      ctx.fill();
      break;
    }
    case "virus":
      ctx.strokeStyle = "rgba(170,190,160,0.9)";
      ctx.lineWidth = Math.max(1, r * 0.05);
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(120,140,110,0.6)";
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, 0, 7);
      ctx.fill();
      break;
    case "cell": {
      const g = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
      g.addColorStop(0, "#6e2a26");
      g.addColorStop(0.7, "#9b3b33");
      g.addColorStop(1, "#7d2f29");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.fill();
      break;
    }
    case "hair":
      ctx.fillStyle = "rgba(60,45,35,0.95)";
      ctx.fillRect(cx - r, 0, r * 2, h);
      break;
    case "you":
      ctx.fillStyle = "rgba(225,215,200,0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.84, r * 0.13, 0, 7);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(cx - r * 0.17, cy - r * 0.66, r * 0.34, r * 1.66, r * 0.12);
      ctx.fill();
      break;
    case "earth": {
      const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      g.addColorStop(0, "#6f8fa8");
      g.addColorStop(1, "#1d3346");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.fill();
      break;
    }
    case "sun": {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "#f3dcae");
      g.addColorStop(1, "#c98a45");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.fill();
      break;
    }
    case "orbit":
      ctx.strokeStyle = "rgba(200,210,220,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.stroke();
      ctx.fillStyle = "#7d9bb4";
      ctx.beginPath();
      ctx.arc(cx + r * 0.7071, cy - r * 0.7071, 2.5, 0, 7);
      ctx.fill();
      break;
    case "oort":
      ctx.strokeStyle = "rgba(200,210,220,0.35)";
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.stroke();
      break;
    case "galaxy":
      for (const p of spiral) {
        ctx.fillStyle = `rgba(230,220,200,${0.25 + p.s * 0.5})`;
        ctx.fillRect(cx + p.x * r, cy + p.y * r, 1.3, 1.3);
      }
      break;
    case "universe":
      ctx.strokeStyle = "rgba(200,190,170,0.35)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.stroke();
      for (const p of speckle) {
        ctx.fillStyle = `rgba(210,200,185,${0.15 + p.s * 0.35})`;
        ctx.fillRect(cx + p.x * r, cy + p.y * r, 1, 1);
      }
      break;
  }
  ctx.restore();
}

/**
 * Zoom from an atom to the observable universe. Drag sideways, pinch, use the
 * wheel, the slider or the buttons. Every size comes from a cited source.
 */
export function ScaleZoom() {
  const [v, setV] = useState(0.6); // log10 of the width on screen, in metres
  const vRef = useRef(v);
  vRef.current = v;
  const tour = useRef<number | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; v: number } | null>(null);

  const set = (nv: number) => setV(clampV(nv));

  const ref = useCanvasLoop((ctx, w, h) => {
    ctx.fillStyle = "#0b0b0c";
    ctx.fillRect(0, 0, w, h);
    const view = Math.pow(10, vRef.current);
    const S = w; // the view value is the width of the screen
    const cx = w / 2;
    const cy = h * 0.47;
    ctx.font = "500 12px var(--font-sans, system-ui)";
    ctx.textBaseline = "middle";
    for (const t of THINGS) {
      const r = ((t.size / view) * S) / 2;
      if (r < 0.6 || r > Math.max(w, h) * 3) continue;
      const fade = Math.min(1, r / 6) * Math.min(1, (Math.max(w, h) * 3 - r) / (Math.max(w, h) * 1.5));
      ctx.globalAlpha = Math.max(0, fade);
      draw(ctx, t.kind, cx, cy, r, h);
      if (r > 14 && r < Math.min(w, h) * 0.75) {
        const lx = cx + (t.kind === "hair" ? r + 10 : r * 0.7071 + 8);
        const ly = t.kind === "hair" ? cy : cy - r * 0.7071 - 8;
        ctx.globalAlpha = Math.max(0, fade) * 0.9;
        ctx.strokeStyle = "rgba(235,228,215,0.5)";
        ctx.beginPath();
        ctx.moveTo(lx - 6, ly + 6);
        ctx.lineTo(lx, ly);
        ctx.stroke();
        ctx.fillStyle = "rgba(235,228,215,0.95)";
        ctx.fillText(t.name, lx + 4, ly);
      }
    }
    ctx.globalAlpha = 1;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const nv = clampV(vRef.current + e.deltaY * 0.004);
      if (nv === vRef.current) return; // at either end, let the page scroll on
      e.preventDefault();
      setV(nv);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);

  useEffect(() => () => cancelAnimationFrame(tour.current ?? 0), []);

  const stopTour = () => {
    if (tour.current) cancelAnimationFrame(tour.current);
    tour.current = null;
  };

  const startTour = () => {
    stopTour();
    const from = MIN;
    const start = performance.now();
    const ms = 24000;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      setV(from + (MAX - from) * e);
      tour.current = k < 1 ? requestAnimationFrame(step) : null;
    };
    tour.current = requestAnimationFrame(step);
  };

  const onDown = (e: React.PointerEvent) => {
    stopTour();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture?.(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), v: vRef.current };
    }
  };
  const onMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, next);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      set(pinch.current.v - Math.log10(d / pinch.current.d) * 3);
    } else if (pointers.current.size === 1) {
      set(vRef.current - (next.x - prev.x) * 0.02);
    }
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const view = Math.pow(10, v);
  const nearest = THINGS.reduce((best, t) => (Math.abs(Math.log10(t.size) - v) < Math.abs(Math.log10(best.size) - v) ? t : best));
  const src = nearest.sources.map((id) => getSource(id)).filter(Boolean);

  return (
    <section className="scale" aria-labelledby="scale-title" data-theme="cosmos">
      <canvas
        ref={ref}
        className="scale-canvas"
        aria-hidden="true"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
      <div className="scale-head">
        <p className="scene-eyebrow">Interlude · The size of everything</p>
        <h2 id="scale-title" className="scene-title">
          From an atom to the universe
        </h2>
        <p className="scale-hint">Drag sideways or pinch to zoom. Each step on the slider is ten times bigger.</p>
      </div>
      <div className="scale-read" aria-live="polite">
        <p className="scale-width">
          Width of the screen: about <strong>{human(view)}</strong>
        </p>
        <p className="scale-thing">
          <strong>{nearest.name}</strong>: {nearest.text}
          {src.length ? (
            <span className="scale-src">
              {" "}
              ·{" "}
              {src.map((s, i) => (
                <a key={s!.id} href={s!.url} target="_blank" rel="noopener noreferrer">
                  {i ? ", " : ""}
                  {s!.organisation.split(",")[0]}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </span>
          ) : null}
        </p>
      </div>
      <div className="scale-controls">
        <button type="button" className="hud-btn" onClick={() => (stopTour(), set(v - 1))} aria-label="Zoom in, ten times smaller">
          −
        </button>
        <label className="sr-only" htmlFor="scale-range">
          Zoom level
        </label>
        <input
          id="scale-range"
          type="range"
          min={MIN}
          max={MAX}
          step={0.05}
          value={v}
          aria-valuetext={`Screen width about ${human(view)}. Nearest: ${nearest.name}`}
          onChange={(e) => (stopTour(), set(Number(e.target.value)))}
        />
        <button type="button" className="hud-btn" onClick={() => (stopTour(), set(v + 1))} aria-label="Zoom out, ten times bigger">
          +
        </button>
        <button type="button" className="scene-action-inline" onClick={startTour}>
          Take the tour
        </button>
      </div>
    </section>
  );
}
