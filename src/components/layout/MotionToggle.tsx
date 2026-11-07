"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "journey:motion";

/**
 * Lets the visitor reduce motion explicitly, on top of the OS-level
 * `prefers-reduced-motion` setting (which is always respected).
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(document.documentElement.getAttribute("data-motion") === "reduce");
  }, []);

  function toggle() {
    const next = !reduced;
    setReduced(next);
    const root = document.documentElement;
    if (next) root.setAttribute("data-motion", "reduce");
    else root.removeAttribute("data-motion");
    try {
      if (next) localStorage.setItem(STORAGE_KEY, "reduce");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable: preference lasts for this page view */
    }
    // Reveal anything that was waiting for an animation.
    if (next) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", ""));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={reduced}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-muted hover:text-text-light transition-colors ${className}`}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        {reduced ? (
          <path d="M5 12h14" strokeLinecap="round" />
        ) : (
          <path d="M3 12c3-6 6-6 9 0s6 6 9 0" strokeLinecap="round" />
        )}
      </svg>
      <span>{reduced ? "Motion reduced" : "Reduce motion"}</span>
    </button>
  );
}
