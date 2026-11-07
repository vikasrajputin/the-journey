"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `data-revealed` to `[data-reveal]` elements as they enter the viewport.
 * Elements are fully visible without JavaScript, and when motion is reduced.
 * Each element reveals once and never changes scroll position.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-motion") === "reduce";

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => observer.observe(el));

    // If the page was opened at an anchor, reveal everything above it immediately.
    const safety = window.setTimeout(() => {
      els.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute("data-revealed", "");
      });
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
