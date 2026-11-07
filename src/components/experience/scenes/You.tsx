"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band, lerp, rnd, useCanvasLoop } from "../useCanvasLoop";

type Mote = { x: number; y: number; ox: number; oy: number; ph: number; s: number };

const fmt = (n: number, d = 0) => n.toLocaleString("en-GB", { maximumFractionDigits: d, minimumFractionDigits: d });

function lifeFacts(year: number) {
  const now = new Date();
  const age = now.getFullYear() + now.getMonth() / 12 - (year + 0.5);
  if (!(age > 0 && age < 125)) return null;
  const minutes = age * 365.25 * 24 * 60;
  return {
    age,
    orbits: Math.floor(age),
    km: age * 940e6, // one orbit of the Sun is about 940 million km
    beats: minutes * 80,
    cosmicSeconds: (age / 13.8e9) * 365.25 * 86400, // Sagan's cosmic calendar
  };
}

export function YouScene({ s }: { s: SceneState }) {
  const { sfx } = useExperience();
  const dot = useRef<HTMLDivElement>(null);
  const motes = useRef<Mote[]>([]);
  const [year, setYear] = useState("");
  const [facts, setFacts] = useState<ReturnType<typeof lifeFacts>>(null);
  const [err, setErr] = useState("");

  useScrub(s.progress, s.active, (p) => {
    if (dot.current) {
      dot.current.style.opacity = String(1 - band(p, 0.46, 0.56) * 0.75);
      dot.current.style.transform = `scale(${1 + p * 0.35})`;
    }
  });

  const canvas = useCanvasLoop((ctx, w, h, t) => {
    const p = s.progress.current ?? 0;
    ctx.clearRect(0, 0, w, h);
    const gather = band(p, 0.5, 0.74);
    if (gather <= 0) return;
    if (!motes.current.length) motes.current = Array.from({ length: w < 700 ? 400 : 800 }, () => ({ x: Math.random(), y: Math.random(), ox: rnd(-1, 1), oy: rnd(-1, 1), ph: rnd(0, 6), s: rnd(0.6, 2) }));
    const cx = w / 2;
    const cy = h * 0.42;
    const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI)), 12); // about one beat a second
    const R = Math.min(w, h) * (0.05 + beat * 0.02);
    ctx.globalCompositeOperation = "lighter";
    for (const m of motes.current) {
      const tx = cx + m.ox * R * (1 + Math.sin(t + m.ph) * 0.2);
      const ty = cy + m.oy * R * (1 + Math.cos(t + m.ph) * 0.2);
      const x = lerp(m.x * w, tx, gather);
      const y = lerp(m.y * h, ty, gather);
      ctx.fillStyle = `rgba(255,${200 + m.s * 20},${150 + m.s * 40},${0.25 + gather * 0.4})`;
      ctx.fillRect(x, y, m.s, m.s);
    }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 3);
    g.addColorStop(0, `rgba(255,220,180,${gather * (0.25 + beat * 0.35)})`);
    g.addColorStop(1, "rgba(255,180,120,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - R * 3, cy - R * 3, R * 6, R * 6);
    ctx.globalCompositeOperation = "source-over";
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const f = lifeFacts(Number(year));
    if (!f) {
      setErr("Enter a year between 1900 and this year.");
      setFacts(null);
      return;
    }
    setErr("");
    setFacts(f);
    sfx("chime");
  };

  return (
    <>
      <MediaImage ref={dot} id="pale-blue-dot" className="scene-layer" />
      <canvas ref={canvas} className="scene-canvas" aria-hidden="true" />
      {s.beat >= 3 ? (
        <div className="you-panel">
          <form onSubmit={submit} className="you-form">
            <label htmlFor="you-year">What year were you born?</label>
            <div>
              <input id="you-year" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))} placeholder="1995" />
              <button type="submit">Show me</button>
            </div>
            {err ? <p role="alert" className="you-err">{err}</p> : null}
          </form>
          {facts ? (
            <ul className="you-facts" aria-live="polite">
              <li>
                <strong>{fmt(facts.orbits)}</strong> trips around the Sun, about <strong>{fmt(facts.km / 1e9, 1)} billion km</strong> through space.
              </li>
              <li>
                Your heart has beaten about <strong>{fmt(facts.beats / 1e9, 1)} billion</strong> times (at 80 beats a minute).
              </li>
              <li>
                If all 13.8 billion years were squeezed into one year, your life so far would be the last <strong>{fmt(facts.cosmicSeconds, 2)} seconds</strong> of 31 December.
              </li>
            </ul>
          ) : null}
          <div className="you-actions">
            <button type="button" className="scene-action-inline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Begin again
            </button>
            <Link href="/journey/" className="scene-action-inline ghost">
              Read the full story
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
