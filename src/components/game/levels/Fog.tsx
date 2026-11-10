"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { count } from "../quality";
import { glowTexture, pointCloud, type SceneProps } from "../shared";
import { useActionKey, useStagePointer } from "../input";

const GOAL = 0.8;

/**
 * A blotchy oval in blue, yellow and orange: a game picture inspired by maps of the
 * cosmic microwave background. It is drawn in code here, not the real Planck map.
 */
function cmbTexture() {
  const w = 512;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.save();
  g.beginPath();
  g.ellipse(w / 2, h / 2, w / 2 - 4, h / 2 - 4, 0, 0, Math.PI * 2);
  g.clip();
  g.fillStyle = "#1c6dff";
  g.fillRect(0, 0, w, h);
  const cols = ["#ff8a1a", "#ffd23f", "#2bc4ff", "#0b3dff", "#ff4d1a", "#7fe0ff"];
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 4 + Math.random() * 16;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const col = cols[Math.floor(Math.random() * cols.length)];
    grad.addColorStop(0, col);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.globalAlpha = 0.55;
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Level 4: the universe is a glowing fog. Swipe through it; where the fog
 * clears, electrons settle into atoms and the first free light shines through.
 */
export function Fog({ quality, onProgress, onWin, sfx }: SceneProps) {
  const tex = glowTexture();
  const viewport = useThree((s) => s.viewport);
  const cmb = useMemo(() => cmbTexture(), []);

  const puffs = useMemo(() => {
    const W = viewport.width + 1.5;
    const H = viewport.height + 1.5;
    const cell = quality === "high" ? 0.55 : 0.75;
    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);
    const out: { x: number; y: number; s: number; clear: number; onScreen: boolean }[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = -W / 2 + (c + 0.5) * cell + (Math.random() - 0.5) * cell * 0.5;
        const y = -H / 2 + (r + 0.5) * cell + (Math.random() - 0.5) * cell * 0.5;
        // Only fog the player can see (and reach) counts towards the goal.
        const onScreen = Math.abs(x) < viewport.width / 2 - 0.3 && Math.abs(y) < viewport.height / 2 - 0.3;
        out.push({ x, y, s: cell * (2.4 + Math.random()), clear: 0, onScreen });
      }
    return out;
  }, [viewport.width, viewport.height, quality]);

  const electrons = useMemo(() => {
    const cyan = new THREE.Color("#7ff6ff");
    return pointCloud(count(quality, 260), (_, p, c) => {
      p.set((Math.random() - 0.5) * viewport.width, (Math.random() - 0.5) * viewport.height, 0.6);
      c.copy(cyan);
    });
  }, [quality, viewport.width, viewport.height]);
  const vel = useMemo(() => Float32Array.from({ length: electrons.attributes.position.count * 2 }, () => (Math.random() - 0.5) * 6), [electrons]);

  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const eRef = useRef<THREE.Points>(null);
  const cmbRef = useRef<THREE.Mesh>(null);
  const s = useRef({ down: false, done: 0, cleared: 0, ping: 0 });

  useEffect(() => onProgress(0), [onProgress]);

  const last = useRef<THREE.Vector3 | null>(null);
  /** Clears along the whole path from the last pointer spot, so fast swipes leave no gaps. */
  const sweep = (p: THREE.Vector3, amount: number) => {
    const from = last.current ?? p;
    const steps = Math.max(1, Math.ceil(from.distanceTo(p) / 0.35));
    const q = new THREE.Vector3();
    for (let i = 1; i <= steps; i++) clearAt(q.lerpVectors(from, p, i / steps), amount);
    last.current = p.clone();
  };
  const clearAt = (p: THREE.Vector3, amount: number) => {
    const R = 1.2;
    for (const f of puffs) {
      const d = Math.hypot(f.x - p.x, f.y - p.y);
      if (d < R) f.clear = Math.min(1, f.clear + amount * (1 - d / R));
    }
  };

  useStagePointer({
    down: (p) => {
      s.current.down = true;
      last.current = null;
      sweep(p, 0.4);
    },
    move: (p, e) => {
      // Mice clear the fog just by moving across it; fingers while touching.
      if (s.current.down || e.pointerType === "mouse") sweep(p, 0.3);
      else last.current = null;
    },
    up: () => {
      s.current.down = false;
      last.current = null;
    },
  });
  useActionKey(() => {
    const p = new THREE.Vector3((Math.random() - 0.5) * viewport.width, (Math.random() - 0.5) * viewport.height, 0);
    clearAt(p, 1);
    clearAt(p.multiplyScalar(-1), 1);
  });

  useFrame((state, dt) => {
    const st = s.current;
    const t = state.clock.elapsedTime;
    let sum = 0;
    let n = 0;
    puffs.forEach((f, i) => {
      if (st.done) f.clear = Math.min(1, f.clear + dt * 0.8);
      if (f.onScreen) {
        sum += f.clear;
        n += 1;
      }
      const m = meshes.current[i];
      if (!m) return;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - f.clear) * 0.85;
      m.rotation.z += dt * 0.05 * ((i % 3) - 1);
      m.position.x = f.x + Math.sin(t * 0.4 + i) * 0.05;
    });
    const k = sum / Math.max(1, n);
    onProgress(Math.min(1, k / GOAL));
    if (k - st.cleared > 0.06) {
      st.cleared = k;
      sfx("spark");
    }

    // Electrons zip about in the fog, and calm down as atoms form.
    if (eRef.current) {
      const pos = eRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const speed = 1 - Math.min(1, k / GOAL) * 0.9;
      const hw = viewport.width / 2;
      const hh = viewport.height / 2;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i) + vel[i * 2] * dt * speed;
        let y = pos.getY(i) + vel[i * 2 + 1] * dt * speed;
        if (x > hw) x = -hw;
        if (x < -hw) x = hw;
        if (y > hh) y = -hh;
        if (y < -hh) y = hh;
        pos.setXY(i, x, y);
      }
      pos.needsUpdate = true;
      (eRef.current.material as THREE.PointsMaterial).opacity = 1 - Math.min(1, k / GOAL) * 0.7;
    }
    if (cmbRef.current) {
      const m = cmbRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = THREE.MathUtils.damp(m.opacity, Math.min(1, k * 1.15), 3, dt);
    }

    if (k >= GOAL && !st.done) {
      st.done = t;
      sfx("shimmer");
      window.setTimeout(onWin, 1800);
    }
  });

  useEffect(
    () => () => {
      cmb.dispose();
      electrons.dispose();
    },
    [cmb, electrons],
  );

  const cmbW = Math.min(viewport.width * 0.92, viewport.height * 1.6);
  return (
    <>
      <color attach="background" args={["#05030a"]} />
      <mesh ref={cmbRef} position={[0, 0, -0.5]}>
        <planeGeometry args={[cmbW, cmbW / 2]} />
        <meshBasicMaterial map={cmb} transparent opacity={0} toneMapped={false} />
      </mesh>
      {puffs.map((f, i) => (
        <mesh key={i} ref={(el) => void (meshes.current[i] = el)} position={[f.x, f.y, (i % 7) * 0.02]} rotation-z={i}>
          <planeGeometry args={[f.s, f.s]} />
          <meshBasicMaterial map={tex} color={i % 3 ? "#ff7a1a" : "#ffb020"} transparent opacity={0.8} depthWrite={false} />
        </mesh>
      ))}
      <points ref={eRef} geometry={electrons}>
        <pointsMaterial map={tex} vertexColors size={0.16} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
    </>
  );
}
