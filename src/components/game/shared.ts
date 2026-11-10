import * as THREE from "three";
import type { Quality } from "./quality";
import type { Sfx } from "./sound-engine";

/** What the game hands every level scene. */
export type SceneProps = {
  quality: Quality;
  /** 0 to 1, drives the progress bar. */
  onProgress: (p: number) => void;
  /** Call once, after the level's finale has played. */
  onWin: () => void;
  /** Extra live info for the HUD, such as which element the star is making. */
  onStatus: (s: SceneStatus | null) => void;
  sfx: (name: Sfx) => void;
  /** True when the player asked for less motion: no flashes or shaking. */
  still: boolean;
};

export type SceneStatus = { label: string; chips?: { text: string; title: string; on: boolean }[] };

let glow: THREE.Texture | null = null;

/** A soft round dot, used for every glowing particle and halo. Made once, in code. */
export function glowTexture(): THREE.Texture {
  if (glow) return glow;
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.2, "rgba(255,255,255,0.85)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.25)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  glow = new THREE.CanvasTexture(c);
  glow.colorSpace = THREE.SRGBColorSpace;
  return glow;
}

/** Random point inside a unit sphere. */
export function randomInSphere(out: THREE.Vector3, r = 1) {
  const u = Math.random();
  const dir = out.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
  return dir.multiplyScalar(Math.cbrt(u) * r);
}

/** Builds a BufferGeometry of points with colours. */
export function pointCloud(n: number, place: (i: number, p: THREE.Vector3, c: THREE.Color) => void) {
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const p = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    place(i, p, c);
    pos.set([p.x, p.y, p.z], i * 3);
    col.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return geo;
}

export const damp = THREE.MathUtils.damp;
