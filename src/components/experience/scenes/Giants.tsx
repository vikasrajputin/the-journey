"use client";

import { useRef, useState } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, lerp, rnd, useCanvasLoop } from "../useCanvasLoop";

type Ember = { x: number; y: number; v: number; s: number; d: number };
type Bird = { x: number; y: number; s: number; ph: number; v: number };

export function GiantsScene({ s }: { s: SceneState }) {
  const { sfx, shake } = useExperience();
  const sue = useRef<HTMLDivElement>(null);
  const lastStep = useRef(-1);
  const impactAt = useRef<number | null>(null);
  const roars = useRef<number[]>([]);
  const embers = useRef<Ember[]>([]);
  const birds = useRef<Bird[]>([]);
  const clock = useRef(0);
  const [roaring, setRoaring] = useState(false);

  const roar = () => {
    sfx("roar");
    shake(5, 2200);
    roars.current.push(clock.current);
    setRoaring(true);
    setTimeout(() => setRoaring(false), 2600);
  };

  useScrub(s.progress, s.active, (p) => {
    if (sue.current) {
      sue.current.style.opacity = String(band(p, 0.06, 0.14) * (1 - band(p, 0.66, 0.7)));
      sue.current.style.transform = `scale(${1.08 + p * 0.2})`;
    }
    // Footsteps as you scroll towards Sue
    const step = p > 0.02 && p < 0.3 ? Math.floor(p / 0.045) : -1;
    if (step !== lastStep.current && step >= 0 && s.active) {
      sfx("step");
      shake(7, 300);
    }
    lastStep.current = step;
    if (p > 0.68 && impactAt.current === null && s.active) {
      impactAt.current = clock.current;
      sfx("impact");
      shake(26, 2200);
    }
    if (p < 0.5) impactAt.current = null;
  });

  const canvas = useCanvasLoop((ctx, w, h, t, dt) => {
    clock.current = t;
    const p = s.progress.current ?? 0;
    ctx.clearRect(0, 0, w, h);

    // Before Sue appears: a Mesozoic forest silhouette at dusk
    const pre = 1 - band(p, 0.06, 0.14);
    if (pre > 0) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgba(40,60,50,${pre})`);
      g.addColorStop(1, `rgba(10,20,14,${pre})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = `rgba(5,12,8,${pre})`;
      for (let i = 0; i < 14; i++) {
        const x = (i / 13) * w;
        const th = h * (0.35 + ((i * 37) % 10) / 30);
        ctx.fillRect(x - 4, h - th, 8, th);
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2 + Math.sin(t * 0.5 + i) * 0.05;
          ctx.beginPath();
          ctx.ellipse(x + Math.cos(a) * 30, h - th + Math.sin(a) * 8, 40, 6, a, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Sound waves from the reconstructed call
    roars.current = roars.current.filter((r0) => t - r0 < 2.6);
    for (const r0 of roars.current) {
      const age = t - r0;
      for (let k = 0; k < 4; k++) {
        const a = age - k * 0.35;
        if (a <= 0) continue;
        ctx.strokeStyle = `rgba(255,214,150,${0.35 * (1 - age / 2.6)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.4, a * Math.max(w, h) * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // The asteroid
    const fall = band(p, 0.54, 0.68);
    if (fall > 0 && fall < 1) {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, `rgba(30,10,10,${fall * 0.6})`);
      sky.addColorStop(1, `rgba(120,40,10,${fall * 0.4})`);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
      const k = fall * fall;
      const x = lerp(w * 1.05, w * 0.42, k);
      const y = lerp(-h * 0.1, h * 0.78, k);
      const r = 6 + 40 * k;
      const tail = ctx.createLinearGradient(x, y, x + w * 0.4, y - h * 0.45);
      tail.addColorStop(0, "rgba(255,230,180,0.9)");
      tail.addColorStop(1, "rgba(255,120,40,0)");
      ctx.strokeStyle = tail;
      ctx.lineWidth = r * 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w * 0.4, y - h * 0.45);
      ctx.stroke();
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
      g.addColorStop(0, "rgba(255,255,240,1)");
      g.addColorStop(0.4, "rgba(255,200,120,0.9)");
      g.addColorStop(1, "rgba(255,100,30,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r * 2, y - r * 2, r * 4, r * 4);
    }

    // After the impact: flash, fire on the horizon, then darkness and falling ash
    const since = impactAt.current === null ? -1 : t - impactAt.current;
    const after = band(p, 0.68, 0.72);
    const dawn = band(p, 0.86, 0.94);
    if (after > 0) {
      const dark = ctx.createLinearGradient(0, 0, 0, h);
      dark.addColorStop(0, `rgba(12,8,8,${after * (1 - dawn)})`);
      dark.addColorStop(0.75, `rgba(${60 + 80 * (1 - band(p, 0.72, 0.82))},20,8,${after * (1 - dawn)})`);
      dark.addColorStop(1, `rgba(20,8,4,${after * (1 - dawn)})`);
      ctx.fillStyle = dark;
      ctx.fillRect(0, 0, w, h);
      if (embers.current.length < 160 && dawn < 1) embers.current.push({ x: rnd(0, w), y: -10, v: rnd(20, 60), s: rnd(1, 3), d: rnd(-10, 10) });
      for (const e of embers.current) {
        e.y += e.v * dt;
        e.x += e.d * dt;
        ctx.fillStyle = e.s > 2 ? `rgba(255,140,60,${0.8 * (1 - dawn)})` : `rgba(180,170,160,${0.6 * (1 - dawn)})`;
        ctx.fillRect(e.x, e.y, e.s, e.s);
      }
      embers.current = embers.current.filter((e) => e.y < h + 10);
    }
    if (since >= 0 && since < 1.6) {
      ctx.fillStyle = `rgba(255,248,230,${1 - since / 1.6})`;
      ctx.fillRect(0, 0, w, h);
    }

    // A new dawn, and the dinosaurs that survived
    if (dawn > 0) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgba(70,110,170,${dawn})`);
      g.addColorStop(0.7, `rgba(240,170,120,${dawn})`);
      g.addColorStop(1, `rgba(60,40,40,${dawn})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      if (!birds.current.length) birds.current = Array.from({ length: 9 }, (_, i) => ({ x: -rnd(20, w * 0.6), y: h * rnd(0.2, 0.5), s: rnd(8, 16), ph: i, v: rnd(50, 90) }));
      ctx.strokeStyle = `rgba(20,20,30,${dawn})`;
      ctx.lineWidth = 2;
      for (const b of birds.current) {
        b.x += b.v * dt;
        if (b.x > w + 30) b.x = -30;
        const f = Math.sin(t * 8 + b.ph) * b.s * 0.6;
        ctx.beginPath();
        ctx.moveTo(b.x - b.s, b.y - f);
        ctx.quadraticCurveTo(b.x - b.s * 0.4, b.y - b.s * 0.2, b.x, b.y);
        ctx.quadraticCurveTo(b.x + b.s * 0.4, b.y - b.s * 0.2, b.x + b.s, b.y - f);
        ctx.stroke();
      }
    }
  });

  return (
    <>
      <MediaImage ref={sue} id="sue" className="scene-layer" style={{ opacity: 0 }} priority={false} />
      <canvas ref={canvas} className="scene-canvas" aria-hidden="true" onPointerDown={() => s.beat === 2 && roar()} />
      {s.beat === 2 || s.beat === 1 ? (
        <button type="button" className="scene-action scene-action-center" onClick={roar} disabled={roaring}>
          <span className="pulse-dot" aria-hidden="true" /> {roaring ? "Listening…" : "Hear a reconstructed call"}
        </button>
      ) : null}
    </>
  );
}
