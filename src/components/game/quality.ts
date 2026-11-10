/**
 * Picks how much 3D work the device can take.
 *
 * - "high": desktops and strong laptops. Bloom glow, sharper canvas, more particles.
 * - "low": phones, tablets and weaker machines. No post-processing, canvas DPR at most
 *   1.25, and fewer particles. The game plays the same, it just looks a little simpler.
 *
 * The player can switch between them, and the game also drops to "low" by itself
 * if the frame rate falls.
 */
export type Quality = "high" | "low";

export function detectQuality(): Quality {
  if (typeof window === "undefined") return "low";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (coarse || cores <= 4 || memory <= 4) return "low";
  return "high";
}

/** True when the browser can draw WebGL at all. Without it the game uses its 2D mode. */
export function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Scales a particle count for the quality tier. */
export const count = (quality: Quality, high: number) => (quality === "high" ? high : Math.round(high * 0.4));
