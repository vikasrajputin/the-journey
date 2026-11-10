import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

type Handler = (p: THREE.Vector3, e: PointerEvent) => void;
type Handlers = { down?: Handler; move?: Handler; up?: Handler };

/**
 * Pointer input for a level, in world units on the z = 0 plane.
 * One code path for mouse, pen and touch; works anywhere on the canvas,
 * so small fingers never have to hit a tiny target exactly.
 */
export function useStagePointer(handlers: Handlers) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const el = gl.domElement;
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const ndc = new THREE.Vector2();
    const toWorld = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const out = new THREE.Vector3();
      ray.ray.intersectPlane(plane, out);
      return out;
    };
    const down = (e: PointerEvent) => {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* some browsers refuse capture for synthetic events */
      }
      ref.current.down?.(toWorld(e), e);
    };
    const move = (e: PointerEvent) => ref.current.move?.(toWorld(e), e);
    const up = (e: PointerEvent) => ref.current.up?.(toWorld(e), e);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl, camera]);
}

/**
 * Keyboard play: the game turns Space / Enter into "press" and "release" events,
 * so every level can be played without a pointer.
 */
export function useActionKey(onPress: () => void, onRelease?: () => void) {
  const ref = useRef({ onPress, onRelease });
  ref.current = { onPress, onRelease };
  useEffect(() => {
    const p = () => ref.current.onPress();
    const r = () => ref.current.onRelease?.();
    window.addEventListener("game:press", p);
    window.addEventListener("game:release", r);
    return () => {
      window.removeEventListener("game:press", p);
      window.removeEventListener("game:release", r);
    };
  }, []);
}

/** Calls `fn` once, `delay` seconds from now, unless the scene unmounts first. */
export function after(delay: number, fn: () => void) {
  const t = window.setTimeout(fn, delay * 1000);
  return () => window.clearTimeout(t);
}
