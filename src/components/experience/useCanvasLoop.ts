"use client";

import { useEffect, useRef } from "react";

export type Frame = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => void;

/**
 * Runs `frame` every animation frame while the canvas is on screen. The canvas
 * is sized to its box at up to 2x pixel density (1.25x on touch screens). Drawing uses CSS pixels.
 */
export function useCanvasLoop(frame: Frame, opts: { maxDpr?: number } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(frame);
  frameRef.current = frame;
  // Phones have tiny pixels and small GPUs: a full-screen canvas at 3x is ~9x the
  // work for little visible gain, so touch screens draw at up to 1.25x.
  const maxDpr = opts.maxDpr ?? (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches ? 1.25 : 2);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let last = performance.now();
    const t0 = last;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frameRef.current(ctx, w, h, (now - t0) / 1000, dt);
      raf = requestAnimationFrame(loop);
    };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    size();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible) {
          visible = true;
          last = performance.now();
          raf = requestAnimationFrame(loop);
        } else if (!e.isIntersecting && visible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [maxDpr]);

  return ref;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0 before a, 1 after b, smooth in between. */
export const band = (p: number, a: number, b: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const rnd = (a: number, b: number) => a + Math.random() * (b - a);
