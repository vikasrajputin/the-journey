"use client";

import { useEffect, useRef } from "react";
import { isTouch, prefersStill } from "./motion-pref";

const INTERACTIVE = "a, button, [role='button'], input, label, summary, .magnetic";

/**
 * A soft follower cursor for mice (the system cursor stays visible), and
 * "magnetic" buttons that lean toward the pointer. Nothing on touch screens.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    const r = ring.current!;
    const d = dot.current!;
    let x = -100, y = -100, rx = -100, ry = -100, scale = 1, ts = 1;
    let raf = 0;
    let mag: HTMLElement | null = null;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        document.documentElement.setAttribute("data-cursor", "");
      }
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      ts = target ? 2.2 : 1;
      const m = (e.target as Element | null)?.closest?.(".magnetic, .gate-primary, .gate-secondary, .scene-proof, .scene-deeper, .hud-btn, .scene-action-inline") as HTMLElement | null;
      if (mag && mag !== m) {
        mag.style.translate = "";
        mag = null;
      }
      if (m && !prefersStill()) {
        const b = m.getBoundingClientRect();
        const dx = (x - (b.left + b.width / 2)) * 0.25;
        const dy = (y - (b.top + b.height / 2)) * 0.35;
        m.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
        mag = m;
      }
    };
    const onLeave = () => {
      shown = false;
      document.documentElement.removeAttribute("data-cursor");
      if (mag) mag.style.translate = "";
      mag = null;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!shown) return;
      const k = prefersStill() ? 1 : 0.18;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      scale += (ts - scale) * 0.2;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      d.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeAttribute("data-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
