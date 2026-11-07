"use client";

import { useRef } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, clamp, rnd, useCanvasLoop } from "../useCanvasLoop";

type Stalk = { x: number; born: number; h: number; ph: number };
type Light = { x: number; y: number; at: number; s: number };

export function CivilisationScene({ s }: { s: SceneState }) {
  const { sfx } = useExperience();
  const gobekli = useRef<HTMLDivElement>(null);
  const pyramids = useRef<HTMLDivElement>(null);
  const stalks = useRef<Stalk[]>([]);
  const lights = useRef<Light[]>([]);
  const clock = useRef(0);
  const counter = useRef<HTMLSpanElement>(null);

  useScrub(s.progress, s.active, (p) => {
    if (gobekli.current) gobekli.current.style.opacity = String(1 - band(p, 0.72, 0.78));
    if (pyramids.current) pyramids.current.style.opacity = String(band(p, 0.72, 0.78));
  });

  const sow = (x: number, n = 5) => {
    for (let i = 0; i < n; i++) stalks.current.push({ x: x + rnd(-24, 24), born: clock.current + i * 0.06, h: rnd(0.08, 0.14), ph: rnd(0, 6) });
    if (stalks.current.length > 500) stalks.current.splice(0, stalks.current.length - 500);
    sfx("plant");
  };

  const canvas = useCanvasLoop((ctx, w, h, t) => {
    clock.current = t;
    const p = s.progress.current ?? 0;
    ctx.clearRect(0, 0, w, h);
    const field = band(p, 0.22, 0.28) * (1 - band(p, 0.72, 0.78));
    if (field <= 0) return;
    const ground = h * 0.78;

    // Dusk falls as villages become cities
    const dusk = band(p, 0.48, 0.6);
    if (dusk > 0) {
      ctx.fillStyle = `rgba(10,12,30,${0.55 * dusk * field})`;
      ctx.fillRect(0, 0, w, h);
    }
    const g = ctx.createLinearGradient(0, ground, 0, h);
    g.addColorStop(0, `rgba(92,70,40,${0.92 * field})`);
    g.addColorStop(1, `rgba(40,28,16,${field})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, ground, w, h - ground);

    // City lights on the horizon
    if (dusk > 0) {
      const want = Math.floor(dusk * 160);
      while (lights.current.length < want) lights.current.push({ x: rnd(0, w), y: ground - rnd(0, h * 0.06), at: t, s: rnd(1, 2.6) });
      for (const l of lights.current) {
        const a = clamp((t - l.at) / 1.2) * field * (0.6 + 0.4 * Math.sin(t * 3 + l.x));
        ctx.fillStyle = `rgba(255,${200 + Math.random() * 30},120,${a})`;
        ctx.fillRect(l.x, l.y, l.s, l.s);
      }
    }

    // Grain the visitor has sown
    ctx.lineCap = "round";
    for (const st of stalks.current) {
      const grow = clamp((t - st.born) / 2.2);
      if (grow <= 0) continue;
      const hh = st.h * h * grow;
      const sway = Math.sin(t * 1.4 + st.ph + st.x * 0.01) * 6 * grow;
      ctx.strokeStyle = `rgba(${150 + 70 * grow},${170 + 20 * grow},${70},${field})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(st.x, ground + 6);
      ctx.quadraticCurveTo(st.x + sway * 0.3, ground - hh * 0.5, st.x + sway, ground - hh);
      ctx.stroke();
      if (grow > 0.6) {
        ctx.fillStyle = `rgba(230,190,90,${field * (grow - 0.6) * 2.5})`;
        ctx.beginPath();
        ctx.ellipse(st.x + sway, ground - hh - 6, 2.6, 8, sway * 0.03, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (counter.current) counter.current.textContent = String(stalks.current.length);
  });

  const onTap = (e: React.PointerEvent) => {
    const p = s.progress.current ?? 0;
    if (p < 0.22 || p > 0.74) return;
    const r = e.currentTarget.getBoundingClientRect();
    sow(e.clientX - r.left);
  };

  return (
    <>
      <MediaImage ref={gobekli} id="gobekli" className="scene-layer" kenburns />
      <MediaImage ref={pyramids} id="pyramids" className="scene-layer" style={{ opacity: 0 }} kenburns />
      <canvas ref={canvas} className="scene-canvas" onPointerDown={onTap} aria-hidden="true" />
      {s.beat === 1 || s.beat === 2 ? (
        <>
          <p className="scene-counter">
            Stalks of grain: <span ref={counter}>0</span>
          </p>
          <button type="button" className="scene-action" onClick={() => sow(rnd(0.15, 0.85) * window.innerWidth, 8)}>
            <span className="pulse-dot" aria-hidden="true" /> Sow grain
          </button>
        </>
      ) : null}
    </>
  );
}
