"use client";

import { useEffect, useState } from "react";
import type { Level } from "./levels";
import type { Sfx } from "./sound-engine";

const TAPS = 5;

/**
 * The simple mode for devices without WebGL: a bold, flat picture of the
 * level that changes with each tap. Same goals, quiz and stars as the 3D game.
 */
export function FlatScene({ level, onProgress, onWin, sfx }: { level: Level; onProgress: (p: number) => void; onWin: () => void; sfx: (n: Sfx) => void }) {
  const [taps, setTaps] = useState(0);
  useEffect(() => onProgress(taps / TAPS), [taps, onProgress]);
  useEffect(() => {
    if (taps < TAPS) return;
    const t = window.setTimeout(onWin, 700);
    return () => window.clearTimeout(t);
  }, [taps, onWin]);

  return (
    <div className="flat" style={{ "--k": taps / TAPS } as React.CSSProperties} data-level={level.id}>
      <div className="flat-art" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <button
        type="button"
        className="btn btn-big flat-btn"
        disabled={taps >= TAPS}
        onClick={() => {
          sfx(taps + 1 >= TAPS ? "shimmer" : "spark");
          setTaps((n) => n + 1);
        }}
      >
        {taps >= TAPS ? "Done!" : `Tap! (${TAPS - taps} to go)`}
      </button>
    </div>
  );
}
