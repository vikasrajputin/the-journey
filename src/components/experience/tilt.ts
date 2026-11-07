/**
 * Shared parallax offset, -1 to 1 on each axis. On phones it follows the
 * gyroscope (tilt the phone to look around); with a mouse it follows the
 * pointer. Canvases read `tilt` every frame; photos and film in the active
 * scene are moved directly (never through page-wide CSS variables, which
 * would restyle the whole page every frame).
 */
export const tilt = { x: 0, y: 0 };

let target = { x: 0, y: 0 };
let running = false;
let stop: (() => void) | null = null;

type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

/** iOS asks for motion access, and only inside a tap, so call this from a click. */
export function askMotionPermission() {
  const D = typeof DeviceOrientationEvent !== "undefined" ? (DeviceOrientationEvent as IOSOrientation) : undefined;
  if (D?.requestPermission) return D.requestPermission().catch(() => "denied" as const);
  return Promise.resolve("granted" as const);
}

export function startTilt() {
  if (running || typeof window === "undefined") return;
  running = true;
  const root = document.documentElement;
  let base: { b: number; g: number } | null = null;
  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return;
    // Measure from the way the phone was first held, not from flat on a table.
    base ??= { b: e.beta, g: e.gamma };
    target = { x: Math.max(-1, Math.min(1, (e.gamma - base.g) / 25)), y: Math.max(-1, Math.min(1, (e.beta - base.b) / 25)) };
  };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    target = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
  };
  let raf = 0;
  let wx = NaN;
  let wy = NaN;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const still = root.hasAttribute("data-motion") || reduce.matches;
    const tx = still ? 0 : target.x;
    const ty = still ? 0 : target.y;
    tilt.x += (tx - tilt.x) * 0.08;
    tilt.y += (ty - tilt.y) * 0.08;
    // Only touch the page when the shift is big enough to see (about 0.1px).
    if (Math.abs(tilt.x - wx) < 0.006 && Math.abs(tilt.y - wy) < 0.006) return;
    wx = tilt.x;
    wy = tilt.y;
    const t = `${(-tilt.x * 16).toFixed(1)}px ${(-tilt.y * 16).toFixed(1)}px`;
    root.querySelectorAll<HTMLElement>(".scene[data-active] .parallax").forEach((el) => (el.style.translate = t));
  };
  window.addEventListener("deviceorientation", onOrient);
  window.addEventListener("pointermove", onPointer, { passive: true });
  raf = requestAnimationFrame(loop);
  stop = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("deviceorientation", onOrient);
    window.removeEventListener("pointermove", onPointer);
    running = false;
  };
}

export function stopTilt() {
  stop?.();
  stop = null;
}

/** A short buzz on phones that support it (Android). Never when motion is reduced. */
export function buzz(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (document.documentElement.hasAttribute("data-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
