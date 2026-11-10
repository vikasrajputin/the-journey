"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { count } from "../quality";
import { glowTexture, pointCloud, type SceneProps } from "../shared";
import { useActionKey, useStagePointer } from "../input";

const GOAL = 5;
const PROTON = "#ff3b3b";
const NEUTRON = "#3d8bff";

type Cluster = { id: number; home: THREE.Vector3; vel: THREE.Vector3; fused: number; born: number };

/**
 * Level 3: a hot soup of protons (red) and neutrons (blue). Glowing groups of
 * two of each drift past; tap one to fuse it into a helium nucleus (yellow).
 */
export function Nuclei({ quality, onProgress, onWin, onStatus, sfx }: SceneProps) {
  const tex = glowTexture();
  const viewport = useThree((s) => s.viewport);
  const halfW = Math.min(viewport.width / 2 - 0.6, 3.2);
  const halfH = Math.min(viewport.height / 2 - 1.1, 2.6);

  const soup = useMemo(() => {
    const red = new THREE.Color(PROTON);
    const blue = new THREE.Color(NEUTRON);
    return pointCloud(count(quality, 900), (i, p, c) => {
      p.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 9, -1 - Math.random() * 3);
      c.copy(i % 2 ? red : blue);
    });
  }, [quality]);

  const nextId = useRef(0);
  const spawn = (): Cluster => ({
    id: nextId.current++,
    home: new THREE.Vector3((Math.random() * 2 - 1) * halfW, (Math.random() * 2 - 1) * halfH, 0),
    vel: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).multiplyScalar(0.5),
    fused: 0,
    born: performance.now() / 1000,
  });

  const [clusters, setClusters] = useState<Cluster[]>(() => [spawn(), spawn(), spawn()]);
  const made = useRef(0);
  const done = useRef(false);
  const groups = useRef(new Map<number, THREE.Group>());
  const soupRef = useRef<THREE.Points>(null);

  const report = () => {
    onProgress(made.current / GOAL);
    onStatus({ label: `Helium made: ${made.current} of ${GOAL}` });
  };
  useEffect(() => {
    report();
    return () => onStatus(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fuse = (c: Cluster) => {
    if (c.fused || done.current) return;
    c.fused = performance.now() / 1000;
    made.current += 1;
    sfx("divide");
    report();
    window.setTimeout(() => {
      setClusters((list) => {
        const rest = list.filter((x) => x.id !== c.id);
        const live = rest.filter((x) => !x.fused).length;
        if (made.current + live < GOAL) rest.push(spawn());
        return rest;
      });
    }, 1400);
    if (made.current >= GOAL) {
      done.current = true;
      window.setTimeout(() => sfx("shimmer"), 500);
      window.setTimeout(onWin, 1600);
    }
  };

  const nearest = (p: THREE.Vector3) => {
    let best: Cluster | undefined;
    let bestD = 1.0; // generous hit radius in world units
    for (const c of clusters) {
      if (c.fused) continue;
      const g = groups.current.get(c.id);
      const d = g ? g.position.distanceTo(p) : Infinity;
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    return best;
  };

  useStagePointer({
    down: (p) => {
      const c = nearest(p);
      if (c) fuse(c);
    },
  });
  useActionKey(() => {
    const c = clusters.find((x) => !x.fused);
    if (c) fuse(c);
  });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (soupRef.current) {
      soupRef.current.rotation.z = Math.sin(t * 0.1) * 0.2;
      soupRef.current.position.x = Math.sin(t * 0.7) * 0.05;
    }
    const now = performance.now() / 1000;
    for (const c of clusters) {
      const g = groups.current.get(c.id);
      if (!g) continue;
      const age = now - c.born;
      if (!c.fused) {
        c.home.addScaledVector(c.vel, dt);
        if (Math.abs(c.home.x) > halfW) c.vel.x *= -1;
        if (Math.abs(c.home.y) > halfH) c.vel.y *= -1;
        g.position.copy(c.home);
        g.scale.setScalar(Math.min(1, age * 2));
      }
      const parts = g.children[0] as THREE.Group;
      const he = g.children[1] as THREE.Mesh;
      const halo = g.children[2] as THREE.Sprite;
      const f = c.fused ? Math.min(1, (now - c.fused) / 0.35) : 0;
      parts.children.forEach((m, i) => {
        const a = t * 3 + i * (Math.PI / 2) + c.id;
        const r = (0.38 + Math.sin(t * 6 + i) * 0.06) * (1 - f);
        m.position.set(Math.cos(a) * r, Math.sin(a * 1.3) * r, Math.sin(a) * r * 0.5);
      });
      parts.visible = f < 1;
      he.visible = f > 0.6;
      he.scale.setScalar(f > 0.6 ? 1 + Math.sin(t * 5) * 0.06 : 0.01);
      const hm = halo.material as THREE.SpriteMaterial;
      hm.color.set(c.fused ? "#ffe14d" : "#ffffff");
      hm.opacity = c.fused ? 0.9 : 0.35 + Math.sin(t * 4 + c.id) * 0.2;
      halo.scale.setScalar(c.fused ? 1.6 + f * 0.6 : 1.5);
    }
  });

  useEffect(() => () => soup.dispose(), [soup]);

  return (
    <>
      <color attach="background" args={["#2a0712"]} />
      <points ref={soupRef} geometry={soup}>
        <pointsMaterial map={tex} vertexColors size={0.12} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
      </points>
      {clusters.map((c) => (
        <group key={c.id} ref={(g) => void (g ? groups.current.set(c.id, g) : groups.current.delete(c.id))}>
          <group>
            {[PROTON, NEUTRON, PROTON, NEUTRON].map((col, i) => (
              <mesh key={i}>
                <sphereGeometry args={[0.16, 20, 20]} />
                <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.9} roughness={0.35} />
              </mesh>
            ))}
          </group>
          <mesh>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial color="#ffe14d" emissive="#ffc400" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          <sprite>
            <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      ))}
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 4, 6]} intensity={60} />
    </>
  );
}
