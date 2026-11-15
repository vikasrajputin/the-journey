"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Quality } from "../quality";
import { glowTexture, pointCloud } from "../shared";
import { Dust, Nebula } from "./Atmosphere";
import { ENTER_RADIUS, NEAR_RADIUS, ease, makeRoad, nearestPortal, outsideRoad, portalPosition, viewpoint } from "./path";

/**
 * The universe map: a 3D space you fly through. The seven levels are glowing
 * portals strung along a river of light that flows forward in time. Fly into
 * an open portal to play it.
 *
 * Controls (one scheme for mouse and touch, so nobody has to learn two):
 *   hold anywhere          fly forward
 *   slide while holding    steer, like a joystick
 *   two fingers / Shift    fly faster
 *   W A S D / arrows       fly and turn, Q / E down and up
 *   1 to 7                 glide to that level's portal
 */

export type PortalInfo = { color: string; number: number; name: string; unlocked: boolean; stars: number | undefined };

export type HubMode = "idle" | "fly";

export type HubProps = {
  quality: Quality;
  portals: PortalInfo[];
  mode: HubMode;
  /** When set, the camera glides to this portal by itself and flies in. */
  target: number | null;
  /** Portal to hover in front of when the map opens. */
  startAt: number;
  still: boolean;
  onNear: (near: { index: number; locked: boolean } | null) => void;
  onEnter: (index: number) => void;
  onBump: () => void;
  onPick: (index: number) => void;
  /** Told when the player drifts far from every portal, so the HUD can offer a way back. */
  onLost: (lost: boolean) => void;
  /** Bump this number to glide back in front of portal `startAt` (the "Take me back" button). */
  recall: number;
  /** Written every frame: 0 (still) to 1 (full speed). The sound and the dust read it. */
  motion: { current: number };
};

const FWD = new THREE.Vector3();
const TMP = new THREE.Vector3();
const TMP2 = new THREE.Vector3();

export function Hub(props: HubProps) {
  const { quality, portals } = props;
  const road = useMemo(() => makeRoad(portals.length), [portals.length]);
  return (
    <>
      <color attach="background" args={["#05010f"]} />
      <fogExp2 attach="fog" args={["#0a0322", 0.02]} />
      <Nebula gain={1} />
      <Dust quality={quality} stretch={props.motion} />
      <River road={road} portals={portals} quality={quality} />
      <FarGalaxies quality={quality} />
      {portals.map((p, i) => (
        <Portal key={i} index={i} info={p} />
      ))}
      <Flight {...props} road={road} />
    </>
  );
}

/* ------------------------------------------------------------------ flight */

function Flight({ mode, target, startAt, still, portals, road, onNear, onEnter, onBump, onPick, onLost, recall, motion }: HubProps & { road: THREE.CatmullRomCurve3 }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const s = useRef({
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    // look input goes through two smoothing stages, so turning never jerks
    lookA: new THREE.Vector2(),
    lookB: new THREE.Vector2(),
    yawRate: 0,
    cruise: 0,
    entered: false,
    near: "",
    lost: false,
    lostFor: 0,
    home: -1,
    bumpAt: 0,
  });
  const input = useRef({ keys: new Set<string>(), pointers: new Map<number, { x0: number; y0: number; x: number; y: number }>() });
  const live = useRef({ mode, target, portals, onNear, onEnter, onBump, onPick, onLost });
  live.current = { mode, target, portals, onNear, onEnter, onBump, onPick, onLost };

  const homeAt = useRef(startAt);
  homeAt.current = Math.min(startAt, portals.length - 1);
  useEffect(() => {
    if (recall > 0) s.current.home = homeAt.current;
  }, [recall]);

  // Start in front of the wanted portal, looking at it.
  useEffect(() => {
    const st = s.current;
    viewpoint(Math.min(startAt, portals.length - 1), st.pos);
    if (mode === "idle") st.pos.set(0, 1.4, 22);
    st.yaw = 0;
    st.pitch = -0.04;
    st.vel.set(0, 0, 0);
    st.entered = false;
    st.cruise = 0;
    camera.position.copy(st.pos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (target === null) s.current.entered = false;
  }, [target]);

  // Pointer and keyboard input.
  useEffect(() => {
    const el = gl.domElement;
    const ptrs = input.current.pointers;
    const down = (e: PointerEvent) => {
      if (live.current.mode !== "fly") return;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      ptrs.set(e.pointerId, { x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY });
    };
    const move = (e: PointerEvent) => {
      const p = ptrs.get(e.pointerId);
      if (!p) return;
      // the view also follows the finger straight away, a little
      if (ptrs.size === 1 || e.pointerId === ptrs.keys().next().value) {
        const k = 2.4 / Math.min(window.innerWidth, window.innerHeight);
        s.current.lookA.x += (e.clientX - p.x) * k;
        s.current.lookA.y += (e.clientY - p.y) * k;
      }
      p.x = e.clientX;
      p.y = e.clientY;
    };
    const up = (e: PointerEvent) => void ptrs.delete(e.pointerId);
    const key = (e: KeyboardEvent, on: boolean) => {
      if ((e.target as Element)?.closest?.("input, textarea, dialog")) return;
      const k = e.code;
      if (on && /^Digit[1-7]$/.test(k) && live.current.mode === "fly") {
        const i = Number(k.slice(5)) - 1;
        if (i < live.current.portals.length) live.current.onPick(i);
        return;
      }
      const flyKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"];
      if (!flyKeys.includes(k)) return;
      if (on && live.current.mode === "fly" && k.startsWith("Arrow") && !(e.target as Element)?.closest?.("button, a")) e.preventDefault();
      if (on) input.current.keys.add(k);
      else input.current.keys.delete(k);
    };
    const kd = (e: KeyboardEvent) => key(e, true);
    const ku = (e: KeyboardEvent) => key(e, false);
    const blur = () => {
      input.current.keys.clear();
      ptrs.clear();
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", blur);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("blur", blur);
    };
  }, [gl]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const st = s.current;
    const L = live.current;
    const keys = input.current.keys;
    const ptrs = input.current.pointers;
    let speed = 0;

    if (L.mode === "idle" && L.target === null) {
      // Title screen: drift slowly along the start of the river, looking ahead.
      st.cruise += dt * (still ? 0 : 0.006);
      const u = 0.02 + (Math.sin(st.cruise * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5) * 0.14;
      road.getPoint(u, TMP).add(TMP2.set(0, 1.2, 0));
      st.pos.lerp(TMP, ease(1.5, dt));
      road.getPoint(Math.min(1, u + 0.06), TMP2);
      FWD.copy(TMP2).sub(st.pos).normalize();
      st.yaw = Math.atan2(FWD.x, -FWD.z);
      st.pitch = Math.asin(THREE.MathUtils.clamp(FWD.y, -1, 1));
      st.vel.set(0, 0, 0);
      speed = 0.05;
    } else if (st.home >= 0 && L.target === null) {
      // "Take me back": glide to the front of a portal and look at it.
      viewpoint(st.home, TMP);
      st.pos.lerp(TMP, ease(2.2, dt));
      const c = portalPosition(st.home, TMP2);
      const ty = Math.atan2(c.x - st.pos.x, -(c.z - st.pos.z));
      const tp = Math.atan2(c.y - st.pos.y, Math.hypot(c.x - st.pos.x, c.z - st.pos.z));
      let dy = ty - st.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      st.yaw += dy * ease(3, dt);
      st.pitch += (tp - st.pitch) * ease(3, dt);
      st.vel.set(0, 0, 0);
      st.lookA.set(0, 0);
      st.lookB.set(0, 0);
      speed = 0.3;
      if (st.pos.distanceTo(TMP) < 0.3 || input.current.pointers.size || input.current.keys.size) st.home = -1;
    } else if (L.target !== null) {
      // Autopilot: glide to the chosen portal and fly in.
      const c = portalPosition(L.target, TMP);
      const toC = TMP2.copy(c).sub(st.pos);
      const d = toC.length();
      toC.normalize();
      const want = Math.min(still ? 60 : 34, d * 2 + 6);
      st.vel.lerp(toC.multiplyScalar(want), ease(4, dt));
      st.pos.addScaledVector(st.vel, dt);
      const ty = Math.atan2(c.x - st.pos.x, -(c.z - st.pos.z));
      const tp = Math.atan2(c.y - st.pos.y, Math.hypot(c.x - st.pos.x, c.z - st.pos.z));
      let dy = ty - st.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      st.yawRate = dy * 3;
      st.yaw += dy * ease(5, dt);
      st.pitch += (tp - st.pitch) * ease(5, dt);
      speed = Math.min(1, st.vel.length() / 30);
      if (d < ENTER_RADIUS && !st.entered) {
        st.entered = true;
        L.onEnter(L.target);
      }
    } else {
      // Free flight.
      const fast = keys.has("ShiftLeft") || keys.has("ShiftRight") || ptrs.size > 1;
      const first = ptrs.values().next().value as { x0: number; y0: number; x: number; y: number } | undefined;
      let thrust = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0);
      let turn = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
      const lift = (keys.has("KeyE") ? 1 : 0) - (keys.has("KeyQ") ? 1 : 0);
      let tilt = 0;
      if (first) {
        thrust = 1;
        // holding the finger away from where it went down keeps turning, like a joystick
        const r = 3 / Math.min(window.innerWidth, window.innerHeight);
        turn += THREE.MathUtils.clamp((first.x - first.x0) * r, -1, 1);
        tilt = THREE.MathUtils.clamp((first.y - first.y0) * r, -1, 1);
      }
      st.lookA.x += turn * 1.1 * dt;
      st.lookA.y += tilt * 0.7 * dt;

      // two cascaded low-pass stages: input -> A -> B -> camera
      const k = ease(14, dt);
      const ax = st.lookA.x * k;
      const ay = st.lookA.y * k;
      st.lookA.x -= ax;
      st.lookA.y -= ay;
      st.lookB.x += ax;
      st.lookB.y += ay;
      const bx = st.lookB.x * k;
      const by = st.lookB.y * k;
      st.lookB.x -= bx;
      st.lookB.y -= by;
      st.yaw += bx;
      st.pitch = THREE.MathUtils.clamp(st.pitch - by, -1.2, 1.2);
      st.yawRate = bx / Math.max(dt, 1e-3);

      const sp = fast ? 18 : 7.5;
      const cp = Math.cos(st.pitch);
      FWD.set(Math.sin(st.yaw) * cp, Math.sin(st.pitch), -Math.cos(st.yaw) * cp);
      TMP.copy(FWD).multiplyScalar(thrust * sp);
      TMP.y += lift * sp * 0.6;
      st.vel.lerp(TMP, ease(thrust || lift ? 2.6 : 1.6, dt));

      // space gently pushes you back towards the river if you wander off
      const off = outsideRoad(st.pos, road, TMP2, 60);
      if (off > 0) st.vel.addScaledVector(TMP2, off * 10 * dt);

      st.pos.addScaledVector(st.vel, dt);
      speed = Math.min(1, st.vel.length() / 18);

      // portals: fly into an open one, bounce off a locked one
      const near = nearestPortal(st.pos, L.portals.length);
      if (near.distance < ENTER_RADIUS + 0.4) {
        if (L.portals[near.index].unlocked) {
          if (!st.entered) {
            st.entered = true;
            L.onEnter(near.index);
          }
        } else {
          const c = portalPosition(near.index, TMP);
          const out = TMP2.copy(st.pos).sub(c).normalize();
          st.pos.copy(c).addScaledVector(out, ENTER_RADIUS + 0.45);
          st.vel.reflect(out).multiplyScalar(0.5).addScaledVector(out, 3);
          if (state.clock.elapsedTime - st.bumpAt > 0.6) {
            st.bumpAt = state.clock.elapsedTime;
            L.onBump();
          }
        }
      }
    }

    // where we are, for the HUD
    const near = nearestPortal(st.pos, L.portals.length);
    const tag = near.distance < NEAR_RADIUS ? `${near.index}:${L.portals[near.index].unlocked ? 1 : 0}` : "";
    if (tag !== st.near) {
      st.near = tag;
      L.onNear(tag ? { index: near.index, locked: !L.portals[near.index].unlocked } : null);
    }
    // "lost" = no portal ahead of you for a few seconds, or far from all of them
    const cpl = Math.cos(st.pitch);
    FWD.set(Math.sin(st.yaw) * cpl, Math.sin(st.pitch), -Math.cos(st.yaw) * cpl);
    let ahead = false;
    for (let i = 0; i < L.portals.length && !ahead; i++) {
      const dir = portalPosition(i, TMP2).sub(st.pos);
      const d = dir.length();
      if (d < 50 && dir.dot(FWD) / d > 0.7) ahead = true;
    }
    st.lostFor = ahead && near.distance < 22 ? 0 : st.lostFor + dt;
    const lost = L.mode === "fly" && L.target === null && st.home < 0 && st.lostFor > 2.5;
    if (lost !== st.lost) {
      st.lost = lost;
      L.onLost(lost);
    }

    // camera: position, look, a small bank into turns and a wider view at speed
    motion.current += (speed - motion.current) * ease(4, dt);
    camera.position.copy(st.pos);
    if (!still) camera.position.y += Math.sin(state.clock.elapsedTime * 0.7) * 0.05;
    const cp = Math.cos(st.pitch);
    FWD.set(Math.sin(st.yaw) * cp, Math.sin(st.pitch), -Math.cos(st.yaw) * cp);
    camera.lookAt(TMP.copy(camera.position).add(FWD));
    if (!still) camera.rotateZ(THREE.MathUtils.clamp(-st.yawRate * 0.05, -0.18, 0.18));
    const fov = 58 + (still ? 0 : motion.current * 14);
    if (Math.abs(camera.fov - fov) > 0.05) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/* ------------------------------------------------------------------ portals */

function labelTexture(top: string, name: string, bottom: string, color: string) {
  const w = 512;
  const h = 200;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = "rgba(0,0,0,0.9)";
  g.shadowBlur = 14;
  g.fillStyle = color;
  g.font = "800 34px system-ui, sans-serif";
  g.fillText(top, w / 2, 34);
  g.fillStyle = "#ffffff";
  g.font = "900 62px system-ui, sans-serif";
  g.fillText(name, w / 2, 100, w - 20);
  g.fillStyle = "#ffe14d";
  g.font = "800 40px system-ui, sans-serif";
  g.fillText(bottom, w / 2, 166);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function Portal({ index, info }: { index: number; info: PortalInfo }) {
  const tex = glowTexture();
  const pos = useMemo(() => portalPosition(index), [index]);
  const col = useMemo(() => new THREE.Color(info.unlocked ? info.color : "#5b5577"), [info.unlocked, info.color]);
  const label = useMemo(() => {
    const stars = info.stars === undefined ? "" : "★".repeat(info.stars) + "☆".repeat(3 - info.stars);
    return labelTexture(`LEVEL ${info.number}`, info.name, info.unlocked ? stars || "Fly in!" : "🔒 Locked", info.unlocked ? info.color : "#a9a3c4");
  }, [info.number, info.name, info.unlocked, info.stars, info.color]);
  useEffect(() => () => label.dispose(), [label]);

  const swirl = useMemo(
    () =>
      pointCloud(500, (i, p, c) => {
        const r = 0.2 + Math.pow(Math.random(), 0.7) * 1.05;
        const a = r * 5 + (i % 2) * Math.PI + Math.random() * 0.5;
        p.set(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.25);
        c.set("#ffffff").lerp(col, Math.min(1, r * 0.9));
      }),
    [col],
  );
  useEffect(() => () => swirl.dispose(), [swirl]);

  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const sw = useRef<THREE.Points>(null);
  const halo = useRef<THREE.Sprite>(null);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (ring.current) ring.current.rotation.z += dt * (info.unlocked ? 0.6 : 0.1);
    if (ring2.current) {
      ring2.current.rotation.x = Math.sin(t * 0.5 + index) * 0.6;
      ring2.current.rotation.y += dt * 0.4;
    }
    if (sw.current) sw.current.rotation.z -= dt * (info.unlocked ? 1.2 : 0.2);
    if (halo.current) halo.current.scale.setScalar((info.unlocked ? 7 : 4) * (1 + Math.sin(t * 2 + index) * 0.06));
  });

  const bright = info.unlocked ? 2.2 : 0.8;
  return (
    <group position={pos}>
      <sprite ref={halo} scale={7}>
        <spriteMaterial map={tex} color={col} transparent opacity={info.unlocked ? 0.75 : 0.35} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <mesh>
        <sphereGeometry args={[0.55, 32, 24]} />
        <meshBasicMaterial color={col.clone().multiplyScalar(bright).lerp(new THREE.Color("#ffffff"), info.unlocked ? 0.4 : 0)} toneMapped={false} />
      </mesh>
      <points ref={sw} geometry={swirl}>
        <pointsMaterial map={tex} vertexColors size={0.16} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
      <mesh ref={ring}>
        <torusGeometry args={[1.55, 0.05, 8, 96]} />
        <meshBasicMaterial color={col.clone().multiplyScalar(bright)} toneMapped={false} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[1.9, 0.025, 6, 96]} />
        <meshBasicMaterial color={col.clone().multiplyScalar(bright * 0.7)} toneMapped={false} transparent opacity={0.8} />
      </mesh>
      <sprite position={[0, 2.75, 0]} scale={[4.2, 1.64, 1]}>
        <spriteMaterial map={label} transparent depthWrite={false} toneMapped={false} />
      </sprite>
    </group>
  );
}

/* ------------------------------------------------------------------ river of time */

function River({ road, portals, quality }: { road: THREE.CatmullRomCurve3; portals: PortalInfo[]; quality: Quality }) {
  const tex = glowTexture();
  const n = quality === "high" ? 2200 : 900;
  const LUT = 600;
  const data = useMemo(() => {
    const lut = new Float32Array((LUT + 1) * 3);
    const p = new THREE.Vector3();
    for (let i = 0; i <= LUT; i++) {
      road.getPoint(i / LUT, p);
      lut.set([p.x, p.y, p.z], i * 3);
    }
    const u = new Float32Array(n);
    const off = new Float32Array(n * 3);
    const speed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      u[i] = Math.random();
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.8) * 1.4;
      off.set([Math.cos(a) * r, Math.sin(a) * r * 0.6, Math.sin(a) * r], i * 3);
      speed[i] = 0.006 + Math.random() * 0.008;
    }
    return { lut, u, off, speed };
  }, [road, n]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);
    return g;
  }, [n]);
  const colours = useMemo(() => portals.map((p) => new THREE.Color(p.color)), [portals]);
  useEffect(() => () => geo.dispose(), [geo]);

  const c = useMemo(() => new THREE.Color(), []);
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const pos = geo.attributes.position.array as Float32Array;
    const col = geo.attributes.color.array as Float32Array;
    const { lut, u, off, speed } = data;
    for (let i = 0; i < n; i++) {
      u[i] = (u[i] + speed[i] * dt) % 1;
      const f = u[i] * LUT;
      const j = Math.floor(f);
      const t = f - j;
      const o = j * 3;
      pos[i * 3] = lut[o] + (lut[o + 3] - lut[o]) * t + off[i * 3];
      pos[i * 3 + 1] = lut[o + 1] + (lut[o + 4] - lut[o + 1]) * t + off[i * 3 + 1];
      pos[i * 3 + 2] = lut[o + 2] + (lut[o + 5] - lut[o + 2]) * t + off[i * 3 + 2];
      // colour fades from one level's colour to the next along the river
      const k = Math.min(colours.length - 1.001, Math.max(0, u[i] * (colours.length + 1) - 1));
      const a = Math.floor(k);
      c.copy(colours[a]).lerp(colours[Math.min(a + 1, colours.length - 1)], k - a);
      const fade = Math.min(1, u[i] * 30) * Math.min(1, (1 - u[i]) * 30);
      col[i * 3] = c.r * fade;
      col[i * 3 + 1] = c.g * fade;
      col[i * 3 + 2] = c.b * fade;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial map={tex} vertexColors size={0.22} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}

/* ------------------------------------------------------------------ distant galaxies */

function FarGalaxies({ quality }: { quality: Quality }) {
  const tex = glowTexture();
  const spots = useMemo(
    () => [
      { p: [-38, 14, -40], c: ["#ffb020", "#ff3d7f"], s: 9, tilt: 0.9 },
      { p: [42, -10, -75], c: ["#3ee0ff", "#b05cff"], s: 12, tilt: 1.2 },
      { p: [-30, -16, -115], c: ["#2bff88", "#3ee0ff"], s: 8, tilt: 0.5 },
    ],
    [],
  );
  const geos = useMemo(
    () =>
      spots.map((g) =>
        pointCloud(quality === "high" ? 2500 : 900, (i, p, c) => {
          const r = Math.pow(Math.random(), 0.7);
          const a = r * 7 + (i % 2) * Math.PI + (Math.random() - 0.5) * 0.8;
          p.set(Math.cos(a) * r * g.s, (Math.random() - 0.5) * 0.4, Math.sin(a) * r * g.s);
          c.set(g.c[0]).lerp(new THREE.Color(g.c[1]), r).lerp(new THREE.Color("#ffffff"), Math.max(0, 0.6 - r));
        }),
      ),
    [spots, quality],
  );
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);
  const refs = useRef<(THREE.Points | null)[]>([]);
  useFrame((_, dt) => refs.current.forEach((r) => r && (r.rotation.y += dt * 0.03)));
  return (
    <>
      {spots.map((g, i) => (
        <group key={i} position={g.p as [number, number, number]} rotation={[g.tilt, 0, 0.3]}>
          <points ref={(el) => void (refs.current[i] = el as THREE.Points | null)} geometry={geos[i]}>
            <pointsMaterial map={tex} vertexColors size={0.5} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
          </points>
        </group>
      ))}
    </>
  );
}
