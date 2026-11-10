"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { count } from "../quality";
import { glowTexture, type SceneProps } from "../shared";
import { useActionKey, useStagePointer } from "../input";

const MAX = 3.2; // how far space stretches by the end of the level
const BLUE = new THREE.Color("#9fdcff");
const RED = new THREE.Color("#ff2d55");

/**
 * Level 2: drag to stretch space. Every galaxy moves away from every other,
 * the grid of space widens, and the light shifts towards red.
 */
export function Stretch({ quality, onProgress, onWin, sfx }: SceneProps) {
  const tex = glowTexture();
  const viewport = useThree((s) => s.viewport);
  const n = count(quality, 90);

  const base = useMemo(() => {
    const out: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      out.push(new THREE.Vector3((Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 2));
    }
    return out;
  }, [n]);

  const grid = useMemo(() => {
    const pts: number[] = [];
    const N = 8;
    const step = 0.5;
    for (let i = -N; i <= N; i++) {
      pts.push(-N * step, i * step, 0, N * step, i * step, 0);
      pts.push(i * step, -N * step, 0, i * step, N * step, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  const sprites = useRef<(THREE.Sprite | null)[]>([]);
  const gridRef = useRef<THREE.LineSegments>(null);
  const s = useRef({ down: false, last: new THREE.Vector3(), target: 1, a: 1, done: false, whoosh: 0 });

  useEffect(() => onProgress(0), [onProgress]);

  // Scale the drag so a phone needs about the same number of swipes as a desktop.
  const per = 1.4 / Math.max(viewport.width, viewport.height);
  useStagePointer({
    down: (p) => {
      s.current.down = true;
      s.current.last.copy(p);
    },
    move: (p, e) => {
      const st = s.current;
      if (!st.down && e.pointerType !== "mouse") return;
      if (!st.down) {
        st.last.copy(p);
        st.down = e.buttons > 0;
        return;
      }
      st.target = Math.min(MAX, st.target + p.distanceTo(st.last) * per);
      st.last.copy(p);
    },
    up: () => {
      s.current.down = false;
    },
  });
  useActionKey(() => {
    s.current.target = Math.min(MAX, s.current.target + 0.25);
  });

  useFrame((state, dt) => {
    const st = s.current;
    const prev = st.a;
    st.a = THREE.MathUtils.damp(st.a, st.target, 4, dt);
    if (st.a - prev > 0.004 && state.clock.elapsedTime - st.whoosh > 0.45) {
      st.whoosh = state.clock.elapsedTime;
      sfx("whoosh");
    }
    const k = (st.a - 1) / (MAX - 1);
    onProgress(Math.min(1, k / 0.97));
    sprites.current.forEach((sp, i) => {
      if (!sp) return;
      sp.position.copy(base[i]).multiplyScalar(st.a);
      // Further galaxies look redder: their light has crossed more stretching space.
      const dist = sp.position.length() / (3 * MAX);
      (sp.material as THREE.SpriteMaterial).color.copy(BLUE).lerp(RED, Math.min(1, k * 0.6 + dist * k));
    });
    if (gridRef.current) gridRef.current.scale.setScalar(st.a);
    if (k >= 0.97 && !st.done) {
      st.done = true;
      sfx("shimmer");
      window.setTimeout(onWin, 1100);
    }
  });

  useEffect(() => () => grid.dispose(), [grid]);

  return (
    <>
      <color attach="background" args={["#0a0420"]} />
      <lineSegments ref={gridRef} geometry={grid} position={[0, 0, -1.2]}>
        <lineBasicMaterial color="#ff3d7f" transparent opacity={0.28} />
      </lineSegments>
      {base.map((_, i) => (
        <sprite key={i} ref={(el) => void (sprites.current[i] = el)} scale={0.28 + (i % 5) * 0.06}>
          <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>
      ))}
    </>
  );
}
