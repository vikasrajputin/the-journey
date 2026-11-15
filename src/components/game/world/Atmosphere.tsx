"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Quality } from "../quality";

/*
 * The "air" of space, shared by the universe map and every level:
 *
 *  - Nebula: a huge sphere that always sits around the camera, painted in the
 *    shader with soft, slowly drifting clouds of bold colour. Because it moves
 *    with the camera it looks infinitely far away, like a sky.
 *  - Dust: thousands of tiny specks in a box that wraps around the camera, so
 *    there is always something drifting past. Near specks slide by quickly and
 *    far ones slowly, which is what makes the scene feel deep (parallax).
 *
 * Both are made entirely in code: no image files.
 */

const NOISE = /* glsl */ `
float hash3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x) {
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int k = 0; k < 5; k++) { s += a * vnoise(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }
`;

const NEBULA_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww; // always on the far plane, behind everything
}`;

const NEBULA_FRAG = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uDeep;
uniform float uTime; uniform float uGain;
varying vec3 vDir;
${NOISE}
void main() {
  vec3 d = normalize(vDir);
  // two layers of cloud drifting at different speeds, warped by a third
  vec3 q = d * 2.2 + vec3(0.0, uTime * 0.012, uTime * 0.008);
  float w = fbm(q * 0.8 + 3.1);
  float n1 = fbm(q + w * 1.6);
  float n2 = fbm(q * 1.7 - w + 7.3 + uTime * 0.01);
  float band = exp(-pow(d.y * 1.6 + sin(d.x * 2.0 + d.z) * 0.35, 2.0)); // a soft "milky way" band
  vec3 col = uDeep;
  col += uA * smoothstep(0.42, 0.85, n1) * (0.35 + 0.65 * band);
  col += uB * smoothstep(0.5, 0.95, n2) * 0.9;
  col += uC * pow(smoothstep(0.55, 1.0, n1 * n2 * 1.9), 2.0) * 1.2 * band;
  // tiny faraway stars, sharp and sparse
  vec3 g = d * 260.0; vec3 cell = floor(g);
  float h = hash3(cell);
  float st = step(0.985, h) * smoothstep(0.42, 0.0, length(fract(g) - 0.5)) * (0.6 + 0.4 * sin(uTime * 2.0 + h * 50.0));
  col += vec3(st) * 0.9;
  gl_FragColor = vec4(col * uGain, 1.0);
}`;

export type Palette = { a: string; b: string; c: string; deep: string };

/** Bold sky colours. Levels pass their own, the map uses the default. */
export const SKY: Palette = { a: "#7a2cff", b: "#ff2f8e", c: "#38e8ff", deep: "#05010f" };

export function Nebula({ palette = SKY, gain = 1 }: { palette?: Palette; gain?: number }) {
  const camera = useThree((s) => s.camera);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: NEBULA_VERT,
        fragmentShader: NEBULA_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
        fog: false,
        uniforms: {
          uA: { value: new THREE.Color() },
          uB: { value: new THREE.Color() },
          uC: { value: new THREE.Color() },
          uDeep: { value: new THREE.Color() },
          uTime: { value: 0 },
          uGain: { value: 0 },
        },
      }),
    [],
  );
  useEffect(() => {
    (mat.uniforms.uA.value as THREE.Color).set(palette.a);
    (mat.uniforms.uB.value as THREE.Color).set(palette.b);
    (mat.uniforms.uC.value as THREE.Color).set(palette.c);
    (mat.uniforms.uDeep.value as THREE.Color).set(palette.deep);
  }, [mat, palette.a, palette.b, palette.c, palette.deep]);
  useEffect(() => () => mat.dispose(), [mat]);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    // ease towards the wanted brightness, so a new level's sky fades in
    mat.uniforms.uGain.value += (gain - mat.uniforms.uGain.value) * (1 - Math.exp(-dt * 2));
    ref.current?.position.copy(camera.position);
  });
  return (
    <mesh ref={ref} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[90, 48, 32]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

const DUST_VERT = /* glsl */ `
uniform vec3 uCam; uniform float uBox; uniform float uTime; uniform float uSize; uniform float uStretch;
attribute vec3 color; attribute float seed;
varying vec3 vCol; varying float vFade;
void main() {
  // wrap each speck into a box centred on the camera: endless dust, no popping at the edges
  vec3 drift = vec3(sin(uTime * 0.1 + seed * 6.3), cos(uTime * 0.08 + seed * 4.1), sin(uTime * 0.05 + seed)) * 0.6;
  vec3 p = mod(position + drift - uCam + uBox * 0.5, uBox) - uBox * 0.5;
  float edge = 1.0 - smoothstep(uBox * 0.32, uBox * 0.5, length(p));
  p += uCam;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float near = smoothstep(0.4, 2.2, -mv.z); // fade specks that would hit the lens
  vFade = edge * near * (0.65 + 0.35 * sin(uTime * 1.7 + seed * 40.0));
  vCol = color;
  gl_PointSize = uSize * (0.5 + seed) * (1.0 + uStretch) * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const DUST_FRAG = /* glsl */ `
varying vec3 vCol; varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vCol * a * a * vFade, 1.0);
}`;

const DUST_COLOURS = ["#ffffff", "#9fe8ff", "#ffd36b", "#ff8fd8", "#b69bff"];

/** Endless drifting specks around the camera. `stretch` makes them bigger while flying fast. */
export function Dust({
  quality,
  count = 2600,
  box = 40,
  size = 0.06,
  tint,
  stretch,
}: {
  quality: Quality;
  count?: number;
  box?: number;
  size?: number;
  tint?: string;
  stretch?: { current: number };
}) {
  const camera = useThree((s) => s.camera);
  const n = quality === "high" ? count : Math.round(count * 0.45);
  const geo = useMemo(() => {
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const pal = (tint ? [tint, "#ffffff", ...DUST_COLOURS.slice(1, 3)] : DUST_COLOURS).map((c) => new THREE.Color(c));
    for (let i = 0; i < n; i++) {
      pos.set([(Math.random() - 0.5) * box, (Math.random() - 0.5) * box, (Math.random() - 0.5) * box], i * 3);
      const c = pal[i % pal.length].clone().multiplyScalar(0.5 + Math.random() * 0.6);
      col.set([c.r, c.g, c.b], i * 3);
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    return g;
  }, [n, box, tint]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DUST_VERT,
        fragmentShader: DUST_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uCam: { value: new THREE.Vector3() },
          uBox: { value: box },
          uTime: { value: 0 },
          uSize: { value: size },
          uStretch: { value: 0 },
        },
      }),
    [box, size],
  );
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    (mat.uniforms.uCam.value as THREE.Vector3).copy(camera.position);
    mat.uniforms.uStretch.value = stretch?.current ?? 0;
  });
  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat],
  );
  return <points geometry={geo} material={mat} frustumCulled={false} renderOrder={5} />;
}

/**
 * A sky for a level: always a bold violet-and-cyan cosmos, with the level's own
 * colour mixed in, so every level feels like part of the same universe.
 */
export function paletteFor(accent: string): Palette {
  const b = new THREE.Color(accent).lerp(new THREE.Color("#ff2f8e"), 0.25);
  return { a: "#5b2bff", b: `#${b.getHexString()}`, c: "#38e8ff", deep: "#03010a" };
}
