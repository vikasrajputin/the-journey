"use client";

import { useEffect, useRef } from "react";
import type { Era } from "@/lib/era-warp";
import type * as T from "three";
import { isTouch, prefersStill } from "@/components/motion/motion-pref";

const LENGTH = 60; // how far the camera flies, in scene units

const STREAK_VERT = /* glsl */ `
  uniform float uStretch;
  attribute float aEnd;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.z += aEnd * uStretch;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = smoothstep(34.0, 3.0, -mv.z) * smoothstep(0.0, 1.5, -mv.z) * (1.0 - aEnd * 0.85);
  }
`;
const STREAK_FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() { gl_FragColor = vec4(uColor, vAlpha); }
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * The opening of each chapter: scroll, and a little astronaut explorer flies
 * with you down a tunnel made of that era (stardust, molten rock, bubbles,
 * ferns, embers...), the big words burst past, and you come out into the
 * chapter. Built from simple 3D shapes; an artist's impression, labelled so.
 * Skipped completely when motion is reduced.
 */
export function EraWarp({ era, question, slug }: { era: Era; question: string; slug: string }) {
  const section = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const ask = useRef<HTMLParagraphElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const when = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const sec = section.current;
    const el = host.current;
    if (!sec || !el || prefersStill()) return;
    let disposed = false;
    let cleanup = () => {};
    const touch = isTouch();

    // ----- scroll progress and the HTML layer, which work even without WebGL -----
    const wordEls = Array.from(words.current?.querySelectorAll<HTMLElement>("[data-w]") ?? []);
    const spread = wordEls.map((_, i) => {
      const n = wordEls.length;
      const x = n > 1 ? (i / (n - 1)) * 2 - 1 : 0;
      return { x: x * 1.7 + (i % 2 ? 0.2 : -0.2), y: (i % 2 ? 0.8 : -0.7) * (0.6 + Math.abs(x) * 0.6) };
    });
    let target = 0;
    let sp = 0;
    const read = () => {
      const r = sec.getBoundingClientRect();
      target = clamp01(-r.top / Math.max(1, r.height - innerHeight));
    };
    const paintHtml = () => {
      const k = smooth(0, 0.42, sp);
      const e = k * k;
      wordEls.forEach((w, i) => {
        const s = spread[i];
        w.style.transform = `translate3d(${(s.x * e * 70).toFixed(2)}vw, ${(s.y * e * 45).toFixed(2)}vh, 0) scale(${(1 + e * 3.2).toFixed(3)})`;
        w.style.opacity = String(1 - smooth(0.5, 1, k));
      });
      if (hint.current) hint.current.style.opacity = String(1 - smooth(0, 0.08, sp));
      if (when.current) when.current.style.opacity = String(1 - smooth(0.02, 0.18, sp));
      if (ask.current) {
        const a = smooth(0.4, 0.5, sp) * (1 - smooth(0.78, 0.86, sp));
        ask.current.style.opacity = String(a);
        ask.current.style.transform = `translate3d(0, ${((1 - a) * 24).toFixed(1)}px, 0) scale(${(0.96 + a * 0.04).toFixed(3)})`;
      }
      if (flash.current) flash.current.style.opacity = String(smooth(0.86, 0.98, sp) * (1 - smooth(0.995, 1, sp) * 0.6));
    };

    // ----- the 3D flight -----
    let renderFrame: (dt: number, t: number) => void = () => {};
    void import("three").then((THREE) => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: !touch, alpha: false, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the painted background and the words still play
      }
      const dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.25 : 1.75);
      renderer.setPixelRatio(dpr);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const sky = new THREE.Color(era.sky);
      renderer.setClearColor(sky, 1);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(sky, 5, 30);
      const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 60);
      const [c0, c1, c2] = era.colors.map((c) => new THREE.Color(c));

      scene.add(new THREE.HemisphereLight(0xffffff, sky, 0.7));
      const key = new THREE.DirectionalLight(0xffffff, 1.5);
      key.position.set(2, 3, 4);
      scene.add(key);
      // a coloured rim light from behind, so the explorer glows in the era's colour
      const rim = new THREE.DirectionalLight(c1, 2.4);
      rim.position.set(-3, 1, -4);
      scene.add(rim);
      const glow = new THREE.PointLight(c0, 10, 8, 1.6);
      scene.add(glow);

      // Tunnel of era "things"
      const shapes: Record<Era["shape"], () => T.BufferGeometry> = {
        spark: () => new THREE.OctahedronGeometry(0.09),
        rock: () => new THREE.DodecahedronGeometry(0.2),
        bubble: () => new THREE.SphereGeometry(0.11, 14, 10),
        shard: () => new THREE.TetrahedronGeometry(0.17),
        leaf: () => {
          const s = new THREE.Shape();
          s.moveTo(0, -0.3);
          s.quadraticCurveTo(0.14, 0, 0, 0.3);
          s.quadraticCurveTo(-0.14, 0, 0, -0.3);
          return new THREE.ShapeGeometry(s, 6);
        },
        ember: () => new THREE.IcosahedronGeometry(0.06),
        sand: () => new THREE.BoxGeometry(0.13, 0.13, 0.13),
        star: () => new THREE.OctahedronGeometry(0.12),
        block: () => new THREE.BoxGeometry(0.16, 0.55, 0.16),
        beam: () => new THREE.BoxGeometry(0.035, 0.035, 1.4),
      };
      const N = touch ? 300 : 900;
      const geo = shapes[era.shape]();
      const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.25, emissive: c0, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: era.shape === "bubble", opacity: era.shape === "bubble" ? 0.75 : 1 });
      const things = new THREE.InstancedMesh(geo, mat, N);
      const m4 = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const e3 = new THREE.Euler();
      const v = new THREE.Vector3();
      const sc = new THREE.Vector3();
      const col = new THREE.Color();
      for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 1.6 + Math.pow(Math.random(), 0.7) * 4.2;
        v.set(Math.cos(a) * r, Math.sin(a) * r, 8 - Math.random() * (LENGTH + 36));
        e3.set(Math.random() * 6.3, Math.random() * 6.3, era.shape === "beam" ? 0 : Math.random() * 6.3);
        q.setFromEuler(e3);
        const s = 0.6 + Math.random() * 1.6;
        sc.set(s, s, s);
        m4.compose(v, q, sc);
        things.setMatrixAt(i, m4);
        const pick = Math.random();
        col.copy(pick < 0.55 ? c0 : pick < 0.9 ? c1 : c2);
        things.setColorAt(i, col);
      }
      const tunnel = new THREE.Group();
      tunnel.add(things);
      scene.add(tunnel);

      // Speed streaks that stretch the faster you scroll
      const M = touch ? 380 : 1400;
      const sPos = new Float32Array(M * 6);
      const sEnd = new Float32Array(M * 2);
      for (let i = 0; i < M; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 0.8 + Math.random() * 6;
        const z = 8 - Math.random() * (LENGTH + 36);
        for (let j = 0; j < 2; j++) {
          sPos.set([Math.cos(a) * r, Math.sin(a) * r, z], i * 6 + j * 3);
          sEnd[i * 2 + j] = j;
        }
      }
      const sGeo = new THREE.BufferGeometry();
      sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
      sGeo.setAttribute("aEnd", new THREE.BufferAttribute(sEnd, 1));
      const sUni = { uStretch: { value: 0.3 }, uColor: { value: c2.clone() } };
      const sMat = new THREE.ShaderMaterial({ vertexShader: STREAK_VERT, fragmentShader: STREAK_FRAG, uniforms: sUni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const streaks = new THREE.LineSegments(sGeo, sMat);
      tunnel.add(streaks);

      // The way out: a glowing ring at the end of the tunnel
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.08, 12, 96), new THREE.MeshBasicMaterial({ color: c2 }));
      ring.position.z = -LENGTH - 6;
      const core = new THREE.Mesh(new THREE.CircleGeometry(2.3, 64), new THREE.MeshBasicMaterial({ color: c0, transparent: true, opacity: 0.55, fog: false }));
      core.position.z = -LENGTH - 6.2;
      scene.add(ring, core);

      // A little explorer, made from capsules and spheres
      const suit = new THREE.MeshStandardMaterial({ color: 0xdfe2ea, roughness: 0.6, metalness: 0.05 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x0c0f1a, roughness: 0.12, metalness: 0.9, emissive: c1, emissiveIntensity: 0.18 });
      const light = new THREE.MeshBasicMaterial({ color: c0 });
      const astro = new THREE.Group();
      const part = (g: T.BufferGeometry, m: T.Material, x: number, y: number, z: number, parent: T.Object3D = astro) => {
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
      };
      part(new THREE.CapsuleGeometry(0.3, 0.42, 6, 18), suit, 0, 0, 0);
      part(new THREE.SphereGeometry(0.33, 32, 24), suit, 0, 0.6, 0);
      part(new THREE.SphereGeometry(0.25, 32, 20), dark, 0, 0.62, 0.13).scale.set(1, 0.78, 0.62);
      part(new THREE.BoxGeometry(0.5, 0.58, 0.24), suit, 0, 0.08, -0.3);
      part(new THREE.BoxGeometry(0.18, 0.1, 0.04), light, 0, 0.1, 0.3);
      part(new THREE.BoxGeometry(0.06, 0.3, 0.03), light, 0.17, 0.1, -0.43);
      const limb = (x: number, y: number, len: number, rad: number) => {
        const pivot = new THREE.Group();
        pivot.position.set(x, y, 0);
        part(new THREE.CapsuleGeometry(rad, len, 4, 12), suit, 0, -len / 2 - rad * 0.5, 0, pivot);
        part(new THREE.SphereGeometry(rad * 1.25, 14, 10), suit, 0, -len - rad * 1.3, 0, pivot);
        astro.add(pivot);
        return pivot;
      };
      const armL = limb(-0.36, 0.26, 0.36, 0.1);
      const armR = limb(0.36, 0.26, 0.36, 0.1);
      const legL = limb(-0.15, -0.38, 0.4, 0.12);
      const legR = limb(0.15, -0.38, 0.4, 0.12);
      scene.add(astro);

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(1, h);
        camera.fov = camera.aspect < 0.8 ? 74 : 62;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      let prev = 0;
      let stretch = 0.3;
      renderFrame = (dt, t) => {
        const camZ = 6 - sp * LENGTH;
        camera.position.set(Math.sin(t * 0.3) * 0.15, Math.cos(t * 0.25) * 0.12, camZ);
        camera.lookAt(0, 0, camZ - 10);
        camera.rotation.z = Math.sin(sp * Math.PI * 2) * 0.12;

        const vel = Math.abs(sp - prev) / Math.max(dt, 1e-3);
        prev = sp;
        stretch += (Math.min(6, 0.3 + vel * 30) - stretch) * 0.15;
        sUni.uStretch.value = stretch;
        tunnel.rotation.z = t * 0.04 + sp * 2.2;

        // the explorer floats ahead of you, waves, and cartwheels on the way down
        const ahead = 4.6 + Math.sin(t * 0.7) * 0.2 + smooth(0.85, 1, sp) * 3;
        astro.position.set(Math.sin(t * 0.6) * 0.35, -0.25 + Math.sin(t * 0.9) * 0.12, camZ - ahead);
        astro.rotation.set(0.15 + Math.sin(t * 0.5) * 0.15, Math.sin(t * 0.4) * 0.45, sp * Math.PI * 2 + Math.sin(t * 0.6) * 0.18);
        const wave = Math.sin(t * 2.2);
        armL.rotation.z = -0.5 - wave * 0.35 - stretch * 0.08;
        armR.rotation.z = 0.5 + Math.max(0, wave) * 1.6 + stretch * 0.08;
        legL.rotation.x = Math.sin(t * 1.4) * 0.3;
        legR.rotation.x = -Math.sin(t * 1.4) * 0.3;
        glow.position.set(astro.position.x, astro.position.y + 1, astro.position.z + 1.6);

        ring.rotation.z = t * 0.3;
        (core.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity = 0.35 + smooth(0.6, 1, sp) * 0.6;
        renderer.render(scene, camera);
      };

      cleanup = () => {
        ro.disconnect();
        scene.traverse((o) => {
          const mesh = o as InstanceType<typeof THREE.Mesh>;
          mesh.geometry?.dispose?.();
        });
        [mat, sMat, suit, dark, light, ring.material as T.Material, core.material as T.Material].forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    // ----- loop: only while the flight is on screen -----
    let raf = 0;
    let visible = false;
    let last = performance.now();
    let time = 0;
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      read();
      sp += (target - sp) * (touch ? 0.25 : 0.12);
      paintHtml();
      renderFrame(dt, time);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(sec);
    sec.setAttribute("data-live", "");

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      cleanup();
    };
  }, [era, slug]);

  const big = ["Fly", "into", ...era.name.split(" ")];
  return (
    <section ref={section} className="warp" style={{ "--warp-sky": era.sky } as React.CSSProperties}>
      <a href="#chapter-start" className="warp-skip">
        Skip the flight
      </a>
      <div className="warp-stage" aria-hidden="true">
        <div ref={host} className="warp-gl" />
        <div className="warp-words">
          <p ref={when} className="warp-when">{era.when}</p>
          <div ref={words} className="warp-big">
            {big.map((w, i) => (
              <span key={i} data-w className="warp-w">
                {w}
              </span>
            ))}
          </div>
        </div>
        <p ref={ask} className="warp-ask">
          {question}
        </p>
        <div ref={hint} className="warp-hint">
          <span>Scroll to fly in</span>
          <span className="warp-hint-arrow">↓</span>
        </div>
        <p className="warp-label">Artist&rsquo;s impression: a playful flight, not a real view of this time</p>
        <div ref={flash} className="warp-flash" />
      </div>
    </section>
  );
}
