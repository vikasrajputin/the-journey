"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useExperience } from "./ExperienceContext";
import type { SceneDef } from "./scene-data";

export type SceneState = {
  progress: React.RefObject<number>;
  active: boolean;
  beat: number;
};

/**
 * One chapter of the experience: a tall section with a sticky full-screen
 * stage. Scrolling moves through the scene's beats; nothing hijacks the scroll.
 */
export function SceneShell({
  def,
  onReport,
  children,
}: {
  def: SceneDef;
  onReport: (id: string, beat: number, active: boolean) => void;
  children: (s: SceneState) => React.ReactNode;
}) {
  const { media } = useExperience();
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [beat, setBeat] = useState(0);
  const [active, setActive] = useState(false);
  const reportRef = useRef(onReport);
  reportRef.current = onReport;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let lastBeat = -1;
    let lastActive: boolean | null = null;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      progress.current = p;
      let b = 0;
      def.beats.forEach((bt, i) => {
        if (p >= bt.at) b = i;
      });
      const isActive = r.top <= vh * 0.5 && r.bottom >= vh * 0.5;
      if (b !== lastBeat) {
        lastBeat = b;
        setBeat(b);
      }
      if (isActive !== lastActive) {
        lastActive = isActive;
        setActive(isActive);
      }
      if (isActive) reportRef.current(def.id, b, true);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [def]);

  const credits = def.media.map((id) => media[id]).filter(Boolean);

  return (
    <section
      ref={ref}
      id={def.id}
      data-theme={def.theme}
      aria-labelledby={`${def.id}-title`}
      className="scene"
      style={{ height: `${def.length * 100}svh` }}
      data-active={active || undefined}
    >
      <div className="scene-stage">
        {children({ progress, active, beat })}
        <div className="scene-vignette" aria-hidden="true" />

        <header className="scene-head">
          <p className="scene-eyebrow">
            Chapter {def.number} <span aria-hidden="true">·</span> {def.beats[beat]?.when ?? def.beats[0].when}
          </p>
          <h2 id={`${def.id}-title`} className="scene-title" tabIndex={-1}>
            {def.title}
          </h2>
        </header>

        <div className="scene-captions">
          {def.beats.map((b, i) => (
            <p key={i} className="scene-caption" data-on={i === beat || undefined}>
              {b.text}
            </p>
          ))}
        </div>

        <div className="scene-foot">
          <Link href={`/journey/${def.chapter}/`} className="scene-deeper">
            Go deeper <span aria-hidden="true">→</span>
            <span className="sr-only">: read chapter {def.number}, {def.title}</span>
          </Link>
          {credits.length ? (
            <details className="scene-credits">
              <summary>Credits</summary>
              <ul>
                {credits.map((m) => (
                  <li key={m.id}>
                    <a href={m.page} target="_blank" rel="noopener noreferrer">
                      {m.kind === "video" ? "Video" : "Photo"}: {m.credit}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
                {def.note ? <li>{def.note}</li> : null}
              </ul>
            </details>
          ) : null}
        </div>
      </div>
    </section>
  );
}
