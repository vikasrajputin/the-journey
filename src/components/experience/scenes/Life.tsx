"use client";

import { useRef } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, clamp, rnd, useCanvasLoop } from "../useCanvasLoop";
import { usePointer } from "../usePointer";

type Cell = { x: number; y: number; vx: number; vy: number; r: number; ph: number; born: number };
type Bubble = { x: number; y: number; r: number; v: number; o2: boolean };

export function LifeScene({ s }: { s: SceneState }) {
  const { sfx } = useExperience();
  const cells = useRef<Cell[]>([]);
  const bubbles = useRef<Bubble[]>([]);
  const clock = useRef(0);
  const nextAuto = useRef(3);
  const counter = useRef<HTMLSpanElement>(null);
  const pointer = usePointer();
  const vent = useRef<HTMLDivElement>(null);
  const strom = useRef<HTMLDivElement>(null);
  const tint = useRef<HTMLDivElement>(null);

  useScrub(s.progress, s.active, (p) => {
    if (vent.current) vent.current.style.opacity = String(1 - band(p, 0.46, 0.52));
    if (strom.current) strom.current.style.opacity = String(band(p, 0.46, 0.52));
    if (tint.current) tint.current.style.opacity = String(0.55 - band(p, 0.2, 0.3) * 0.15 + band(p, 0.72, 0.85) * 0.1);
  });

  const divide = (c: Cell, t: number) => {
    if (cells.current.length > 140) return;
    const a = rnd(0, Math.PI * 2);
    const n: Cell = { ...c, ph: rnd(0, 6), born: t, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40 };
    c.vx = -Math.cos(a) * 40;
    c.vy = -Math.sin(a) * 40;
    c.born = t;
    cells.current.push(n);
    sfx("divide");
  };

  const canvas = useCanvasLoop((ctx, w, h, t, dt) => {
    clock.current = t;
    const p = s.progress.current ?? 0;
    const unit = Math.min(w, h);
    if (!cells.current.length) {
      cells.current = Array.from({ length: 12 }, () => ({ x: rnd(0.15, 0.85) * w, y: rnd(0.25, 0.7) * h, vx: 0, vy: 0, r: unit * rnd(0.035, 0.055), ph: rnd(0, 6), born: -10 }));
    }
    ctx.clearRect(0, 0, w, h);
    const oxygen = band(p, 0.72, 0.85);

    // Bubbles rising, and later bright oxygen bubbles from the microbes
    if (bubbles.current.length < (w < 700 ? 50 : 90) && Math.random() < 0.5) {
      const o2 = oxygen > 0 && Math.random() < oxygen;
      bubbles.current.push({ x: rnd(0, w), y: h + 10, r: rnd(1, o2 ? 4 : 3), v: rnd(20, 70), o2 });
    }
    for (const b of bubbles.current) {
      b.y -= b.v * dt;
      b.x += Math.sin(t * 2 + b.y * 0.02) * 0.3;
      ctx.strokeStyle = b.o2 ? "rgba(190,255,200,0.7)" : "rgba(200,230,255,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    bubbles.current = bubbles.current.filter((b) => b.y > -10);

    // Cells drift, gently drawn to the visitor's finger, and divide now and then
    if (s.active && t > nextAuto.current && cells.current.length < 40 && p > 0.1) {
      nextAuto.current = t + rnd(2.5, 5);
      divide(cells.current[Math.floor(Math.random() * cells.current.length)], t);
    }
    const pr = pointer.current;
    for (const c of cells.current) {
      if (pr.inside) {
        const dx = pr.x - c.x;
        const dy = pr.y - c.y;
        const d = Math.hypot(dx, dy) + 1;
        if (d < unit * 0.5) {
          c.vx += (dx / d) * 18 * dt;
          c.vy += (dy / d) * 18 * dt;
        }
      }
      c.vx += Math.sin(t * 0.7 + c.ph) * 4 * dt;
      c.vy += Math.cos(t * 0.5 + c.ph) * 4 * dt;
      c.vx *= 0.98;
      c.vy *= 0.98;
      c.x = clamp(c.x + c.vx * dt, c.r, w - c.r);
      c.y = clamp(c.y + c.vy * dt, c.r, h - c.r);
      const grow = clamp((t - c.born) / 0.8);
      const wob = 1 + Math.sin(t * 2 + c.ph) * 0.05;
      const r = c.r * (0.6 + 0.4 * grow) * wob;
      const g = ctx.createRadialGradient(c.x - r * 0.3, c.y - r * 0.3, r * 0.1, c.x, c.y, r);
      const green = oxygen;
      g.addColorStop(0, `rgba(${180 - 60 * green},255,${230 - 60 * green},0.35)`);
      g.addColorStop(1, `rgba(${80 - 40 * green},${200},${200 - 80 * green},0.12)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, r * 1.08, r * 0.94, t * 0.3 + c.ph, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(190,255,240,0.55)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = "rgba(220,255,250,0.5)";
      ctx.beginPath();
      ctx.arc(c.x + Math.sin(t + c.ph) * r * 0.2, c.y + Math.cos(t + c.ph) * r * 0.2, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }
    if (counter.current) counter.current.textContent = String(cells.current.length);
  });

  const onTap = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    let best: Cell | undefined;
    let bd = 140;
    for (const c of cells.current) {
      const d = Math.hypot(c.x - x, c.y - y);
      if (d < bd) {
        bd = d;
        best = c;
      }
    }
    if (best) divide(best, clock.current);
    else {
      const unit = Math.min(r.width, r.height);
      cells.current.push({ x, y, vx: 0, vy: 0, r: unit * rnd(0.035, 0.055), ph: rnd(0, 6), born: clock.current });
      sfx("divide");
    }
  };

  return (
    <>
      <MediaImage ref={vent} id="black-smoker" className="scene-layer" kenburns />
      <MediaImage ref={strom} id="stromatolites" className="scene-layer" style={{ opacity: 0 }} kenburns />
      <div ref={tint} className="scene-layer tint-deep" aria-hidden="true" />
      <canvas ref={canvas} className="scene-canvas" onPointerDown={onTap} {...pointer.handlers} aria-hidden="true" />
      {s.beat >= 1 ? (
        <p className="scene-counter" aria-live="off">
          Living cells: <span ref={counter}>12</span>
        </p>
      ) : null}
    </>
  );
}
