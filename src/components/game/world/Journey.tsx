"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Quality } from "../quality";
import type { Sfx } from "../sound-engine";
import { Dust, Nebula } from "./Atmosphere";
import { FOCUS, MOMENT_SCENES } from "./Moments";
import { activeMoment, arrival, dwell, ease, makeRoute, phaseOf, stationPosition } from "./route";

/**
 * Chapter 1 as one continuous drift through time.
 *
 * The camera floats along a path through space on its own. Scrolling,
 * swiping up or down, or the arrow keys move you faster, or back in time.
 * Moving the mouse (or dragging sideways on a phone) lets you look around.
 * Each of the seven moments plays out around you as you arrive.
 */

export type JourneyProps = {
  quality: Quality;
  still: boolean;
  /** False behind the title: the world idles, nothing moves you along. */
  playing: boolean;
  /** False when the visitor paused the drift (they can still scroll). */
  drifting: boolean;
  /** Bump `n` to glide to moment `index` (Next / Back buttons, timeline). */
  jump: { index: number; n: number };
  count: number;
  sfx: (s: Sfx) => void;
  /** Which moment is playing now (-1 before the first). Called only when it changes. */
  onMoment: (i: number) => void;
  /** 0 to 1 along the whole journey. Called every frame: keep it cheap. */
  onProgress: (t: number) => void;
  /** Called when the journey reaches its end, or leaves it. */
  onEnd: (ended: boolean) => void;
  /** Written every frame: 0 (still) to 1 (fast). The sound and dust read it. */
  motion: { current: number };
};

const LOOK = new THREE.Vector3();
const FOC = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const TMP = new THREE.Vector3();

export function Journey(props: JourneyProps) {
  const { quality, count } = props;
  const route = useMemo(() => makeRoute(count), [count]);
  const phase = useRef<number[]>(Array.from({ length: count }, () => 0));
  return (
    <>
      <color attach="background" args={["#05010f"]} />
      <fogExp2 attach="fog" args={["#0a0322", 0.02]} />
      <Nebula gain={1} />
      <Dust quality={quality} stretch={props.motion} />
      {MOMENT_SCENES.slice(0, count).map((Scene, i) => (
        <group key={i} position={stationPosition(i)}>
          <Scene phase={phase} index={i} quality={quality} still={props.still} sfx={props.sfx} />
        </group>
      ))}
      <Drift {...props} route={route} phase={phase} />
    </>
  );
}

function Drift({
  playing,
  drifting,
  still,
  jump,
  route,
  phase,
  onMoment,
  onProgress,
  onEnd,
  motion,
}: JourneyProps & { route: ReturnType<typeof makeRoute>; phase: { current: number[] } }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const s = useRef({
    d: 0,
    vel: 0,
    push: 0,
    goal: -1,
    moment: -2,
    ended: false,
    // look-around: target, then two smoothing stages, so it never jerks
    want: new THREE.Vector2(),
    a: new THREE.Vector2(),
    b: new THREE.Vector2(),
    focus: 0,
    touchY: null as number | null,
    touchX: 0,
    t: 0,
  });
  const live = useRef({ playing, drifting, onMoment, onProgress, onEnd });
  live.current = { playing, drifting, onMoment, onProgress, onEnd };

  useEffect(() => {
    if (jump.n > 0) s.current.goal = arrival(route, Math.max(0, Math.min(route.at.length - 1, jump.index))) + 6;
    if (jump.n > 0 && jump.index < 0) s.current.goal = 0;
  }, [jump.n, jump.index, route]);

  // Input: wheel, touch swipes, keys and pointer look.
  useEffect(() => {
    const el = gl.domElement;
    const st = s.current;
    const wheel = (e: WheelEvent) => {
      if (!live.current.playing) return;
      e.preventDefault();
      st.goal = -1;
      st.push += THREE.MathUtils.clamp(e.deltaY, -120, 120) * 0.012;
    };
    // only the mouse over the scene itself turns the view, not clicks on buttons
    const look = (e: PointerEvent) => {
      if (e.pointerType === "mouse") st.want.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    const leave = () => st.want.set(0, 0);
    const tStart = (e: TouchEvent) => {
      st.touchY = e.touches[0].clientY;
      st.touchX = e.touches[0].clientX;
    };
    const tMove = (e: TouchEvent) => {
      if (st.touchY === null || !live.current.playing) return;
      e.preventDefault();
      const dy = e.touches[0].clientY - st.touchY;
      const dx = e.touches[0].clientX - st.touchX;
      st.touchY = e.touches[0].clientY;
      st.touchX = e.touches[0].clientX;
      st.goal = -1;
      st.push -= dy * 0.03; // swipe up = forward in time
      st.want.x = THREE.MathUtils.clamp(st.want.x + dx / (window.innerWidth * 0.5), -1, 1);
    };
    const tEnd = () => {
      st.touchY = null;
    };
    const key = (e: KeyboardEvent) => {
      if (!live.current.playing || (e.target as Element)?.closest?.("button, a, dialog, input")) return;
      const fwd = ["ArrowDown", "PageDown", " ", "ArrowRight"].includes(e.key);
      const back = ["ArrowUp", "PageUp", "ArrowLeft"].includes(e.key);
      if (!fwd && !back) return;
      e.preventDefault();
      st.goal = -1;
      st.push += fwd ? 6 : -6;
    };
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("pointermove", look);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("touchstart", tStart, { passive: true });
    el.addEventListener("touchmove", tMove, { passive: false });
    el.addEventListener("touchend", tEnd);
    window.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("pointermove", look);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("touchstart", tStart);
      el.removeEventListener("touchmove", tMove);
      el.removeEventListener("touchend", tEnd);
      window.removeEventListener("keydown", key);
    };
  }, [gl]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const st = s.current;
    const L = live.current;
    st.t += dt;

    // how fast to move along the path
    let target = 0;
    if (L.playing && L.drifting && st.d < route.length - 0.5) target = 3.8 * dwell(route, st.d);
    if (st.goal >= 0) {
      const gap = st.goal - st.d;
      target = THREE.MathUtils.clamp(gap * 1.6, -40, 40);
      if (Math.abs(gap) < 0.5) st.goal = -1;
    }
    st.vel += (target - st.vel) * ease(2, dt);
    st.d += (st.vel + st.push) * dt;
    st.push *= 1 - ease(2.5, dt); // scroll gives a push that fades out, like momentum
    st.d = THREE.MathUtils.clamp(st.d, 0, route.length - 0.01);

    // each moment's phase, from where the camera is
    for (let i = 0; i < route.at.length; i++) phase.current[i] = phaseOf(route, i, st.d);
    const m = activeMoment(route, st.d);
    if (m !== st.moment) {
      st.moment = m;
      L.onMoment(m);
    }
    const ended = st.d > route.length - 2;
    if (ended !== st.ended) {
      st.ended = ended;
      L.onEnd(ended);
    }
    L.onProgress(st.d / route.length);
    const speed = Math.min(1, Math.abs(st.vel + st.push) / 14);
    motion.current += (speed - motion.current) * ease(4, dt);

    // camera: on the path, looking ahead, turned a little by the look-around
    const u = st.d / route.length;
    route.curve.getPointAt(u, camera.position);
    route.curve.getPointAt(Math.min(1, u + 6 / route.length), LOOK);
    if (u > 0.999) LOOK.copy(camera.position).add(new THREE.Vector3(0, 0, -1));
    // while a moment plays, turn towards the heart of it, so nothing happens off screen
    if (m >= 0) {
      stationPosition(m, FOC).add(TMP.set(...FOCUS[m]));
      const dist = FOC.distanceTo(camera.position);
      const w = phase.current[m] > 0 ? THREE.MathUtils.smoothstep(dist, 5, 12) * (m === FOCUS.length - 1 ? 1 : 1 - THREE.MathUtils.smoothstep(st.d - route.at[m], 0, 8)) : 0;
      st.focus += (w - st.focus) * ease(1.5, dt);
      LOOK.lerp(FOC, st.focus * 0.85);
    }
    const k = ease(3, dt);
    st.a.lerp(st.want, k);
    st.b.lerp(st.a, k);
    const sway = still ? 0 : 1;
    camera.position.y += Math.sin(st.t * 0.5) * 0.12 * sway;
    camera.position.x += Math.sin(st.t * 0.31) * 0.08 * sway;
    camera.up.copy(UP);
    camera.lookAt(LOOK);
    camera.rotateY(-st.b.x * 0.45);
    camera.rotateX(-st.b.y * 0.28);
    const fov = 60 + (still ? 0 : motion.current * 16);
    if (Math.abs(camera.fov - fov) > 0.05) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    void state;
  });
  return null;
}
