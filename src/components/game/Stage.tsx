"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import type { LevelId } from "./levels";
import { count, type Quality } from "./quality";
import { glowTexture, pointCloud, type SceneProps } from "./shared";
import { Bang } from "./levels/Bang";
import { Stretch } from "./levels/Stretch";
import { Nuclei } from "./levels/Nuclei";
import { Fog } from "./levels/Fog";
import { Stars } from "./levels/Stars";
import { Forge } from "./levels/Forge";
import { Galaxies } from "./levels/Galaxies";

const SCENES: Record<LevelId, (p: SceneProps) => React.ReactElement> = {
  bang: Bang,
  stretch: Stretch,
  nuclei: Nuclei,
  fog: Fog,
  stars: Stars,
  forge: Forge,
  galaxies: Galaxies,
};

export type StageMode = { kind: "title" } | { kind: "warp"; color: string } | { kind: "level"; id: LevelId; attempt: number };

type StageProps = Omit<SceneProps, "quality"> & {
  mode: StageMode;
  quality: Quality;
  onSlow: () => void;
};

/** The game's single WebGL canvas. Only the active scene is mounted. */
export default function Stage({ mode, quality, onSlow, ...scene }: StageProps) {
  return (
    <Canvas
      className="game-canvas"
      dpr={quality === "high" ? [1, 2] : [1, 1.25]}
      gl={{ antialias: quality === "high", powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 200 }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={onSlow} />
      {mode.kind === "title" ? <Title quality={quality} /> : null}
      {mode.kind === "warp" ? <Warp quality={quality} color={mode.color} /> : null}
      {mode.kind === "level" ? <LevelScene key={`${mode.id}-${mode.attempt}`} id={mode.id} quality={quality} {...scene} /> : null}
      {quality === "high" ? (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.35} luminanceSmoothing={0.2} />
          <Vignette offset={0.3} darkness={0.75} />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}

function LevelScene({ id, ...props }: SceneProps & { id: LevelId }) {
  const Scene = SCENES[id];
  return <Scene {...props} />;
}

/** Title screen: a slowly turning, colourful spiral of light. */
function Title({ quality }: { quality: Quality }) {
  const tex = glowTexture();
  const geo = useMemo(() => {
    const pal = ["#ffb020", "#ff3d7f", "#b05cff", "#3ee0ff", "#2bff88", "#ffe14d"].map((c) => new THREE.Color(c));
    return pointCloud(count(quality, 9000), (i, p, c) => {
      const r = 0.3 + Math.pow(Math.random(), 0.6) * 6;
      const a = r * 1.4 + (i % 3) * ((Math.PI * 2) / 3) + (Math.random() - 0.5) * 0.7;
      p.set(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.6);
      c.copy(pal[Math.floor((r / 6.3) * pal.length) % pal.length]);
    });
  }, [quality]);
  const ref = useRef<THREE.Points>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.z += dt * 0.06;
    ref.current.rotation.x = -0.95 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
  });
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <>
      <color attach="background" args={["#05010f"]} />
      <points ref={ref} geometry={geo} position={[0, -0.6, 0]}>
        <pointsMaterial map={tex} vertexColors size={0.09} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
    </>
  );
}

/** Time travel between levels: streaks of light rushing past. */
function Warp({ quality, color }: { quality: Quality; color: string }) {
  const n = count(quality, 700);
  const geo = useMemo(() => {
    const pos = new Float32Array(n * 6);
    const col = new Float32Array(n * 6);
    const a = new THREE.Color(color);
    const b = new THREE.Color("#ffffff");
    for (let i = 0; i < n; i++) {
      const r = 0.6 + Math.random() * 7;
      const t = Math.random() * Math.PI * 2;
      const z = -80 + Math.random() * 90;
      pos.set([Math.cos(t) * r, Math.sin(t) * r, z, Math.cos(t) * r, Math.sin(t) * r, z - 2], i * 6);
      const c = Math.random() > 0.5 ? a : b;
      col.set([c.r, c.g, c.b, 0, 0, 0], i * 6);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [n, color]);

  useFrame((_, dt) => {
    const p = geo.attributes.position as THREE.BufferAttribute;
    const arr = p.array as Float32Array;
    const v = 70 * dt;
    for (let i = 0; i < n; i++) {
      const o = i * 6;
      arr[o + 2] += v;
      arr[o + 5] = arr[o + 2] - 3.5;
      if (arr[o + 2] > 10) {
        arr[o + 2] = -80;
        arr[o + 5] = -83.5;
      }
    }
    p.needsUpdate = true;
  });
  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <>
      <color attach="background" args={["#020008"]} />
      <lineSegments geometry={geo}>
        <lineBasicMaterial vertexColors toneMapped={false} transparent blending={THREE.AdditiveBlending} />
      </lineSegments>
    </>
  );
}
