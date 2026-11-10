"use client";

import { useEffect, useRef } from "react";
import { getSource } from "@/data/sources";
import type { Level } from "./levels";

/**
 * "Learn more": the longer explanation and the proof behind a level.
 * Kept out of the way so the game stays a game; one tap opens it.
 */
export function DetailsPanel({ level, open, onClose }: { level: Level; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="details"
      aria-labelledby="details-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      data-lenis-prevent
      style={{ "--c": level.color } as React.CSSProperties}
    >
      <div className="details-inner">
        <div className="details-head">
          <p className="details-kicker">
            Level {level.number} · {level.when}
          </p>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <h2 id="details-title" className="details-title">{level.name}</h2>
        {level.details.map((p) => (
          <p key={p} className="details-p">
            {p}
          </p>
        ))}
        <p className="details-note">
          The 3D scene in this level is a simulation made for the game. It shows the idea, not a real photo or an exact model.
        </p>
        <h3 className="details-h3">How do we know?</h3>
        <ul className="details-sources">
          {level.sourceIds.map((id) => {
            const s = getSource(id);
            if (!s) return null;
            return (
              <li key={id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <span>{s.organisation}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );
}
