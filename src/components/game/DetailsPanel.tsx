"use client";

import { useEffect, useRef } from "react";
import { getSource } from "@/data/sources";
import type { Moment } from "./moments";

/**
 * "Learn more": the longer explanation and the proof behind a moment.
 * Kept out of the way so the journey stays a journey; one tap opens it.
 */
export function DetailsPanel({ moment: level, open, onClose }: { moment: Moment; open: boolean; onClose: () => void }) {
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
            {level.when}
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
          What you saw is a simulation made for this journey. It shows the idea, not a real photo or an exact model.
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
