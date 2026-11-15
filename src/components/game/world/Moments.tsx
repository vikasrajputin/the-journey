"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Quality } from "../quality";
import { glowTexture, pointCloud, randomInSphere } from "../shared";
import type { Sfx } from "../sound-engine";

/*
 * The seven moments of Chapter 1, as scenes built right into space.
 *
 * Each scene is driven by one number, `p`: 0 while it is still far ahead,
 * rising to 1 as the camera arrives. The camera flies through the middle of
 * each scene, coming from +z, so things happen all around the visitor.
 * Everything here is a simulation made for this experience, drawn in code.
 */

export type MomentProps = {
  /** Live phase of every moment (0 to 1), written by the journey each frame. */
  phase: { current: number[] };
  index: number;
  quality: Quality;
  still: boolean;
  sfx: (s: Sfx) => void;
};

const ADD = THREE.AdditiveBlending;
const n = (q: Quality, high: number) => (q === "high" ? high : Math.round(high * 0.45));
const ss = THREE.MathUtils.smoothstep;

function useOnce() {
  return useRef(false);
}

/* ------------------------------------------------------------------ 1. The Big Bang */
export function BigBang({ phase, index, quality, still, sfx }: MomentProps) {
  const tex = glowTexture();
  const geo = useMemo(() => {
    const pal = ["#ffffff", "#fff3b0", "#ffb020", "#ff3d7f", "#b05cff", "#3ee0ff"].map((c) => new THREE.Color(c));
    return pointCloud(n(quality, 7000), (_, p, c) => {
      randomInSphere(p, 1);
      const r = p.length();
      c.copy(pal[Math.min(pal.length - 1, Math.floor(r * pal.length * 0.999 + Math.random() * 1.2))]);
    });
  }, [quality]);
  useEffect(() => () => geo.dispose(), [geo]);
  const burst = useRef<THREE.Points>(null);
  const dot = useRef<THREE.Sprite>(null);
  const flash = useRef<THREE.Sprite>(null);
  const fired = useOnce();
  const t0 = useRef(0);
  useFrame((state, dt) => {
    const p = phase.current[index];
    const t = state.clock.elapsedTime;
    if (p > 0.4 && !fired.current) {
      fired.current = true;
      t0.current = t;
      sfx("bang");
    }
    if (p < 0.05 && fired.current) fired.current = false; // travelled back: it can happen again
    const age = fired.current ? t - t0.current : -1;
    if (dot.current) {
      const charge = Math.min(1, p / 0.4);
      const pulse = 1 + Math.sin(t * (3 + charge * 14)) * 0.15 * charge;
      dot.current.visible = age < 0.25;
      dot.current.scale.setScalar((0.6 + charge * 2.4) * pulse);
    }
    if (burst.current) {
      burst.current.visible = age >= 0;
      const r = age >= 0 ? 2 + 26 * (1 - Math.exp(-age * 0.9)) : 0.01;
      burst.current.scale.setScalar(r);
      burst.current.rotation.y += dt * 0.05;
      (burst.current.material as THREE.PointsMaterial).size = 0.14 + 0.5 * Math.exp(-age * 0.8);
    }
    if (flash.current) {
      const f = age >= 0 && !still ? Math.max(0, 1 - age * 1.2) : 0;
      flash.current.visible = f > 0.01;
      flash.current.scale.setScalar(10 + age * 40);
      (flash.current.material as THREE.SpriteMaterial).opacity = f;
    }
  });
  return (
    <group position={[0, 0, -4]}>
      <sprite ref={dot}>
        <spriteMaterial map={tex} color="#fff6d0" transparent depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <sprite ref={flash} visible={false}>
        <spriteMaterial map={tex} color="#ffe9b0" transparent depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <points ref={burst} geometry={geo} visible={false}>
        <pointsMaterial map={tex} vertexColors size={0.3} transparent depthWrite={false} blending={ADD} toneMapped={false} />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ 2. Space stretches */
export function Stretch({ phase, index, quality }: MomentProps) {
  const tex = glowTexture();
  const N = quality === "high" ? 7 : 5;
  const { geo, base, lines } = useMemo(() => {
    const base: number[] = [];
    for (let x = 0; x < N; x++)
      for (let y = 0; y < N; y++)
        for (let z = 0; z < N; z++) {
          const j = () => (Math.random() - 0.5) * 0.5;
          base.push(x - (N - 1) / 2 + j(), (y - (N - 1) / 2) * 0.7 + j(), z - (N - 1) / 2 + j());
        }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(base), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(base.length), 3));
    // faint grid lines between neighbours, to show the space itself
    const seg: number[] = [];
    const idx = (x: number, y: number, z: number) => ((x * N + y) * N + z) * 3;
    for (let x = 0; x < N; x++)
      for (let y = 0; y < N; y++)
        for (let z = 0; z < N; z++)
          for (const [dx, dy, dz] of [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ]) {
            if (x + dx >= N || y + dy >= N || z + dz >= N) continue;
            const a = idx(x, y, z);
            const b = idx(x + dx, y + dy, z + dz);
            seg.push(base[a], base[a + 1], base[a + 2], base[b], base[b + 1], base[b + 2]);
          }
    const lines = new THREE.BufferGeometry();
    lines.setAttribute("position", new THREE.BufferAttribute(new Float32Array(seg), 3));
    return { geo: g, base, lines };
  }, [N]);
  useEffect(
    () => () => {
      geo.dispose();
      lines.dispose();
    },
    [geo, lines],
  );
  const group = useRef<THREE.Group>(null);
  const cold = useMemo(() => new THREE.Color("#bfe6ff"), []);
  const red = useMemo(() => new THREE.Color("#ff3d4f"), []);
  const c = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    const p = phase.current[index];
    const s = 2.2 + ss(p, 0.1, 1) * 5.5;
    if (group.current) group.current.scale.set(s, s, s);
    // far galaxies look redder as space stretches: their light is stretched too
    const col = geo.attributes.color.array as Float32Array;
    for (let i = 0; i < base.length; i += 3) {
      const dist = Math.hypot(base[i], base[i + 1], base[i + 2]) / N;
      c.copy(cold).lerp(red, Math.min(1, dist * 2.2 * ss(p, 0.2, 1)));
      col[i] = c.r;
      col[i + 1] = c.g;
      col[i + 2] = c.b;
    }
    geo.attributes.color.needsUpdate = true;
  });
  return (
    <group ref={group}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#ff3d7f" transparent opacity={0.22} depthWrite={false} blending={ADD} />
      </lineSegments>
      <points geometry={geo}>
        <pointsMaterial map={tex} vertexColors size={0.35} transparent depthWrite={false} blending={ADD} toneMapped={false} />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ 3. The first building blocks */
export function Nuclei({ phase, index, quality }: MomentProps) {
  const tex = glowTexture();
  const clusters = quality === "high" ? 26 : 14;
  const count = clusters * 4;
  const data = useMemo(() => {
    const free: THREE.Vector3[] = [];
    const vel: THREE.Vector3[] = [];
    const slot: THREE.Vector3[] = [];
    const isProton: boolean[] = [];
    const v = new THREE.Vector3();
    for (let k = 0; k < clusters; k++) {
      const centre = randomInSphere(new THREE.Vector3(), 9).multiply(new THREE.Vector3(1.3, 0.8, 1.2));
      if (Math.abs(centre.x) < 1.5 && Math.abs(centre.y) < 1.5) centre.x += 3; // keep the camera's path clear
      const offs = [
        [0.28, 0.28, 0.28],
        [-0.28, -0.28, 0.28],
        [-0.28, 0.28, -0.28],
        [0.28, -0.28, -0.28],
      ];
      for (let j = 0; j < 4; j++) {
        free.push(randomInSphere(new THREE.Vector3(), 10).multiply(new THREE.Vector3(1.3, 0.8, 1.2)));
        vel.push(randomInSphere(v, 1).clone().multiplyScalar(2.2));
        slot.push(centre.clone().add(new THREE.Vector3(...(offs[j] as [number, number, number]))));
        isProton.push(j % 2 === 0);
      }
    }
    return { free, vel, slot, isProton };
  }, [clusters]);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const halos = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const col = new Float32Array(count * 3);
    data.isProton.forEach((pr, i) => col.set(new THREE.Color(pr ? "#ff3d5a" : "#3ea0ff").toArray(), i * 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
    return g;
  }, [count, data]);
  useEffect(() => () => halos.dispose(), [halos]);
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    data.isProton.forEach((pr, i) => m.setColorAt(i, new THREE.Color(pr ? "#ff4a64" : "#4aa8ff").multiplyScalar(1.6)));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [data]);
  const o = useMemo(() => new THREE.Object3D(), []);
  const p3 = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const p = phase.current[index];
    const k = ss(p, 0.25, 0.95);
    const m = mesh.current;
    if (!m) return;
    const hp = halos.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // free particles zoom around inside a soft ball
      const f = data.free[i];
      f.addScaledVector(data.vel[i], dt * (1 - k));
      if (f.length() > 11) data.vel[i].multiplyScalar(-1);
      p3.copy(f).lerp(data.slot[i], k);
      o.position.copy(p3);
      o.scale.setScalar(0.3);
      o.rotation.set(state.clock.elapsedTime * 0.3, i, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      hp.set([p3.x, p3.y, p3.z], i * 3);
    }
    m.instanceMatrix.needsUpdate = true;
    halos.attributes.position.needsUpdate = true;
  });
  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <points geometry={halos}>
        <pointsMaterial map={tex} vertexColors size={1.6} transparent opacity={0.6} depthWrite={false} blending={ADD} toneMapped={false} />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ 4. The fog clears */
export function Fog({ phase, index, quality }: MomentProps) {
  const tex = glowTexture();
  const fog = useMemo(
    () =>
      pointCloud(n(quality, 600), (_, p, c) => {
        p.set((Math.random() - 0.5) * 34, (Math.random() - 0.5) * 20, 18 - Math.random() * 46);
        c.set(Math.random() > 0.5 ? "#ff7a1a" : "#ff4a2a").multiplyScalar(0.07 + Math.random() * 0.06);
      }),
    [quality],
  );
  const sparks = useMemo(
    () =>
      pointCloud(n(quality, 1500), (_, p, c) => {
        p.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 18, 14 - Math.random() * 40);
        c.set("#fff1d6");
      }),
    [quality],
  );
  const stars = useMemo(
    () =>
      pointCloud(n(quality, 2500), (_, p, c) => {
        p.set((Math.random() - 0.5) * 120, (Math.random() - 0.5) * 70, -30 - Math.random() * 40);
        c.set(["#ffffff", "#9fe8ff", "#ffe14d"][Math.floor(Math.random() * 3)]);
      }),
    [quality],
  );
  useEffect(
    () => () => {
      fog.dispose();
      sparks.dispose();
      stars.dispose();
    },
    [fog, sparks, stars],
  );
  const fogM = useRef<THREE.PointsMaterial>(null);
  const sparkM = useRef<THREE.PointsMaterial>(null);
  const sparkP = useRef<THREE.Points>(null);
  const starM = useRef<THREE.PointsMaterial>(null);
  useFrame((state) => {
    const p = phase.current[index];
    const clear = ss(p, 0.45, 0.95);
    if (fogM.current) fogM.current.opacity = 0.9 * (1 - clear) * ss(p, 0, 0.15) + 0.0;
    // electrons buzz about in the fog, then settle into atoms and stop scattering light
    if (sparkP.current) {
      sparkP.current.position.set(Math.sin(state.clock.elapsedTime * 23) * 0.15 * (1 - clear), Math.cos(state.clock.elapsedTime * 19) * 0.15 * (1 - clear), 0);
    }
    if (sparkM.current) sparkM.current.opacity = 0.9 * (1 - clear) * ss(p, 0, 0.15);
    if (starM.current) starM.current.opacity = clear;
  });
  return (
    <group>
      <points geometry={fog}>
        <pointsMaterial ref={fogM} map={tex} vertexColors size={9} transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} fog={false} />
      </points>
      <points ref={sparkP} geometry={sparks}>
        <pointsMaterial ref={sparkM} map={tex} vertexColors size={0.12} transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </points>
      <points geometry={stars}>
        <pointsMaterial ref={starM} map={tex} vertexColors size={0.5} transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} fog={false} />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ 5. The first stars */
const STAR_SPOTS: [number, number, number][] = [
  [-6, 2.5, -2],
  [5.5, -2, -5],
  [-4, -3.5, -9],
  [7, 3.5, -12],
  [-8, 0.5, -15],
];
export function FirstStars({ phase, index, quality, sfx }: MomentProps) {
  const tex = glowTexture();
  const gas = useMemo(
    () =>
      pointCloud(n(quality, 900), (_, p, c) => {
        randomInSphere(p, 2.6);
        c.set(Math.random() > 0.55 ? "#b05cff" : "#ff8fd8").multiplyScalar(0.5 + Math.random() * 0.5);
      }),
    [quality],
  );
  useEffect(() => () => gas.dispose(), [gas]);
  const lit = useRef<boolean[]>(STAR_SPOTS.map(() => false));
  const clouds = useRef<(THREE.Points | null)[]>([]);
  const cores = useRef<(THREE.Group | null)[]>([]);
  useFrame((state, dt) => {
    const p = phase.current[index];
    STAR_SPOTS.forEach((_, i) => {
      // each cloud collapses in turn, then switches on
      const k = ss(p, 0.15 + i * 0.1, 0.45 + i * 0.1);
      const on = k > 0.98;
      if (on && !lit.current[i]) {
        lit.current[i] = true;
        sfx("spark");
        if (i === 0) sfx("chime");
      }
      if (!on) lit.current[i] = false;
      const cl = clouds.current[i];
      if (cl) {
        cl.scale.setScalar(1 - k * 0.85);
        cl.rotation.z += dt * (0.15 + k * 2.5);
        (cl.material as THREE.PointsMaterial).opacity = on ? 0.15 : 0.9;
      }
      const co = cores.current[i];
      if (co) {
        co.visible = on || k > 0.5;
        const glow = on ? 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.05 : k * 0.4;
        co.scale.setScalar(glow);
      }
    });
  });
  return (
    <group>
      {STAR_SPOTS.map((pos, i) => (
        <group key={i} position={pos}>
          <points ref={(el) => void (clouds.current[i] = el as THREE.Points | null)} geometry={gas}>
            <pointsMaterial map={tex} vertexColors size={0.35} transparent depthWrite={false} blending={ADD} toneMapped={false} />
          </points>
          <group ref={(el) => void (cores.current[i] = el)} visible={false}>
            <mesh>
              <sphereGeometry args={[0.45, 32, 24]} />
              <meshBasicMaterial color={new THREE.Color(i % 2 ? "#bff4ff" : "#ffffff").multiplyScalar(3)} toneMapped={false} />
            </mesh>
            <sprite scale={5}>
              <spriteMaterial map={tex} color={i % 2 ? "#3ee0ff" : "#9fd8ff"} transparent depthWrite={false} blending={ADD} toneMapped={false} />
            </sprite>
          </group>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ 6. Star factory */
const SHELLS = [
  { r: 3.2, c: "#ffe14d" }, // hydrogen burning to helium
  { r: 2.5, c: "#ff9a1a" }, // helium
  { r: 1.9, c: "#ff3d7f" }, // carbon
  { r: 1.35, c: "#3ee0ff" }, // oxygen
  { r: 0.8, c: "#c9c9d6" }, // iron
];
export function Forge({ phase, index, quality, still, sfx }: MomentProps) {
  const tex = glowTexture();
  const debris = useMemo(() => {
    const pal = SHELLS.map((s) => new THREE.Color(s.c));
    return pointCloud(n(quality, 5000), (i, p, c) => {
      randomInSphere(p, 1).normalize().multiplyScalar(0.8 + Math.random() * 0.4);
      c.copy(pal[i % pal.length]);
    });
  }, [quality]);
  useEffect(() => () => debris.dispose(), [debris]);
  const shells = useRef<(THREE.Mesh | null)[]>([]);
  const star = useRef<THREE.Group>(null);
  const boom = useRef<THREE.Points>(null);
  const flash = useRef<THREE.Sprite>(null);
  const fired = useOnce();
  const t0 = useRef(0);
  useFrame((state, dt) => {
    const p = phase.current[index];
    const t = state.clock.elapsedTime;
    if (p > 0.78 && !fired.current) {
      fired.current = true;
      t0.current = t;
      sfx("impact");
    }
    if (p < 0.6) fired.current = false;
    const age = fired.current ? t - t0.current : -1;
    shells.current.forEach((m, i) => {
      if (!m) return;
      const k = ss(p, 0.12 + i * 0.11, 0.25 + i * 0.11); // new layers form inside, one by one
      m.scale.setScalar(Math.max(0.001, k) * (1 + Math.sin(t * 2 + i) * 0.02));
      m.rotation.y += dt * (0.1 + i * 0.05);
    });
    if (star.current) {
      star.current.visible = age < 0.15;
      star.current.scale.setScalar(1 + ss(p, 0.6, 0.78) * 0.25);
    }
    if (boom.current) {
      boom.current.visible = age >= 0;
      boom.current.scale.setScalar(age >= 0 ? 3 + 30 * (1 - Math.exp(-age * 0.7)) : 0.01);
      boom.current.rotation.y += dt * 0.08;
    }
    if (flash.current) {
      const f = age >= 0 && !still ? Math.max(0, 1 - age) : 0;
      flash.current.visible = f > 0.01;
      flash.current.scale.setScalar(12 + age * 30);
      (flash.current.material as THREE.SpriteMaterial).opacity = f;
    }
  });
  return (
    <group position={[3.5, 1.5, -13]}>
      <group ref={star}>
        <sprite scale={11}>
          <spriteMaterial map={tex} color="#ffb020" transparent opacity={0.7} depthWrite={false} blending={ADD} toneMapped={false} />
        </sprite>
        {SHELLS.map((s, i) => (
          <mesh key={i} ref={(el) => void (shells.current[i] = el)} scale={0.001}>
            <sphereGeometry args={[s.r, 40, 28]} />
            <meshBasicMaterial color={new THREE.Color(s.c).multiplyScalar(i === 0 ? 1.4 : 1.1)} transparent opacity={i === 0 ? 0.35 : 0.55} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <sprite ref={flash} visible={false}>
        <spriteMaterial map={tex} color="#ffffff" transparent depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <points ref={boom} geometry={debris} visible={false}>
        <pointsMaterial map={tex} vertexColors size={0.35} transparent depthWrite={false} blending={ADD} toneMapped={false} />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ 7. Galaxies */
function spiral(count: number, a: string, b: string) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return pointCloud(count, (i, p, c) => {
    const r = Math.pow(Math.random(), 0.65) * 6;
    const ang = r * 1.1 + (i % 2) * Math.PI + (Math.random() - 0.5) * 0.7;
    p.set(Math.cos(ang) * r, (Math.random() - 0.5) * 0.5 * (1 - r / 7), Math.sin(ang) * r);
    c.copy(ca)
      .lerp(cb, r / 6)
      .lerp(new THREE.Color("#ffffff"), Math.max(0, 0.7 - r / 3));
  });
}
const GALAXY_MEET: [number, number, number] = [0, 2, -44];
export function Galaxies({ phase, index, quality, sfx }: MomentProps) {
  const tex = glowTexture();
  const a = useMemo(() => spiral(n(quality, 7000), "#ffe14d", "#ff3d7f"), [quality]);
  const b = useMemo(() => spiral(n(quality, 6000), "#3ee0ff", "#b05cff"), [quality]);
  useEffect(
    () => () => {
      a.dispose();
      b.dispose();
    },
    [a, b],
  );
  const ga = useRef<THREE.Group>(null);
  const gb = useRef<THREE.Group>(null);
  const merged = useOnce();
  // they meet just past the end of the journey, so the last view is of them merging
  const A0 = useMemo(() => new THREE.Vector3(-18, 6, -30), []);
  const B0 = useMemo(() => new THREE.Vector3(20, -6, -52), []);
  const C = useMemo(() => new THREE.Vector3(GALAXY_MEET[0], GALAXY_MEET[1], GALAXY_MEET[2]), []);
  const mats = useRef<(THREE.PointsMaterial | null)[]>([]);
  useFrame((_, dt) => {
    const p = phase.current[index];
    const k = ss(p, 0.05, 1);
    // they shine through any fog, so keep them hidden until their moment comes near
    const show = ss(p, 0, 0.25);
    mats.current.forEach((m) => {
      if (!m) return;
      m.opacity = show;
      m.visible = show > 0.01;
    });
    if (k > 0.95 && !merged.current) {
      merged.current = true;
      sfx("shimmer");
    }
    if (k < 0.8) merged.current = false;
    if (ga.current) {
      ga.current.position.copy(A0).lerp(C, k * 0.97);
      ga.current.children[0].rotation.y += dt * (0.15 + k * 0.3);
    }
    if (gb.current) {
      gb.current.position.copy(B0).lerp(C, k);
      gb.current.children[0].rotation.y -= dt * (0.12 + k * 0.3);
    }
  });
  return (
    <group>
      <group ref={ga} rotation={[0.9, 0, 0.3]} scale={1.6}>
        <points geometry={a}>
          <pointsMaterial ref={(el) => void (mats.current[0] = el)} map={tex} vertexColors size={0.26} transparent depthWrite={false} blending={ADD} toneMapped={false} fog={false} />
        </points>
      </group>
      <group ref={gb} rotation={[1.2, 0.4, -0.4]} scale={1.5}>
        <points geometry={b}>
          <pointsMaterial ref={(el) => void (mats.current[1] = el)} map={tex} vertexColors size={0.26} transparent depthWrite={false} blending={ADD} toneMapped={false} fog={false} />
        </points>
      </group>
    </group>
  );
}

export const MOMENT_SCENES = [BigBang, Stretch, Nuclei, Fog, FirstStars, Forge, Galaxies];

/** Where the camera should look while each moment plays, relative to its centre. */
export const FOCUS: [number, number, number][] = [[0, 0, -4], [0, 0, -6], [0, 0, -8], [0, 0, -10], [0, 0, -8], [3.5, 1.5, -13], GALAXY_MEET];
