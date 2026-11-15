"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import type { LevelId } from "./levels";
import { count, type Quality } from "./quality";
import type { SceneProps } from "./shared";
import { Hub, type HubProps } from "./world/Hub";
import { CameraRig } from "./world/CameraRig";
import { Dust, Nebula, paletteFor } from "./world/Atmosphere";
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

export type StageMode =
  | { kind: "hub"; hub: Omit<HubProps, "quality" | "still"> }
  | { kind: "warp"; color: string }
  | { kind: "level"; id: LevelId; attempt: number; color: string };

type StageProps = Omit<SceneProps, "quality"> & {
  mode: StageMode;
  quality: Quality;
  onSlow: () => void;
  /** Called once, after the first frames are on screen (shaders compiled). */
  onReady: () => void;
};

/**
 * The game's single WebGL canvas. Only the active world is mounted: the
 * universe map, the warp between levels, or one level.
 *
 * Resolution adapts to the device: when frames get slow the canvas draws fewer
 * pixels, step by step, and climbs back when there is room again. If even the
 * lowest step is too slow, the game switches to Lite graphics.
 */
export default function Stage({ mode, quality, onSlow, onReady, ...scene }: StageProps) {
  const top = quality === "high" ? Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1) : 1.25;
  const [dpr, setDpr] = useState(top);
  useEffect(() => setDpr(top), [top]);
  return (
    <Canvas
      className="game-canvas"
      dpr={dpr}
      gl={{ antialias: quality === "high", powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 400 }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        flipflops={4}
        onChange={({ factor }) => setDpr(Math.round((0.75 + (top - 0.75) * factor) * 20) / 20)}
        onFallback={onSlow}
      />
      <Ready onReady={onReady} />
      {mode.kind === "hub" ? <Hub quality={quality} still={scene.still} {...mode.hub} /> : null}
      {mode.kind === "warp" ? <Warp quality={quality} color={mode.color} still={scene.still} /> : null}
      {mode.kind === "level" ? <LevelScene key={`${mode.id}-${mode.attempt}`} id={mode.id} color={mode.color} quality={quality} {...scene} /> : null}
      {quality === "high" ? (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.35} luminanceSmoothing={0.2} />
          <Noise premultiply opacity={0.35} />
          <Vignette offset={0.3} darkness={0.75} />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}

/** Tells the page when the first frames have been drawn, so the title can reveal the world. */
function Ready({ onReady }: { onReady: () => void }) {
  const n = useRef(0);
  useFrame(() => {
    if (++n.current === 3) onReady();
  });
  return null;
}

function LevelScene({ id, color, ...props }: SceneProps & { id: LevelId; color: string }) {
  const Scene = SCENES[id];
  const sky = useMemo(() => paletteFor(color), [color]);
  return (
    <>
      <CameraRig still={props.still} kick={props.still ? 0 : 22} />
      <Nebula palette={sky} gain={0.42} />
      <Dust quality={props.quality} count={1100} box={26} size={0.035} tint={color} />
      <Scene {...props} />
    </>
  );
}

/** Time travel between levels: streaks of light rushing past. */
function Warp({ quality, color, still }: { quality: Quality; color: string; still: boolean }) {
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
  const sky = useMemo(() => paletteFor(color), [color]);

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
      <CameraRig still={still} fov={50} kick={still ? 0 : 30} />
      <Nebula palette={sky} gain={0.7} />
      <lineSegments geometry={geo}>
        <lineBasicMaterial vertexColors toneMapped={false} transparent blending={THREE.AdditiveBlending} />
      </lineSegments>
    </>
  );
}
