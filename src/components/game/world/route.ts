import * as THREE from "three";

/**
 * The path the camera drifts along: one long, gently winding line through
 * space, with the seven moments of Chapter 1 placed on it in time order.
 * The camera flies through each moment, so the scene happens all around you.
 *
 * Plain maths only (no React, no WebGL), so it can be unit tested.
 */

/** Space between two moments, in world units. */
export const GAP = 46;
/** Where the journey starts, before the first moment. */
export const LEAD_IN = 34;
/** Room after the last moment for the ending. */
export const LEAD_OUT = 22;

/** Centre of moment `i`. */
export function stationPosition(i: number, out = new THREE.Vector3()) {
  return out.set(Math.sin(i * 1.3) * 7, Math.sin(i * 0.9 + 0.4) * 3, -i * GAP);
}

export function makeRoute(count: number) {
  const pts: THREE.Vector3[] = [new THREE.Vector3(0, 1, LEAD_IN)];
  const tmp = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    // a point before each moment lines the camera up to fly straight through it
    const p = stationPosition(i, tmp).clone();
    pts.push(p.clone().add(new THREE.Vector3(0, 0, 14)));
    pts.push(p);
  }
  pts.push(stationPosition(count - 1, tmp).clone().add(new THREE.Vector3(0, 2, -LEAD_OUT)));
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const length = curve.getLength();
  // distance along the route at which the camera reaches each moment
  const at: number[] = [];
  const N = 4000;
  for (let i = 0; i < count; i++) {
    const c = stationPosition(i, tmp).clone();
    let best = 0;
    let bestD = Infinity;
    for (let k = 0; k <= N; k++) {
      const d = curve.getPointAt(k / N).distanceToSquared(c);
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    }
    at.push((best / N) * length);
  }
  return { curve, length, at };
}

export type Route = ReturnType<typeof makeRoute>;

/**
 * How far moment `i` has played, from 0 (still far away) to 1 (you are in it),
 * given how far along the route the camera is. It starts 30 units before the
 * moment and finishes a few units before its centre.
 */
export function phaseOf(route: Route, i: number, d: number) {
  const rel = route.at[i] - d;
  return THREE.MathUtils.clamp(1 - (rel - 3) / 27, 0, 1);
}

/** Which moment the camera is in or approaching, or -1 at the very start. */
export function activeMoment(route: Route, d: number) {
  let k = -1;
  for (let i = 0; i < route.at.length; i++) if (d > route.at[i] - 30) k = i;
  return k;
}

/**
 * Drift speed multiplier: the camera slows down while a moment plays, so
 * there is time to watch it, and speeds up between moments.
 */
export function dwell(route: Route, d: number) {
  let f = 1;
  for (const a of route.at) {
    const rel = a - d;
    const inShow = THREE.MathUtils.smoothstep(rel, -6, 2) * (1 - THREE.MathUtils.smoothstep(rel, 18, 30));
    f = Math.min(f, 1 - 0.7 * inShow);
  }
  return f;
}

/** Where to glide to when the visitor jumps to moment `i`: just as it starts playing. */
export const arrival = (route: Route, i: number) => Math.max(0, route.at[i] - 30);

export const ease = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
