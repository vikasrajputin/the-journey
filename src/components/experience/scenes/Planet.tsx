"use client";

import { useRef, useState } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, MediaVideo, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, clamp, lerp, rnd, useCanvasLoop } from "../useCanvasLoop";
import { Starfield } from "./Starfield";

type Dust = { r: number; a: number; s: number; sz: number; hue: number; cap: number };
type Debris = { x: number; y: number; vx: number; vy: number; life: number };

export function PlanetScene({ s }: { s: SceneState }) {
  const { sfx, shake } = useExperience();
  const dust = useRef<Dust[]>([]);
  const stars = useRef(new Starfield(260));
  const impactAt = useRef<number | null>(null);
  const debris = useRef<Debris[]>([]);
  const clock = useRef(0);
  const [struck, setStruck] = useState(false);
  const lava = useRef<HTMLDivElement>(null);
  const earth = useRef<HTMLDivElement>(null);
  const [lavaOn, setLavaOn] = useState(false);

  const strike = () => {
    if (impactAt.current !== null) return;
    impactAt.current = clock.current;
    setStruck(true);
    setTimeout(() => {
      sfx("impact");
      shake(22, 1600);
    }, 1100);
  };

  useScrub(s.progress, s.active, (p) => {
    if (p > 0.6) strike();
    if (lava.current) lava.current.style.opacity = String(band(p, 0.62, 0.68) - band(p, 0.82, 0.86));
    if (earth.current) earth.current.style.opacity = String(band(p, 0.84, 0.9));
    const on = p > 0.58 && p < 0.9;
    if (on !== lavaOn) setLavaOn(on);
  });

  const canvas = useCanvasLoop((ctx, w, h, t, dt) => {
    clock.current = t;
    const p = s.progress.current ?? 0;
    const portrait = h > w;
    const D = Math.min(w * (portrait ? 0.95 : 0.75), h * 1.1);
    const sx = portrait ? w * 0.5 : w * 0.3;
    const sy = portrait ? h * 0.38 : h * 0.5;
    const tilt = 0.3;
    if (!dust.current.length) {
      dust.current = Array.from({ length: w < 700 ? 900 : 1800 }, () => {
        const r = 0.12 + Math.pow(Math.random(), 0.7) * 0.9;
        return { r, a: rnd(0, Math.PI * 2), s: 0.6 / Math.pow(r, 1.5), sz: rnd(0.6, 1.8), hue: rnd(15, 45), cap: Math.random() };
      });
    }
    ctx.fillStyle = "#030305";
    ctx.fillRect(0, 0, w, h);
    stars.current.draw(ctx, w, h, t, 0.7);

    const rp = 0.62; // the young Earth's orbit, as a fraction of the disc
    const pa = t * 0.06;
    const px = sx + Math.cos(pa) * rp * D;
    const py = sy + Math.sin(pa) * rp * D * tilt;
    const accrete = band(p, 0.14, 0.42);
    const pr = (portrait ? 0.035 : 0.03) * D + 0.06 * D * accrete;

    // The Sun
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, D * 0.22);
    sg.addColorStop(0, "rgba(255,255,240,1)");
    sg.addColorStop(0.12, "rgba(255,226,150,0.95)");
    sg.addColorStop(0.4, "rgba(255,150,60,0.25)");
    sg.addColorStop(1, "rgba(255,120,40,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(sx - D * 0.22, sy - D * 0.22, D * 0.44, D * 0.44);

    // The disc of dust, some of it captured by the growing planet
    ctx.globalCompositeOperation = "lighter";
    const discFade = 1 - band(p, 0.45, 0.62) * 0.85;
    for (const d of dust.current) {
      d.a += d.s * dt * 0.25;
      let x = sx + Math.cos(d.a) * d.r * D;
      let y = sy + Math.sin(d.a) * d.r * D * tilt;
      const captured = d.cap < accrete * 0.7 && Math.abs(d.r - rp) < 0.35;
      if (captured) {
        const k = clamp((accrete * 0.7 - d.cap) * 4);
        x = lerp(x, px + Math.cos(d.a * 6) * pr * 1.4, k);
        y = lerp(y, py + Math.sin(d.a * 6) * pr * 0.5, k);
      }
      ctx.fillStyle = `hsla(${d.hue},80%,${55 + (1 - d.r) * 25}%,${(0.35 + 0.4 * (1 - d.r)) * discFade})`;
      ctx.fillRect(x, y, d.sz, d.sz);
    }
    ctx.globalCompositeOperation = "source-over";

    // Theia's approach and the impact
    const since = impactAt.current === null ? -1 : t - impactAt.current;
    if (since >= 0 && since < 1.1) {
      const k = since / 1.1;
      const tx = lerp(px + D * 0.7, px + pr * 0.8, k * k);
      const ty = lerp(py - D * 0.5, py - pr * 0.4, k * k);
      ctx.fillStyle = "#8a5a3a";
      ctx.beginPath();
      ctx.arc(tx, ty, pr * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,170,90,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx + D * 0.15, ty - D * 0.11);
      ctx.stroke();
    }
    if (since >= 1.1 && debris.current.length === 0 && since < 1.3) {
      debris.current = Array.from({ length: 420 }, () => {
        const a = rnd(-Math.PI, Math.PI);
        const v = rnd(30, 260);
        return { x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.6, life: rnd(2, 6) };
      });
    }

    // Debris settles into a ring, then into the Moon
    const moonK = since > 1.1 ? clamp((since - 2) / 5) : 0;
    const ma = t * 0.5;
    const mx = px + Math.cos(ma) * pr * 3.2;
    const my = py + Math.sin(ma) * pr * 1.1;
    if (debris.current.length) {
      ctx.globalCompositeOperation = "lighter";
      for (const b of debris.current) {
        b.vx *= 0.985;
        b.vy *= 0.985;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        const x = lerp(b.x, mx, moonK);
        const y = lerp(b.y, my, moonK);
        ctx.fillStyle = `rgba(255,${150 + Math.random() * 80},80,${0.7 * (1 - moonK)})`;
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.globalCompositeOperation = "source-over";
    }

    // The planet, molten then cooling to blue
    const cool = band(p, 0.72, 0.84);
    const pg = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, pr * 0.1, px, py, pr);
    const hot = Math.sin(t * 2) * 0.1;
    pg.addColorStop(0, cool > 0.5 ? `rgba(120,180,255,1)` : `rgba(255,${200 + 30 * hot},120,1)`);
    pg.addColorStop(0.6, `rgb(${lerp(230, 40, cool)},${lerp(90, 100, cool)},${lerp(30, 190, cool)})`);
    pg.addColorStop(1, `rgb(${lerp(90, 10, cool)},${lerp(20, 30, cool)},${lerp(10, 70, cool)})`);
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
    if (cool < 1) {
      const glow = ctx.createRadialGradient(px, py, pr, px, py, pr * 1.8);
      glow.addColorStop(0, `rgba(255,120,40,${0.5 * (1 - cool)})`);
      glow.addColorStop(1, "rgba(255,80,20,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, pr * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    if (moonK > 0.6) {
      ctx.fillStyle = `rgba(200,195,185,${clamp((moonK - 0.6) * 2.5)})`;
      ctx.beginPath();
      ctx.arc(mx, my, pr * 0.27, 0, Math.PI * 2);
      ctx.fill();
    }
    if (since >= 1.1 && since < 2) {
      ctx.fillStyle = `rgba(255,240,220,${1 - (since - 1.1) / 0.9})`;
      ctx.fillRect(0, 0, w, h);
    }
  });

  return (
    <>
      <canvas ref={canvas} className="scene-canvas" aria-hidden="true" onPointerDown={() => (s.progress.current ?? 0) > 0.3 && strike()} />
      <MediaVideo ref={lava} id="lava" className="scene-layer over" style={{ opacity: 0 }} play={lavaOn && s.active} />
      <MediaImage ref={earth} id="apollo17" className="scene-layer contain over" style={{ opacity: 0 }} />
      {!struck && s.beat === 2 ? (
        <button type="button" className="scene-action scene-action-center" onClick={strike}>
          <span className="pulse-dot" aria-hidden="true" /> Strike the young Earth
        </button>
      ) : null}
    </>
  );
}
