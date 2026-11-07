"use client";

import { useRef, useState } from "react";
import { useExperience } from "../ExperienceContext";
import { MediaImage, MediaVideo, useScrub } from "../Media";
import type { SceneState } from "../SceneShell";
import { band } from "../useCanvasLoop";

export function WorldScene({ s }: { s: SceneState }) {
  const { sfx } = useExperience();
  const rise = useRef<HTMLDivElement>(null);
  const night = useRef<HTMLDivElement>(null);
  const marble = useRef<HTMLDivElement>(null);
  const [nightOn, setNightOn] = useState(false);
  const [fast, setFast] = useState(false);

  useScrub(s.progress, s.active, (p) => {
    if (rise.current) {
      rise.current.style.opacity = String(1 - band(p, 0.26, 0.32));
      rise.current.style.transform = `translateY(${(0.3 - p) * 8}%) scale(1.1)`;
    }
    const n = String(band(p, 0.26, 0.32));
    if (night.current) night.current.style.opacity = n;
    if (marble.current) marble.current.style.opacity = n;
    const on = p > 0.2;
    if (on !== nightOn) setNightOn(on);
  });

  const hold = (on: boolean) => {
    if (on && !fast) sfx("whoosh");
    setFast(on);
  };

  return (
    <>
      <MediaImage ref={rise} id="earthrise" className="scene-layer" />
      <MediaImage ref={marble} id="black-marble" className="scene-layer" style={{ opacity: 0 }} kenburns />
      <MediaVideo ref={night} id="city-lights" className="scene-layer" style={{ opacity: 0 }} play={nightOn && s.active} rate={fast ? 4 : 1} />
      <div
        className="scene-canvas"
        aria-hidden="true"
        onPointerDown={() => (s.progress.current ?? 0) > 0.28 && hold(true)}
        onPointerUp={() => hold(false)}
        onPointerLeave={() => hold(false)}
        onPointerCancel={() => hold(false)}
      />
      {s.beat === 1 ? (
        <button
          type="button"
          className="scene-action"
          aria-pressed={fast}
          onClick={() => hold(!fast)}
        >
          <span className="pulse-dot" aria-hidden="true" /> {fast ? "Back to normal speed" : "Orbit four times faster"}
        </button>
      ) : null}
    </>
  );
}
