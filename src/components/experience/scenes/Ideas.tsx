"use client";

import { useRef } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, lerp, rnd, useCanvasLoop } from "../useCanvasLoop";
import { usePointer } from "../usePointer";
import { Starfield } from "./Starfield";

export function IdeasScene({ s }: { s: SceneState }) {
  const { sfx } = useExperience();
  const pointer = usePointer();
  const deep = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const stars = useRef(new Starfield(220));
  const gals = useRef<{ x: number; y: number; r: number; a: number; hue: number }[]>([]);
  const lens = useRef({ x: 0, y: 0 });

  const canvas = useCanvasLoop((ctx, w, h, t) => {
    const p = s.progress.current ?? 0;
    const unit = Math.min(w, h);
    ctx.fillStyle = "#03040a";
    ctx.fillRect(0, 0, w, h);
    stars.current.draw(ctx, w, h, t, 0.8);

    // Jupiter and the four moons Galileo saw, moving night by night
    const jup = 1 - band(p, 0.18, 0.26);
    if (jup > 0) {
      const jx = w * 0.5;
      const jy = h * 0.42;
      const g = ctx.createRadialGradient(jx, jy, 0, jx, jy, 14);
      g.addColorStop(0, `rgba(255,245,220,${jup})`);
      g.addColorStop(1, "rgba(255,230,180,0)");
      ctx.fillStyle = g;
      ctx.fillRect(jx - 14, jy - 14, 28, 28);
      [1.8, 2.9, 4.6, 8.1].forEach((d, i) => {
        const x = jx + Math.cos(t * (0.9 / (i + 1)) + i * 2) * d * unit * 0.03;
        ctx.fillStyle = `rgba(240,240,255,${jup * 0.95})`;
        ctx.beginPath();
        ctx.arc(x, jy, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // The lens: follows the visitor, or wanders by itself
    const pr = pointer.current;
    const tx = pr.inside ? pr.x : w * (0.5 + Math.sin(t * 0.35) * 0.25);
    const ty = pr.inside ? pr.y : h * (0.45 + Math.cos(t * 0.27) * 0.18);
    lens.current.x = lerp(lens.current.x || tx, tx, 0.12);
    lens.current.y = lerp(lens.current.y || ty, ty, 0.12);
    const open = band(p, 0.18, 0.26);
    const reveal = band(p, 0.48, 0.6);
    const R = open * unit * 0.2 + reveal * Math.hypot(w, h);
    const { x, y } = lens.current;

    // Drawn galaxies sit under the photograph, in case it cannot load
    if (!gals.current.length) gals.current = Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random(), r: rnd(2, 9), a: rnd(0, 3), hue: rnd(20, 230) }));
    if (R > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "#020208";
      ctx.fillRect(0, 0, w, h);
      for (const gl of gals.current) {
        const g = ctx.createRadialGradient(gl.x * w, gl.y * h, 0, gl.x * w, gl.y * h, gl.r);
        g.addColorStop(0, `hsla(${gl.hue},70%,85%,0.9)`);
        g.addColorStop(1, `hsla(${gl.hue},70%,60%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(gl.x * w, gl.y * h, gl.r, gl.r * 0.5, gl.a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (deep.current) {
      deep.current.style.opacity = R > 1 ? "1" : "0";
      deep.current.style.clipPath = `circle(${R}px at ${x}px ${y}px)`;
    }
    if (ring.current) {
      const show = open > 0 && reveal < 1;
      ring.current.style.opacity = show ? String(open * (1 - reveal)) : "0";
      ring.current.style.transform = `translate(${x - R}px, ${y - R}px)`;
      ring.current.style.width = ring.current.style.height = `${R * 2}px`;
    }
  });

  return (
    <>
      <canvas ref={canvas} className="scene-canvas" onPointerDown={() => sfx("chime")} {...pointer.handlers} aria-hidden="true" />
      <MediaImage ref={deep} id="hudf" className="scene-layer lens-layer" style={{ opacity: 0 }} />
      <div ref={ring} className="lens-ring" aria-hidden="true" />
    </>
  );
}
