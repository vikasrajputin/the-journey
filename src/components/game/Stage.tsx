"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import type { Quality } from "./quality";
import { Journey, type JourneyProps } from "./world/Journey";

type StageProps = Omit<JourneyProps, "quality"> & {
  quality: Quality;
  onSlow: () => void;
  /** Called once, after the first frames are on screen (shaders compiled). */
  onReady: () => void;
};

/**
 * The single WebGL canvas for the whole chapter.
 *
 * Resolution adapts to the device: when frames get slow the canvas draws fewer
 * pixels, step by step, and climbs back when there is room again. If even the
 * lowest step is too slow, it switches to Lite graphics.
 */
export default function Stage({ quality, onSlow, onReady, ...journey }: StageProps) {
  const top = quality === "high" ? Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1) : 1.25;
  const [dpr, setDpr] = useState(top);
  useEffect(() => setDpr(top), [top]);
  return (
    <Canvas
      className="game-canvas"
      dpr={dpr}
      gl={{ antialias: quality === "high", powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 1, 34], fov: 60, near: 0.1, far: 400 }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        flipflops={4}
        onChange={({ factor }) => setDpr(Math.round((0.75 + (top - 0.75) * factor) * 20) / 20)}
        onFallback={onSlow}
      />
      <Ready onReady={onReady} />
      <Journey quality={quality} {...journey} />
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
