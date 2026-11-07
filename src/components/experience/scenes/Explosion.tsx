"use client";

import { useRef } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, clamp, rnd, useCanvasLoop } from "../useCanvasLoop";
import { usePointer } from "../usePointer";

type Crawler = { x: number; dir: number; sp: number; sz: number; ph: number; flee: number };
type Jelly = { x: number; y: number; sz: number; ph: number; hue: number };
type Swimmer = { x: number; y: number; dir: number; sz: number; ph: number; boost: number };

function drawTrilobite(ctx: CanvasRenderingContext2D, x: number, y: number, sz: number, dir: number, t: number, lit: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  const L = sz;
  const W = sz * 0.6;
  ctx.fillStyle = `rgba(${120 + lit * 90},${95 + lit * 70},${70 + lit * 40},0.95)`;
  ctx.beginPath();
  ctx.ellipse(0, 0, L / 2, W / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(40,25,15,0.6)`;
  ctx.lineWidth = 1;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * L * 0.1, -W / 2 + 2);
    ctx.lineTo(i * L * 0.1, W / 2 - 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-L / 2, 0);
  ctx.lineTo(L / 2, 0);
  ctx.stroke();
  ctx.fillStyle = `rgba(${150 + lit * 90},${120 + lit * 70},${90 + lit * 40},1)`;
  ctx.beginPath();
  ctx.ellipse(L * 0.38, 0, L * 0.16, W * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  // legs
  ctx.strokeStyle = `rgba(90,70,50,0.8)`;
  for (let i = -3; i <= 3; i++) {
    const k = Math.sin(t * 12 + i) * 2;
    ctx.beginPath();
    ctx.moveTo(i * L * 0.1, W / 2 - 1);
    ctx.lineTo(i * L * 0.1 + k, W / 2 + 3);
    ctx.stroke();
  }
  ctx.restore();
}

function drawJelly(ctx: CanvasRenderingContext2D, j: Jelly, t: number, lit: number) {
  const pulse = 1 + Math.sin(t * 2 + j.ph) * 0.12;
  const r = j.sz * pulse;
  ctx.save();
  ctx.translate(j.x, j.y);
  const g = ctx.createRadialGradient(0, -r * 0.2, 1, 0, 0, r);
  g.addColorStop(0, `hsla(${j.hue},90%,85%,${0.25 + lit * 0.5})`);
  g.addColorStop(1, `hsla(${j.hue},90%,60%,0.05)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.7, r, 0, 0, Math.PI * 2);
  ctx.fill();
  // comb rows that shimmer like a rainbow when lit
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.strokeStyle = `hsla(${(t * 120 + i * 60) % 360},100%,70%,${0.15 + lit * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.35, -r * 0.8);
    ctx.quadraticCurveTo(Math.cos(a) * r * 0.75, 0, Math.cos(a) * r * 0.35, r * 0.8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSwimmer(ctx: CanvasRenderingContext2D, sw: Swimmer, t: number, lit: number) {
  ctx.save();
  ctx.translate(sw.x, sw.y);
  ctx.scale(sw.dir, 1);
  const L = sw.sz;
  const segs = 11;
  for (let i = 0; i < segs; i++) {
    const x = L * 0.45 - (i / segs) * L;
    const flap = Math.sin(t * 6 - i * 0.6 + sw.ph) * L * 0.07;
    const wd = L * 0.12 * (1 - Math.abs(i - 3) / segs);
    ctx.fillStyle = `rgba(${150 + lit * 80},${70 + lit * 60},${60 + lit * 40},0.85)`;
    ctx.beginPath();
    ctx.ellipse(x, -wd - flap * 0.5, L * 0.05, wd * 0.9, 0.3, 0, Math.PI * 2);
    ctx.ellipse(x, wd + flap * 0.5, L * 0.05, wd * 0.9, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = `rgba(${170 + lit * 70},${90 + lit * 60},${70 + lit * 40},1)`;
  ctx.beginPath();
  ctx.ellipse(0, 0, L * 0.5, L * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  // grasping front appendages
  ctx.strokeStyle = `rgba(200,120,90,0.9)`;
  ctx.lineWidth = 2;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(L * 0.48, s * 3);
    ctx.quadraticCurveTo(L * 0.65, s * L * 0.08, L * 0.6, s * L * (0.15 + Math.sin(t * 3) * 0.03));
    ctx.stroke();
  }
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(L * 0.42, -L * 0.06, 2.5, 0, Math.PI * 2);
  ctx.arc(L * 0.42, L * 0.06, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function ExplosionScene({ s }: { s: SceneState }) {
  const { sfx } = useExperience();
  const pointer = usePointer();
  const world = useRef<{ crawlers: Crawler[]; jellies: Jelly[]; swimmers: Swimmer[]; motes: { x: number; y: number; s: number }[] } | null>(null);
  const fossil = useRef<HTMLDivElement>(null);

  useScrub(s.progress, s.active, (p) => {
    if (fossil.current) fossil.current.style.opacity = String(band(p, 0.48, 0.54) - band(p, 0.72, 0.78));
  });

  const canvas = useCanvasLoop((ctx, w, h, t, dt) => {
    const p = s.progress.current ?? 0;
    const unit = Math.min(w, h);
    if (!world.current) {
      world.current = {
        crawlers: Array.from({ length: 9 }, () => ({ x: rnd(0, w), dir: Math.random() < 0.5 ? -1 : 1, sp: rnd(6, 16), sz: unit * rnd(0.05, 0.09), ph: rnd(0, 6), flee: 0 })),
        jellies: Array.from({ length: 7 }, () => ({ x: rnd(0, w), y: rnd(0.15, 0.7) * h, sz: unit * rnd(0.025, 0.05), ph: rnd(0, 6), hue: rnd(170, 300) })),
        swimmers: Array.from({ length: 2 }, (_, i) => ({ x: rnd(0, w), y: (0.3 + i * 0.25) * h, dir: i ? -1 : 1, sz: unit * rnd(0.22, 0.3), ph: rnd(0, 6), boost: 0 })),
        motes: Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), s: rnd(0.5, 1.8) })),
      };
    }
    const W = world.current;
    const land = band(p, 0.76, 0.92);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, `rgb(${10 + land * 40},${60 + land * 60},${95 + land * 40})`);
    bg.addColorStop(0.6, "#06233a");
    bg.addColorStop(1, "#020a12");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Sunlight from the surface
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 6; i++) {
      const x = ((i / 6 + Math.sin(t * 0.1 + i) * 0.05) % 1) * w * 1.2 - w * 0.1;
      const g = ctx.createLinearGradient(x, 0, x + w * 0.15, h * 0.8);
      g.addColorStop(0, `rgba(140,220,255,${0.08 + land * 0.06})`);
      g.addColorStop(1, "rgba(140,220,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + w * 0.06, 0);
      ctx.lineTo(x + w * 0.25, h * 0.85);
      ctx.lineTo(x + w * 0.12, h * 0.85);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    for (const m of W.motes) {
      m.y -= 0.0006 * m.s;
      if (m.y < 0) m.y = 1;
      ctx.fillStyle = "rgba(200,230,255,0.25)";
      ctx.fillRect(m.x * w + Math.sin(t + m.y * 10) * 4, m.y * h, m.s, m.s);
    }

    // Sea floor
    const floor = h * 0.86;
    ctx.fillStyle = "#1b1712";
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 20) ctx.lineTo(x, floor + Math.sin(x * 0.01) * 10 + Math.sin(x * 0.033) * 5);
    ctx.lineTo(w, h);
    ctx.fill();
    // sponges and seaweed on the floor
    for (let i = 0; i < 9; i++) {
      const x = ((i * 137) % 100) / 100 * w;
      ctx.strokeStyle = "rgba(90,140,90,0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, floor + 6);
      ctx.quadraticCurveTo(x + Math.sin(t + i) * 12, floor - 40, x + Math.sin(t * 0.8 + i) * 18, floor - 70 - (i % 3) * 20);
      ctx.stroke();
    }

    const pr = pointer.current;
    const lx = pr.inside ? pr.x : w * (0.5 + Math.sin(t * 0.3) * 0.3);
    const ly = pr.inside ? pr.y : h * (0.5 + Math.cos(t * 0.23) * 0.2);
    const lightR = unit * 0.32;
    const litAt = (x: number, y: number) => clamp(1 - Math.hypot(x - lx, y - ly) / lightR);

    for (const c of W.crawlers) {
      const lit = litAt(c.x, floor);
      if (lit > 0.3) {
        c.dir = c.x > lx ? 1 : -1;
        c.flee = 1;
      }
      c.flee *= 0.98;
      c.x += c.dir * c.sp * (1 + c.flee * 4) * dt;
      if (c.x < -50) c.x = w + 40;
      if (c.x > w + 50) c.x = -40;
      drawTrilobite(ctx, c.x, floor + 2 + Math.sin(c.x * 0.01) * 10 - c.sz * 0.2, c.sz, c.dir, t, lit);
    }
    for (const j of W.jellies) {
      j.y -= (Math.max(0, Math.sin(t * 2 + j.ph)) * 14 - 3) * dt;
      j.x += Math.sin(t * 0.3 + j.ph) * 6 * dt;
      if (j.y < -40) j.y = h * 0.8;
      drawJelly(ctx, j, t, litAt(j.x, j.y));
    }
    for (const sw of W.swimmers) {
      sw.boost *= 0.97;
      sw.x += sw.dir * (unit * 0.04 + sw.boost) * dt;
      sw.y += Math.sin(t * 0.5 + sw.ph) * 10 * dt;
      if (sw.x > w + sw.sz) sw.x = -sw.sz;
      if (sw.x < -sw.sz) sw.x = w + sw.sz;
      drawSwimmer(ctx, sw, t, litAt(sw.x, sw.y));
    }

    // Darkness, with the visitor's light cutting through it
    const dark = ctx.createRadialGradient(lx, ly, lightR * 0.2, lx, ly, lightR * 1.6);
    dark.addColorStop(0, "rgba(0,8,20,0)");
    dark.addColorStop(1, `rgba(0,8,20,${0.72 - land * 0.4})`);
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, w, h);
  });

  const onTap = (e: React.PointerEvent) => {
    const W = world.current;
    if (!W) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    for (const sw of W.swimmers) if (Math.hypot(sw.x - x, sw.y - y) < sw.sz) sw.boost = 260;
    for (const c of W.crawlers) if (Math.abs(c.x - x) < 120) {
      c.dir = c.x > x ? 1 : -1;
      c.flee = 1;
    }
    sfx("whoosh");
  };

  return (
    <>
      <canvas ref={canvas} className="scene-canvas" onPointerDown={onTap} {...pointer.handlers} aria-hidden="true" />
      <div ref={fossil} className="scene-card scene-card-right" style={{ opacity: 0 }}>
        <MediaImage id="marrella" className="card-media" />
        <p className="card-label">Real fossil: Marrella, Burgess Shale, about 508 million years old</p>
      </div>
    </>
  );
}
