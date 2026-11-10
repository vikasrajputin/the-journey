"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { count, type Quality } from "../quality";
import { glowTexture, pointCloud, randomInSphere, type SceneProps } from "../shared";
import { useActionKey, useStagePointer } from "../input";

const HOT = ["#ffffff", "#fff3b0", "#ffd23f", "#ff9f1c", "#ff5d8f", "#c49bff", "#3ee0ff"];

function useBurst(quality: Quality) {
  return useMemo(() => {
    const pal = HOT.map((c) => new THREE.Color(c));
    return pointCloud(count(quality, 7000), (_, p, c) => {
      randomInSphere(p, 1);
      // Push most particles towards the shell so the burst reads as a growing sphere.
      p.multiplyScalar(0.35 + 0.65 * Math.sqrt(p.length()));
      c.copy(pal[Math.floor(Math.random() * pal.length)]);
    });
  }, [quality]);
}

/**
 * Level 1: a tiny, hot speck. Press and hold to charge it; at full charge,
 * space bursts outward and keeps on stretching.
 */
export function Bang({ quality, onProgress, onWin, sfx, still }: SceneProps) {
  const geo = useBurst(quality);
  const tex = glowTexture();
  const camera = useThree((s) => s.camera);

  const dot = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const burst = useRef<THREE.Points>(null);
  const flash = useRef<THREE.Mesh>(null);
  const s = useRef({ holding: false, charge: 0, banged: 0, done: false });

  useEffect(() => {
    onProgress(0);
  }, [onProgress]);

  const press = () => {
    if (!s.current.banged) s.current.holding = true;
  };
  const release = () => {
    s.current.holding = false;
  };
  useStagePointer({ down: press, up: release });
  useActionKey(press, release);

  useFrame((state, dt) => {
    const st = s.current;
    const t = state.clock.elapsedTime;
    if (!st.banged) {
      st.charge = THREE.MathUtils.clamp(st.charge + (st.holding ? dt / 1.8 : -dt / 2.5), 0, 1);
      onProgress(st.charge * 0.6);
      const pulse = 1 + Math.sin(t * (4 + st.charge * 18)) * (0.08 + st.charge * 0.12);
      const shake = still ? 0 : st.charge * 0.04;
      if (dot.current) {
        dot.current.scale.setScalar((0.6 + st.charge * 1.6) * pulse);
        dot.current.position.set((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake, 0);
      }
      if (ring.current) {
        const m = ring.current.material as THREE.MeshBasicMaterial;
        m.opacity = 0.25 + st.charge * 0.75;
        ring.current.scale.setScalar(1.6 - st.charge * 0.9);
        ring.current.rotation.z += dt * (0.5 + st.charge * 6);
      }
      if (st.charge >= 1) {
        st.banged = t;
        st.holding = false;
        sfx("bang");
        if (dot.current) dot.current.visible = false;
        if (ring.current) ring.current.visible = false;
        if (burst.current) burst.current.visible = true;
      }
      return;
    }

    const age = t - st.banged;
    // Fast at first, then a slow, endless stretch.
    const r = 0.05 + 7 * (1 - Math.exp(-age * 2.2)) + age * 0.6;
    if (burst.current) {
      burst.current.scale.setScalar(r);
      burst.current.rotation.y += dt * 0.08;
      burst.current.rotation.x += dt * 0.03;
      const m = burst.current.material as THREE.PointsMaterial;
      m.size = 0.06 + 0.12 * Math.exp(-age * 1.5);
    }
    if (flash.current) {
      const m = flash.current.material as THREE.MeshBasicMaterial;
      m.opacity = still ? 0 : Math.max(0, 1 - age * 1.6);
    }
    if (!still && age < 0.8) {
      camera.position.x = (Math.random() - 0.5) * 0.25 * (1 - age / 0.8);
      camera.position.y = (Math.random() - 0.5) * 0.25 * (1 - age / 0.8);
    } else {
      camera.position.x = camera.position.y = 0;
    }
    onProgress(Math.min(1, 0.6 + age / 2.5));
    if (age > 2.6 && !st.done) {
      st.done = true;
      onWin();
    }
  });

  useEffect(() => () => void camera.position.set(0, 0, 10), [camera]);
  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <>
      <color attach="background" args={["#020106"]} />
      <group ref={dot}>
        <mesh>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshBasicMaterial color={[4, 3.2, 1.6]} toneMapped={false} />
        </mesh>
        <sprite scale={1.6}>
          <spriteMaterial map={tex} color="#ffb020" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <sprite scale={3.2}>
          <spriteMaterial map={tex} color="#ff3d7f" opacity={0.5} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
      <mesh ref={ring}>
        <ringGeometry args={[0.95, 1, 64, 1, 0, Math.PI * 1.6]} />
        <meshBasicMaterial color="#ffd23f" transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <points ref={burst} geometry={geo} visible={false} scale={0.05}>
        <pointsMaterial
          map={tex}
          vertexColors
          size={0.15}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
      <mesh ref={flash} position={[0, 0, 5]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial color="#fff6d8" transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}
