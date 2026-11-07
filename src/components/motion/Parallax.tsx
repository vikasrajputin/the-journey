"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isTouch, prefersStill } from "./motion-pref";

/**
 * Pictures inside a frame drift a little slower than the page as it scrolls,
 * like Lusion's project cards. `data-parallax="0.12"` sets how far. Mouse and
 * trackpad only: phones keep plain, fast native scrolling.
 */
export function Parallax() {
  const pathname = usePathname();
  useEffect(() => {
    if (prefersStill() || isTouch()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!els.length) return;
    const live = new Set<HTMLElement>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) live.add(e.target as HTMLElement);
        else live.delete(e.target as HTMLElement);
      }
    }, { rootMargin: "100px 0px" });
    els.forEach((el) => io.observe(el));
    let raf = 0;
    const loop = () => {
      const vh = innerHeight;
      for (const el of live) {
        const box = el.parentElement!.getBoundingClientRect();
        const k = Number(el.dataset.parallax) || 0.1;
        const off = (box.top + box.height / 2 - vh / 2) / vh; // -1 .. 1 across the screen
        el.style.transform = `translate3d(0, ${(-off * k * box.height).toFixed(1)}px, 0) scale(${1 + k * 1.4})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      els.forEach((el) => (el.style.transform = ""));
    };
  }, [pathname]);
  return null;
}
