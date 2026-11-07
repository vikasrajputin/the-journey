"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { isTouch, prefersStill } from "./motion-pref";

/**
 * Inertial, eased scrolling for mouse wheels and trackpads. Touch screens keep
 * their native scrolling, which is already smooth and is what phones expect.
 * Off when the visitor prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let raf = 0;
    const start = () => {
      if (lenis || prefersStill() || isTouch()) return;
      // Dialogs and other scrolling boxes keep their own native scrolling.
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), prevent: (node) => !!node.closest?.("dialog, [data-lenis-prevent]") });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
    // In-page links (#chapter) glide instead of jumping.
    const onClick = (e: MouseEvent) => {
      if (!lenis || e.defaultPrevented) return;
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      history.pushState(null, "", url.hash);
      lenis.scrollTo(el, { duration: 1.6 });
      (document.getElementById(el.id + "-title") ?? el).focus?.({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    start();
    const mo = new MutationObserver(() => (prefersStill() ? stop() : start()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      mo.disconnect();
      document.removeEventListener("click", onClick);
      stop();
    };
  }, []);
  return null;
}
