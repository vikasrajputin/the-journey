"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { shake } from "../shared";
import { ease } from "./path";

/**
 * The camera inside a level. It sits in front of the play area, but it is never
 * frozen: it leans a little towards the pointer and "breathes" slowly, so the
 * scene feels like a real place you are floating in. The pointer goes through
 * two smoothing stages first, so the motion is soft and never jumps.
 *
 * Level code asks for screen shake through `shake` instead of moving the
 * camera itself. Raycasting uses the real camera, so taps still land exactly.
 */
export function CameraRig({ still, fov = 50, kick = 0 }: { still: boolean; fov?: number; kick?: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const s = useRef({ want: new THREE.Vector2(), a: new THREE.Vector2(), b: new THREE.Vector2(), t: 0 });

  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.quaternion.identity();
    camera.fov = fov + kick;
    camera.updateProjectionMatrix();
    shake.x = shake.y = 0;
    const move = (e: PointerEvent) => {
      s.current.want.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      shake.x = shake.y = 0;
      camera.position.set(0, 0, 10);
      camera.quaternion.identity();
    };
  }, [camera, fov, kick]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const st = s.current;
    st.t += dt;
    const k = ease(3, dt);
    st.a.lerp(st.want, k);
    st.b.lerp(st.a, k);
    const sway = still ? 0 : 1;
    const x = st.b.x * 0.35 * sway + Math.sin(st.t * 0.31) * 0.06 * sway + shake.x;
    const y = -st.b.y * 0.22 * sway + Math.sin(st.t * 0.43) * 0.05 * sway + shake.y;
    camera.position.set(x, y, 10);
    camera.lookAt(0, 0, 0);
    // a quick wide-angle "punch" that settles, used when arriving through the warp
    const f = fov + (camera.fov - fov) * (1 - ease(1.6, dt));
    if (Math.abs(camera.fov - f) > 0.01) {
      camera.fov = f;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}
