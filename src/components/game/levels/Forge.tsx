"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { count } from "../quality";
import { glowTexture, pointCloud, randomInSphere, type SceneProps } from "../shared";
import { useActionKey, useStagePointer } from "../input";

/** The fusion ladder of a big star, simplified. Each step needs a hotter, squeezed core. */
const ELEMENTS = [
  { symbol: "H", name: "Hydrogen", color: "#fff3b0" },
  { symbol: "He", name: "Helium", color: "#ffd23f" },
  { symbol: "C", name: "Carbon", color: "#ff9f1c" },
  { symbol: "O", name: "Oxygen", color: "#ff3d7f" },
  { symbol: "Si", name: "Silicon", color: "#b05cff" },
  { symbol: "Fe", name: "Iron", color: "#ff2d2d" },
] as const;
const TAPS_PER_STEP = 2;

/** Bright, bubbly star surface (granules), drawn once in code. White, so the core colour tints it. */
function surfaceTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#d9d9d9";
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 3 + Math.random() * 10;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const v = Math.random() > 0.5 ? 255 : 120;
    grad.addColorStop(0, `rgba(${v},${v},${v},0.7)`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Level 6: tap the star to squeeze its core and climb the element ladder.
 * Once it makes iron, the star collapses and explodes as a supernova,
 * scattering every element it made.
 */
export function Forge({ quality, onProgress, onWin, onStatus, sfx, still }: SceneProps) {
  const tex = glowTexture();
  const viewport = useThree((s) => s.viewport);
  const camera = useThree((s) => s.camera);
  const R = Math.min(1.25, viewport.width / 3.6);

  const debris = useMemo(() => {
    const cols = ELEMENTS.map((e) => new THREE.Color(e.color));
    return pointCloud(count(quality, 5000), (i, p, c) => {
      randomInSphere(p, 1);
      p.multiplyScalar(0.3 + 0.7 * Math.sqrt(p.length()));
      c.copy(cols[i % cols.length]);
    });
  }, [quality]);

  const surface = useMemo(() => surfaceTexture(), []);
  const star = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Sprite>(null);
  const shell = useRef<THREE.Points>(null);
  const ring = useRef<THREE.Mesh>(null);
  const s = useRef({ taps: 0, step: 0, squeeze: 0, collapse: 0, boom: 0, done: false });
  const color = useRef(new THREE.Color(ELEMENTS[0].color));

  const status = (step: number) =>
    onStatus({
      label: step < ELEMENTS.length - 1 ? `Making: ${ELEMENTS[step + 1].name}` : "Iron! The star can't make energy any more...",
      chips: ELEMENTS.map((e, i) => ({ text: e.symbol, title: e.name, on: i <= step })),
    });

  useEffect(() => {
    onProgress(0);
    status(0);
    return () => onStatus(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tap = () => {
    const st = s.current;
    if (st.collapse) return;
    st.taps += 1;
    st.squeeze = 1;
    sfx("divide");
    if (st.taps % TAPS_PER_STEP === 0) {
      st.step += 1;
      sfx("chime");
      status(st.step);
      if (st.step === ELEMENTS.length - 1) {
        st.collapse = performance.now() / 1000 + 1.2;
      }
    }
    onProgress((st.taps / (TAPS_PER_STEP * (ELEMENTS.length - 1))) * 0.75);
  };

  useStagePointer({ down: tap });
  useActionKey(tap);

  useFrame((state, dt) => {
    const st = s.current;
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    st.squeeze = THREE.MathUtils.damp(st.squeeze, 0, 7, dt);
    color.current.lerp(new THREE.Color(ELEMENTS[st.step].color), 1 - Math.exp(-dt * 4));

    let scale = 1 - st.squeeze * 0.12 + Math.sin(t * 2) * 0.02;
    if (st.collapse && now > st.collapse) {
      const c = now - st.collapse;
      scale = Math.max(0.05, 1 - c * 2.2);
      if (c > 0.45 && !st.boom) {
        st.boom = t;
        sfx("bang");
      }
    }
    if (star.current) {
      star.current.scale.setScalar(scale * R);
      star.current.visible = !st.boom;
      star.current.rotation.y += dt * 0.3;
      const core = star.current.children[0] as THREE.Mesh;
      (core.material as THREE.MeshBasicMaterial).color.copy(color.current).multiplyScalar(1.1 + st.squeeze * 1.5);
    }
    if (halo.current) {
      halo.current.visible = !st.boom;
      halo.current.scale.setScalar(R * (3.4 + st.squeeze * 0.8) * scale);
      (halo.current.material as THREE.SpriteMaterial).color.copy(color.current);
    }

    if (st.boom) {
      const age = t - st.boom;
      const r = 0.1 + 6 * (1 - Math.exp(-age * 2)) + age * 0.4;
      if (shell.current) {
        shell.current.visible = true;
        shell.current.scale.setScalar(r);
        shell.current.rotation.y += dt * 0.2;
      }
      if (ring.current) {
        ring.current.scale.setScalar(0.5 + age * 6);
        (ring.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - age * 0.7);
      }
      if (!still && age < 0.7) {
        camera.position.x = (Math.random() - 0.5) * 0.2;
        camera.position.y = (Math.random() - 0.5) * 0.2;
      } else camera.position.x = camera.position.y = 0;
      onProgress(Math.min(1, 0.75 + age / 2.4));
      if (age > 2.4 && !st.done) {
        st.done = true;
        onWin();
      }
    }
  });

  useEffect(
    () => () => {
      debris.dispose();
      surface.dispose();
      camera.position.set(0, 0, 10);
    },
    [debris, surface, camera],
  );

  return (
    <>
      <color attach="background" args={["#12021f"]} />
      <group ref={star}>
        <mesh>
          <icosahedronGeometry args={[1, 5]} />
          <meshBasicMaterial map={surface} color="#fff3b0" toneMapped={false} />
        </mesh>
        <mesh scale={1.04}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
      <sprite ref={halo}>
        <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <points ref={shell} geometry={debris} visible={false}>
        <pointsMaterial map={tex} vertexColors size={0.12} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
      <mesh ref={ring}>
        <ringGeometry args={[0.9, 1, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
