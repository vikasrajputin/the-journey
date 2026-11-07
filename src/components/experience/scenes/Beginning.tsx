"use client";

import { useRef, useState } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, MediaVideo, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, clamp, rnd, useCanvasLoop } from "../useCanvasLoop";
import { usePointer } from "../usePointer";

type P = { a: number; r0: number; sp: number; g: number; oa: number; or: number; tw: number; x: number; y: number };
type Flare = { x: number; y: number; t: number };

const GALAXIES = [
  [0.22, 0.3, 0.16],
  [0.7, 0.25, 0.12],
  [0.5, 0.62, 0.2],
  [0.15, 0.75, 0.09],
  [0.85, 0.68, 0.11],
  [0.38, 0.18, 0.07],
  [0.9, 0.42, 0.06],
];

function tempColour(T: number, alpha: number) {
  // T: 1 = white hot, 0 = deep red
  const r = 255;
  const g = Math.round(110 + 145 * T);
  const b = Math.round(40 + 215 * Math.max(0, T - 0.4) / 0.6);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function BeginningScene({ s }: { s: SceneState }) {
  const { sfx, shake, reduced } = useExperience();
  const parts = useRef<P[]>([]);
  const flares = useRef<Flare[]>([]);
  const bangAt = useRef<number | null>(null);
  const clock = useRef(0);
  const [banged, setBanged] = useState(false);
  const pointer = usePointer();
  const cmb = useRef<HTMLDivElement>(null);
  const pillars = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLDivElement>(null);
  const [videoOn, setVideoOn] = useState(false);

  const bang = () => {
    if (bangAt.current !== null) return;
    bangAt.current = clock.current;
    setBanged(true);
    sfx("bang");
    shake(16, 1100);
  };

  useScrub(s.progress, s.active, (p) => {
    if (p > 0.04 && s.active) bang();
    if (cmb.current) cmb.current.style.opacity = String(band(p, 0.36, 0.42) - band(p, 0.52, 0.57));
    if (pillars.current) pillars.current.style.opacity = String(band(p, 0.72, 0.78) - band(p, 0.86, 0.9));
    if (video.current) video.current.style.opacity = String(band(p, 0.86, 0.92));
    const on = p > 0.8;
    if (on !== videoOn) setVideoOn(on);
  });

  const canvas = useCanvasLoop((ctx, w, h, t) => {
    clock.current = t;
    const p = s.progress.current ?? 0;
    const small = w < 700;
    if (!parts.current.length) {
      const n = small ? 650 : 1400;
      parts.current = Array.from({ length: n }, () => {
        const g = Math.floor(Math.random() * GALAXIES.length);
        const u = Math.random();
        return { a: rnd(0, Math.PI * 2), r0: Math.sqrt(Math.random()), sp: rnd(0.6, 1.4), g, oa: rnd(0, Math.PI * 2), or: Math.pow(u, 1.6), tw: rnd(0, 10), x: 0, y: 0 };
      });
    }
    ctx.fillStyle = "#020208";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.hypot(w, h) * 0.6;
    const since = bangAt.current === null ? -1 : t - bangAt.current;

    if (since < 0) {
      // The hot, dense beginning: a single point of light.
      const pulse = 1 + Math.sin(t * 3) * 0.15;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 * pulse);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.15, "rgba(255,240,200,0.9)");
      g.addColorStop(1, "rgba(255,160,60,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    const burst = 1 - Math.pow(1 - clamp(since / 2.4), 3);
    const expand = band(p, 0.04, 0.45);
    const T = 1 - band(p, 0.06, 0.36);
    const clear = band(p, 0.34, 0.42);
    const cluster = band(p, 0.48, 0.68);
    const light = band(p, 0.5, 0.62);

    // Glowing fog before the universe turns transparent.
    if (clear < 1) {
      const fog = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      fog.addColorStop(0, tempColour(T, 0.5 * (1 - clear)));
      fog.addColorStop(0.5, tempColour(Math.max(0, T - 0.2), 0.22 * (1 - clear)));
      fog.addColorStop(1, tempColour(Math.max(0, T - 0.4), 0.04 * (1 - clear)));
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.globalCompositeOperation = "lighter";
    const pr = pointer.current;
    for (const q of parts.current) {
      const r = q.r0 * R * (0.08 + 0.4 * burst + 0.7 * expand);
      let x = cx + Math.cos(q.a) * r * (w > h ? 1.2 : 0.8);
      let y = cy + Math.sin(q.a) * r * 0.8;
      if (cluster > 0) {
        const gal = GALAXIES[q.g];
        const spin = reduced ? 0 : t * 0.08 / (0.2 + q.or);
        const ang = q.oa + spin + q.or * 5; // a loose spiral
        const rr = q.or * gal[2] * Math.min(w, h) * 1.5;
        const gx = gal[0] * w + Math.cos(ang) * rr;
        const gy = gal[1] * h + Math.sin(ang) * rr * 0.45;
        x += (gx - x) * cluster;
        y += (gy - y) * cluster;
      }
      if (pr.inside && p > 0.48) {
        const dx = pr.x - x;
        const dy = pr.y - y;
        const d2 = dx * dx + dy * dy + 2500;
        const f = Math.min(40, 90000 / d2);
        x += (dx / Math.sqrt(d2)) * f;
        y += (dy / Math.sqrt(d2)) * f;
      }
      q.x = x;
      q.y = y;
      const tw = 0.6 + 0.4 * Math.sin(t * 2 + q.tw);
      const size = (clear < 1 ? 1.6 : 1.1) * (1 + cluster * (1 - q.or) * 1.2);
      const alpha = clear < 1 ? 0.5 + 0.4 * T : (0.25 + 0.6 * light * (1 - q.or * 0.6)) * tw;
      ctx.fillStyle = clear < 1 ? tempColour(T, alpha) : `rgba(${200 + q.g * 6},${215 + q.g * 4},255,${alpha})`;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
    // Galaxy cores
    if (cluster > 0.2) {
      for (const gal of GALAXIES) {
        const gx = gal[0] * w;
        const gy = gal[1] * h;
        const gr = gal[2] * Math.min(w, h) * 0.9;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, `rgba(255,236,200,${0.35 * cluster})`);
        g.addColorStop(1, "rgba(120,140,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(gx, gy, gr, gr * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Stars the visitor has lit
    flares.current = flares.current.filter((f) => t - f.t < 60);
    for (const f of flares.current) {
      const age = t - f.t;
      const k = clamp(age / 0.6);
      const ring = age * 260;
      if (age < 1.6) {
        ctx.strokeStyle = `rgba(255,220,160,${0.6 * (1 - age / 1.6)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(f.x, f.y, ring, 0, Math.PI * 2);
        ctx.stroke();
      }
      const size = 26 * k * (0.85 + 0.15 * Math.sin(t * 4 + f.x));
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, size);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.2, "rgba(255,230,170,0.8)");
      g.addColorStop(1, "rgba(255,180,90,0)");
      ctx.fillStyle = g;
      ctx.fillRect(f.x - size, f.y - size, size * 2, size * 2);
      ctx.fillStyle = "rgba(255,240,210,0.7)";
      ctx.fillRect(f.x - size * 1.6, f.y - 0.75, size * 3.2, 1.5);
      ctx.fillRect(f.x - 0.75, f.y - size * 1.6, 1.5, size * 3.2);
    }
    ctx.globalCompositeOperation = "source-over";

    // The flash of the first instant
    if (since < 1.2) {
      ctx.fillStyle = `rgba(255,250,235,${1 - since / 1.2})`;
      ctx.fillRect(0, 0, w, h);
    }
  });

  const onTap = (e: React.PointerEvent) => {
    const p = s.progress.current ?? 0;
    if (bangAt.current === null) return bang();
    if (p < 0.44) {
      sfx("whoosh");
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    flares.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: clock.current });
    sfx("shimmer");
  };

  return (
    <>
      <canvas ref={canvas} className="scene-canvas" onPointerDown={onTap} {...pointer.handlers} aria-hidden="true" />
      <div ref={cmb} className="scene-card scene-card-right" style={{ opacity: 0 }}>
        <MediaImage id="cmb" className="card-media" />
        <p className="card-label">Real data: the oldest light, mapped by three space telescopes</p>
      </div>
      <MediaImage ref={pillars} id="pillars" className="scene-layer over" style={{ opacity: 0 }} kenburns />
      <MediaVideo ref={video} id="hubble-zoom" className="scene-layer over" style={{ opacity: 0 }} play={videoOn && s.active} />
      {!banged ? (
        <button type="button" className="scene-action scene-action-center" onClick={bang}>
          <span className="pulse-dot" aria-hidden="true" /> Tap to begin the universe
        </button>
      ) : null}
    </>
  );
}
