"use client";

import { useEffect, useRef } from "react";
import { isTouch, prefersStill } from "@/components/motion/motion-pref";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Turns scrolling down into the reel sliding from right to left. The page
 * gets exactly as tall as the reel is wide, the stage sticks under the
 * header, and the row moves sideways. Cards lean a little with speed and
 * their pictures drift for depth. Keyboard focus scrolls to the right spot.
 * With reduced motion it stays a plain sideways-scrolling row.
 */
export function ReelTrack({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = stage.current;
    const tr = track.current;
    const reel = wrap.current;
    if (!st || !tr || !reel || prefersStill()) return;
    reel.setAttribute("data-live", "");
    const touch = isTouch();
    let distance = 0;
    let stageH = 0;
    let topOffset = 0;

    const measure = () => {
      tr.style.transform = "";
      stageH = st.clientHeight;
      topOffset = parseFloat(getComputedStyle(st).top) || 0;
      distance = Math.max(0, tr.scrollWidth - st.clientWidth);
      reel.style.setProperty("--reel-h", `${Math.round(distance + stageH)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(st);
    ro.observe(tr);

    const cards = Array.from(tr.querySelectorAll<HTMLElement>(".reel-media"));
    let x = 0;
    let raf = 0;
    let visible = false;
    const loop = () => {
      raf = 0;
      if (!visible) return;
      const r = reel.getBoundingClientRect();
      const span = Math.max(1, r.height - stageH);
      const p = clamp((topOffset - r.top) / span, 0, 1);
      const target = -p * distance;
      const prev = x;
      x = touch ? target : x + (target - x) * 0.18;
      if (Math.abs(target - x) < 0.1) x = target;
      const v = x - prev;
      tr.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) skewX(${clamp(v * 0.06, -3, 3).toFixed(2)}deg)`;
      if (!touch) {
        const vw = st.clientWidth;
        for (const c of cards) {
          const b = c.getBoundingClientRect();
          if (b.right < -50 || b.left > vw + 50) continue;
          const off = (b.left + b.width / 2 - vw / 2) / vw;
          (c.firstElementChild as HTMLElement | null)?.style.setProperty("transform", `translate3d(${(-off * 8).toFixed(2)}%, 0, 0) scale(1.18)`);
        }
      }
      st.style.setProperty("--reel-p", p.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(reel);

    // Tabbing to a link inside the reel scrolls the page to where its card is in view.
    const onFocus = (e: FocusEvent) => {
      const panel = (e.target as HTMLElement).closest?.(".reel-panel") as HTMLElement | null;
      if (!panel || !distance) return;
      st.scrollLeft = 0;
      const want = clamp(panel.offsetLeft - (st.clientWidth - panel.offsetWidth) / 2, 0, distance);
      const top = reel.getBoundingClientRect().top + scrollY - topOffset + (want / distance) * (reel.offsetHeight - stageH);
      window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    };
    tr.addEventListener("focusin", onFocus);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      tr.removeEventListener("focusin", onFocus);
      reel.removeAttribute("data-live");
      reel.style.removeProperty("--reel-h");
      tr.style.transform = "";
    };
  }, []);

  return (
    <div ref={wrap} className="reel-scroll">
      <div ref={stage} className="reel-stage">
        <div ref={track} className="reel-track">
          {children}
        </div>
      </div>
    </div>
  );
}
