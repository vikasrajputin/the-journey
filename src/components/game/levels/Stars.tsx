"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { count } from "../quality";
import { glowTexture, pointCloud, randomInSphere, type SceneProps } from "../shared";
import { useActionKey, useStagePointer } from "../input";

const STAR_COLOURS = ["#9fd8ff", "#ffffff", "#c9b8ff"];
const COLD = new THREE.Color("#6a3dff");
const HOT = new THREE.Color("#bff4ff");

type Cloud = { pos: THREE.Vector3; squeeze: number; lit: number };

/**
 * Level 5: the cosmic dark ages. Hold on a cloud of gas and gravity pulls it
 * tighter and hotter until fusion starts and a star switches on.
 */
export function Stars({ quality, onProgress, onWin, onStatus, sfx }: SceneProps) {
  const tex = glowTexture();
  const viewport = useThree((s) => s.viewport);
  const portrait = viewport.height > viewport.width;

  const clouds = useMemo<Cloud[]>(() => {
    const d = portrait ? Math.min(1.9, viewport.height / 4.2) : Math.min(2.8, viewport.width / 3.6);
    const spots = portrait
      ? [new THREE.Vector3(-0.35, d, 0), new THREE.Vector3(0.45, 0, 0), new THREE.Vector3(-0.3, -d, 0)]
      : [new THREE.Vector3(-d, 0.4, 0), new THREE.Vector3(0, -0.4, 0), new THREE.Vector3(d, 0.4, 0)];
    return spots.map((pos) => ({ pos, squeeze: 0, lit: 0 }));
  }, [portrait, viewport.width, viewport.height]);

  const geos = useMemo(
    () =>
      clouds.map(() =>
        pointCloud(count(quality, 700), (_, p, c) => {
          randomInSphere(p, 1);
          p.z *= 0.5;
          c.set(Math.random() > 0.6 ? "#ff8fc8" : "#ffffff").multiplyScalar(0.6 + Math.random() * 0.4);
        }),
      ),
    [clouds, quality],
  );

  const gas = useRef<(THREE.Points | null)[]>([]);
  const cores = useRef<(THREE.Sprite | null)[]>([]);
  const stars = useRef<(THREE.Group | null)[]>([]);
  const active = useRef<number | null>(null);
  const done = useRef(false);
  const radius = Math.min(1, viewport.width / 4.4);

  const lit = () => clouds.filter((c) => c.lit).length;
  useEffect(() => {
    onProgress(0);
    onStatus({ label: `Stars lit: 0 of ${clouds.length}` });
    return () => onStatus(null);
  }, [clouds.length, onProgress, onStatus]);

  const pick = (p: THREE.Vector3) => {
    let best: number | null = null;
    let bestD = radius * 1.5;
    clouds.forEach((c, i) => {
      const d = c.pos.distanceTo(p);
      if (!c.lit && d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  };

  useStagePointer({
    down: (p) => {
      active.current = pick(p);
    },
    up: () => {
      active.current = null;
    },
  });
  useActionKey(
    () => {
      const i = clouds.findIndex((c) => !c.lit);
      active.current = i >= 0 ? i : null;
    },
    () => {
      active.current = null;
    },
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    clouds.forEach((c, i) => {
      if (!c.lit) {
        const holding = active.current === i;
        c.squeeze = THREE.MathUtils.clamp(c.squeeze + (holding ? dt / 2.2 : -dt / 4), 0, 1);
        if (c.squeeze >= 1) {
          c.lit = t;
          active.current = null;
          sfx("spark");
          sfx("chime");
          onStatus({ label: `Stars lit: ${lit()} of ${clouds.length}` });
          if (lit() === clouds.length && !done.current) {
            done.current = true;
            window.setTimeout(() => sfx("shimmer"), 400);
            window.setTimeout(onWin, 1800);
          }
        }
      }
      const g = gas.current[i];
      if (g) {
        const k = c.lit ? 1 : c.squeeze;
        g.scale.setScalar(radius * (1 - k * 0.82) * (1 + Math.sin(t * 2 + i) * 0.03));
        g.rotation.z += dt * (0.2 + k * 3);
        const m = g.material as THREE.PointsMaterial;
        m.color.copy(COLD).lerp(HOT, k);
        m.opacity = c.lit ? Math.max(0, 1 - (t - c.lit) * 1.5) : 0.9;
        g.visible = m.opacity > 0.01;
      }
      const core = cores.current[i];
      if (core) {
        const k = c.lit ? 0 : c.squeeze;
        core.scale.setScalar(0.2 + k * 1.2);
        (core.material as THREE.SpriteMaterial).opacity = k;
      }
      const star = stars.current[i];
      if (star) {
        const age = c.lit ? t - c.lit : -1;
        star.visible = age >= 0;
        if (age >= 0) {
          const pop = Math.min(1, age * 3);
          star.scale.setScalar((0.6 + 0.4 * pop + Math.sin(t * 3 + i) * 0.03) * (radius / 1));
          const ring = star.children[2] as THREE.Mesh;
          ring.scale.setScalar(1 + age * 4);
          (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - age * 0.8);
        }
      }
    });
    const total = clouds.reduce((n, c) => n + (c.lit ? 1 : c.squeeze), 0);
    onProgress(total / clouds.length);
  });

  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);

  return (
    <>
      <color attach="background" args={["#010008"]} />
      {clouds.map((c, i) => (
        <group key={i} position={c.pos}>
          <points ref={(el) => void (gas.current[i] = el as THREE.Points | null)} geometry={geos[i]}>
            <pointsMaterial map={tex} vertexColors size={0.09} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </points>
          <sprite ref={(el) => void (cores.current[i] = el)}>
            <spriteMaterial map={tex} color="#ffffff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>
          <group ref={(el) => void (stars.current[i] = el)} visible={false}>
            <mesh>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshBasicMaterial color={new THREE.Color(STAR_COLOURS[i % 3]).multiplyScalar(3)} toneMapped={false} />
            </mesh>
            <sprite scale={1.8}>
              <spriteMaterial map={tex} color={STAR_COLOURS[i % 3]} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
            </sprite>
            <mesh>
              <ringGeometry args={[0.3, 0.34, 64]} />
              <meshBasicMaterial color="#3ee0ff" transparent opacity={0} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}
    </>
  );
}
