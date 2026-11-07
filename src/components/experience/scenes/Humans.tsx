"use client";

import { useRef, useState } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, MediaVideo, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, clamp, rnd, useCanvasLoop } from "../useCanvasLoop";

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number };
type Stencil = { x: number; y: number; a: number; s: number };

function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy));
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

/** Is a point (in hand-local units, hand height ≈ 2) inside a simple open hand? */
function inHand(x: number, y: number) {
  if ((x / 0.34) ** 2 + ((y - 0.2) / 0.4) ** 2 < 1) return true;
  const fingers: [number, number, number, number, number][] = [
    [-0.24, -0.1, -0.36, -0.78, 0.08],
    [-0.08, -0.15, -0.11, -0.95, 0.085],
    [0.08, -0.15, 0.12, -0.9, 0.085],
    [0.23, -0.1, 0.34, -0.7, 0.075],
    [-0.28, 0.25, -0.68, -0.12, 0.085],
  ];
  return fingers.some(([ax, ay, bx, by, r]) => segDist(x, y, ax, ay, bx, by) < r);
}

export function HumansScene({ s }: { s: SceneState }) {
  const { sfx } = useExperience();
  const laetoli = useRef<HTMLDivElement>(null);
  const fire = useRef<HTMLDivElement>(null);
  const hands = useRef<HTMLDivElement>(null);
  const [fireOn, setFireOn] = useState(false);
  const sparks = useRef<Spark[]>([]);
  const wall = useRef<HTMLCanvasElement | null>(null);
  const spraying = useRef<Stencil | null>(null);
  const lastHiss = useRef(0);
  const clock = useRef(0);
  const made = useRef(0);
  const [handsMade, setHandsMade] = useState(0);

  useScrub(s.progress, s.active, (p) => {
    if (laetoli.current) laetoli.current.style.opacity = String(1 - band(p, 0.2, 0.26));
    if (fire.current) fire.current.style.opacity = String(band(p, 0.2, 0.26) - band(p, 0.62, 0.68));
    if (hands.current) hands.current.style.opacity = String(band(p, 0.62, 0.68));
    const on = p > 0.16 && p < 0.72;
    if (on !== fireOn) setFireOn(on);
  });

  const canvas = useCanvasLoop((ctx, w, h, t, dt) => {
    clock.current = t;
    const p = s.progress.current ?? 0;
    ctx.clearRect(0, 0, w, h);
    const unit = Math.min(w, h);

    // A: footprints appear, one step at a time
    const walk = band(p, 0.0, 0.2) * (1 - band(p, 0.2, 0.26));
    if (walk > 0) {
      const n = Math.floor(band(p, 0.0, 0.2) * 14);
      for (let i = 0; i < n; i++) {
        const k = i / 14;
        const side = i % 2 ? 1 : -1;
        const x = w * (0.3 + k * 0.4) + side * unit * 0.03;
        const y = h * (0.92 - k * 0.75);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(0.5);
        ctx.fillStyle = `rgba(20,14,10,${0.55 * walk})`;
        const f = unit * 0.022;
        ctx.beginPath();
        ctx.ellipse(0, 0, f * 0.8, f * 1.9, 0, 0, Math.PI * 2);
        ctx.fill();
        for (let toe = 0; toe < 5; toe++) {
          ctx.beginPath();
          ctx.arc(-f * 0.6 + toe * f * 0.32, -f * 2.2 + Math.abs(toe - 1) * f * 0.15, f * (toe === 0 ? 0.32 : 0.2), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // B: the fire, with sparks the visitor can stir up
    const fireK = band(p, 0.2, 0.26) * (1 - band(p, 0.62, 0.68));
    if (fireK > 0) {
      const fx = w / 2;
      const fy = h * 0.88;
      const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, unit * 0.6);
      glow.addColorStop(0, `rgba(255,150,50,${0.35 * fireK})`);
      glow.addColorStop(1, "rgba(255,80,20,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      if (Math.random() < 0.6) sparks.current.push({ x: fx + rnd(-30, 30), y: fy, vx: rnd(-20, 20), vy: rnd(-120, -60), life: 0, max: rnd(1, 2.5) });
      ctx.globalCompositeOperation = "lighter";
      for (const sp of sparks.current) {
        sp.life += dt;
        sp.vx += Math.sin(t * 3 + sp.y * 0.05) * 30 * dt;
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        const a = (1 - sp.life / sp.max) * fireK;
        ctx.fillStyle = `rgba(255,${180 + Math.random() * 60},80,${a})`;
        ctx.fillRect(sp.x, sp.y, 2, 2);
      }
      ctx.globalCompositeOperation = "source-over";
      sparks.current = sparks.current.filter((sp) => sp.life < sp.max);
    }

    // C: the cave wall, where the visitor can leave a hand stencil
    if (!wall.current || wall.current.width !== Math.round(w) || wall.current.height !== Math.round(h)) {
      wall.current = document.createElement("canvas");
      wall.current.width = Math.round(w);
      wall.current.height = Math.round(h);
    }
    const st = spraying.current;
    if (st) {
      const wctx = wall.current.getContext("2d")!;
      for (let i = 0; i < 260; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.6) * 1.35;
        const lx = Math.cos(a) * r * 0.9;
        const ly = Math.sin(a) * r * 1.05 - 0.1;
        if (inHand(lx, ly)) continue;
        const x = st.x + (lx * Math.cos(st.a) - ly * Math.sin(st.a)) * st.s;
        const y = st.y + (lx * Math.sin(st.a) + ly * Math.cos(st.a)) * st.s;
        const fade = 1 - r / 1.35;
        wctx.fillStyle = `rgba(${150 + Math.random() * 40},${40 + Math.random() * 25},${20 + Math.random() * 15},${0.35 * fade})`;
        wctx.fillRect(x, y, 1.6, 1.6);
      }
      if (t - lastHiss.current > 0.32) {
        lastHiss.current = t;
        sfx("stencil");
      }
    }
    const wallK = band(p, 0.62, 0.68);
    if (wallK > 0) {
      ctx.globalAlpha = wallK;
      ctx.drawImage(wall.current, 0, 0, w, h);
      ctx.globalAlpha = 1;
    }
  });

  const down = (e: React.PointerEvent) => {
    const p = s.progress.current ?? 0;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (p > 0.2 && p < 0.64) {
      for (let i = 0; i < 40; i++) sparks.current.push({ x, y, vx: rnd(-90, 90), vy: rnd(-200, -40), life: 0, max: rnd(0.6, 1.6) });
      sfx("spark");
    } else if (p >= 0.64) {
      spraying.current = { x, y, a: rnd(-0.5, 0.5), s: Math.min(r.width, r.height) * 0.11 };
    }
  };
  const autoHand = () => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    spraying.current = { x: rnd(0.25, 0.75) * W, y: rnd(0.3, 0.6) * H, a: rnd(-0.5, 0.5), s: Math.min(W, H) * 0.11 };
    setTimeout(up, 1400);
  };
  const up = () => {
    if (spraying.current) {
      spraying.current = null;
      made.current += 1;
      setHandsMade(made.current);
    }
  };

  return (
    <>
      <MediaImage ref={laetoli} id="laetoli" className="scene-layer" kenburns />
      <MediaVideo ref={fire} id="campfire" className="scene-layer" style={{ opacity: 0 }} play={fireOn && s.active} />
      <MediaImage ref={hands} id="hands" className="scene-layer" style={{ opacity: 0 }} />
      <canvas ref={canvas} className="scene-canvas" onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} aria-hidden="true" />
      {s.beat === 1 ? (
        <button type="button" className="scene-action" onClick={() => { for (let i = 0; i < 60; i++) sparks.current.push({ x: window.innerWidth / 2, y: window.innerHeight * 0.85, vx: rnd(-120, 120), vy: rnd(-260, -60), life: 0, max: rnd(0.6, 1.8) }); sfx("spark"); }}>
          <span className="pulse-dot" aria-hidden="true" /> Stir the fire
        </button>
      ) : null}
      {s.beat === 3 ? (
        <>
          <p className="scene-counter">{handsMade ? `You have left ${handsMade} hand${handsMade > 1 ? "s" : ""} on the wall.` : "Press and hold anywhere on the wall."}</p>
          <button type="button" className="scene-action" onClick={autoHand}>
            <span className="pulse-dot" aria-hidden="true" /> Leave a hand
          </button>
        </>
      ) : null}
    </>
  );
}
