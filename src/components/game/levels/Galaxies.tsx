"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { count } from "../quality";
import { glowTexture, pointCloud, randomInSphere, type SceneProps } from "../shared";
import { useActionKey, useStagePointer } from "../input";

const SMALL = 5;
const TINTS = ["#3ee0ff", "#ff3d7f", "#ffd23f", "#2bff88", "#b05cff"];

type Blob = { home: THREE.Vector3; pos: THREE.Vector3; merging: number; merged: boolean };

function spiral(n: number) {
  const inner = new THREE.Color("#fff3c4");
  const outer = new THREE.Color("#5ab8ff");
  const pink = new THREE.Color("#ff5d8f");
  return pointCloud(n, (i, p, c) => {
    const arm = i % 2;
    const r = Math.pow(Math.random(), 0.7) * 1.6;
    const a = r * 2.6 + arm * Math.PI + (Math.random() - 0.5) * (0.9 - r * 0.25);
    p.set(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.12 * (1.7 - r));
    c.copy(inner).lerp(outer, r / 1.6);
    if (Math.random() < 0.08) c.copy(pink);
  });
}

/**
 * Level 7: small galaxies drift around a young one. Drag (or tap) each one
 * into the middle; every merger makes the central galaxy bigger and brighter,
 * until it settles into a grand spiral.
 */
export function Galaxies({ quality, onProgress, onWin, onStatus, sfx }: SceneProps) {
  const tex = glowTexture();
  const viewport = useThree((s) => s.viewport);
  const orbit = Math.min(viewport.width, viewport.height) * 0.36;

  const big = useMemo(() => spiral(count(quality, 6000)), [quality]);
  const smallGeo = useMemo(
    () =>
      pointCloud(count(quality, 260), (_, p, c) => {
        randomInSphere(p, 0.35);
        c.setScalar(0.7 + Math.random() * 0.3);
      }),
    [quality],
  );
  const background = useMemo(
    () =>
      pointCloud(count(quality, 1500), (_, p, c) => {
        p.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, -6 - Math.random() * 6);
        c.setScalar(0.5 + Math.random() * 0.5);
      }),
    [quality],
  );

  const blobs = useMemo<Blob[]>(
    () =>
      Array.from({ length: SMALL }, (_, i) => {
        const a = (i / SMALL) * Math.PI * 2 + 0.4;
        const home = new THREE.Vector3(Math.cos(a) * orbit * 1.05, Math.sin(a) * orbit * 1.25, 0);
        return { home, pos: home.clone(), merging: 0, merged: false };
      }),
    [orbit],
  );

  const bigRef = useRef<THREE.Points>(null);
  const blobRefs = useRef<(THREE.Points | null)[]>([]);
  const st = useRef({ drag: -1, start: new THREE.Vector3(), merged: 0, size: 0.45, tilt: 0, done: false, won: 0 });

  useEffect(() => {
    onProgress(0);
    onStatus({ label: `Galaxies merged: 0 of ${SMALL}` });
    return () => onStatus(null);
  }, [onProgress, onStatus]);

  const merge = (i: number) => {
    const b = blobs[i];
    if (b.merging || b.merged) return;
    b.merging = performance.now() / 1000;
    sfx("whoosh");
  };

  useStagePointer({
    down: (p) => {
      let best = -1;
      let bestD = 0.9;
      blobs.forEach((b, i) => {
        const d = b.pos.distanceTo(p);
        if (!b.merging && !b.merged && d < bestD) {
          bestD = d;
          best = i;
        }
      });
      st.current.drag = best;
      st.current.start.copy(p);
    },
    move: (p) => {
      const i = st.current.drag;
      if (i < 0) return;
      blobs[i].pos.copy(p);
      if (p.length() < orbit * 0.4) {
        st.current.drag = -1;
        merge(i);
      }
    },
    up: () => {
      const i = st.current.drag;
      st.current.drag = -1;
      // A tap, or a drag that ends anywhere, sends the galaxy in: gravity does the rest.
      if (i >= 0) merge(i);
    },
  });
  useActionKey(() => {
    const i = blobs.findIndex((b) => !b.merging && !b.merged);
    if (i >= 0) merge(i);
  });

  useFrame((state, dt) => {
    const s = st.current;
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    blobs.forEach((b, i) => {
      const g = blobRefs.current[i];
      if (!g) return;
      if (b.merged) {
        g.visible = false;
        return;
      }
      if (b.merging) {
        const k = Math.min(1, (now - b.merging) / 0.9);
        b.pos.lerp(new THREE.Vector3(), k * k);
        g.scale.setScalar(1 - k * 0.8);
        if (k >= 1) {
          b.merged = true;
          s.merged += 1;
          sfx("chime");
          onStatus({ label: `Galaxies merged: ${s.merged} of ${SMALL}` });
          if (s.merged === SMALL && !s.done) {
            s.done = true;
            s.won = t;
            sfx("shimmer");
            window.setTimeout(onWin, 2600);
          }
        }
      } else if (s.drag !== i) {
        // Idle galaxies bob gently around their spot.
        b.pos.x = b.home.x + Math.sin(t * 0.6 + i) * 0.12;
        b.pos.y = b.home.y + Math.cos(t * 0.5 + i * 2) * 0.12;
      }
      g.position.copy(b.pos);
      g.rotation.z += dt * 0.6;
    });

    const target = 0.5 + (s.merged / SMALL) * 1.0;
    s.size = THREE.MathUtils.damp(s.size, target, 3, dt);
    const fit = Math.min(1, (Math.min(viewport.width, viewport.height) * 0.3) / 1.6);
    if (bigRef.current) {
      bigRef.current.scale.setScalar(s.size * fit * (s.done ? 1.15 : 1));
      bigRef.current.rotation.z -= dt * (0.15 + s.merged * 0.06);
      s.tilt = THREE.MathUtils.damp(s.tilt, s.done ? -0.9 : -0.35, 1.5, dt);
      bigRef.current.rotation.x = s.tilt;
      (bigRef.current.material as THREE.PointsMaterial).size = 0.05 + s.merged * 0.006;
    }
    const merging = blobs.reduce((n, b) => n + (b.merged ? 1 : b.merging ? Math.min(1, (now - b.merging) / 0.9) : 0), 0);
    onProgress(merging / SMALL);
  });

  useEffect(
    () => () => {
      big.dispose();
      smallGeo.dispose();
      background.dispose();
    },
    [big, smallGeo, background],
  );

  return (
    <>
      <color attach="background" args={["#020414"]} />
      <points geometry={background}>
        <pointsMaterial map={tex} vertexColors size={0.08} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={bigRef} geometry={big}>
        <pointsMaterial map={tex} vertexColors size={0.05} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
      {blobs.map((b, i) => (
        <points key={i} ref={(el) => void (blobRefs.current[i] = el as THREE.Points | null)} geometry={smallGeo} position={b.home}>
          <pointsMaterial map={tex} color={TINTS[i % TINTS.length]} vertexColors size={0.1} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </points>
      ))}
    </>
  );
}
