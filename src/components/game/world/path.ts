import * as THREE from "three";

/**
 * The universe map is one long, winding road through space. Each of the
 * seven levels is a glowing portal on that road, in time order: the further
 * you fly, the later in the story you are.
 *
 * Everything here is plain maths (no React, no WebGL), so it can be tested.
 */

/** Distance between two portals along the road, in world units. */
export const PORTAL_GAP = 16;
/** How close (centre to camera) counts as flying into a portal. */
export const ENTER_RADIUS = 1.7;
/** How close the HUD starts talking about a portal. */
export const NEAR_RADIUS = 10;
/** How far from the road the player may drift before space gently pushes back. */
export const ROAD_WIDTH = 13;

/** Where portal `i` sits. A slow S-bend, so the next portal peeks out from the side. */
export function portalPosition(i: number, out = new THREE.Vector3()) {
  return out.set(Math.sin(i * 1.15) * 5.5, Math.sin(i * 0.8 + 0.6) * 2.4, -i * PORTAL_GAP);
}

/** The road: a smooth curve through every portal, with a lead-in before the first. */
export function makeRoad(portals: number) {
  const pts: THREE.Vector3[] = [new THREE.Vector3(0, 0.8, PORTAL_GAP * 0.9)];
  for (let i = 0; i < portals; i++) pts.push(portalPosition(i));
  pts.push(portalPosition(portals - 1).add(new THREE.Vector3(0, 0, -PORTAL_GAP * 0.8)));
  return new THREE.CatmullRomCurve3(pts, false, "centripetal");
}

/** A good place to hover while looking at portal `i`: a little in front of it, on the road. */
export function viewpoint(i: number, out = new THREE.Vector3()) {
  return portalPosition(i, out).add(new THREE.Vector3(0, 0.7, 8));
}

/** Index and distance of the portal nearest to `p`. */
export function nearestPortal(p: THREE.Vector3, portals: number) {
  const tmp = new THREE.Vector3();
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < portals; i++) {
    const d = portalPosition(i, tmp).distanceTo(p);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return { index: best, distance: bestD };
}

/**
 * Keeps the player near the road: returns how far past the edge `p` is
 * (0 when inside), and writes the direction back to the road into `push`.
 */
export function outsideRoad(p: THREE.Vector3, road: THREE.CatmullRomCurve3, push: THREE.Vector3, samples = 120) {
  const tmp = new THREE.Vector3();
  let bestD = Infinity;
  for (let s = 0; s <= samples; s++) {
    road.getPoint(s / samples, tmp);
    const d = tmp.distanceToSquared(p);
    if (d < bestD) {
      bestD = d;
      push.copy(tmp);
    }
  }
  const d = Math.sqrt(bestD);
  push.sub(p).normalize();
  return Math.max(0, d - ROAD_WIDTH);
}

/** Frame-rate independent smoothing factor: how much of the gap to close this frame. */
export const ease = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
