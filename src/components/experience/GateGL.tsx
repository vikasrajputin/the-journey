"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type GateGLHandle = { burst: () => void };

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uBurst;
  uniform vec2 uPointer;
  uniform float uPointerOn;
  uniform float uPixel;
  attribute float aSeed;
  attribute float aSize;
  varying float vAlpha;
  varying float vWarm;
  varying float vPink;

  void main() {
    vec3 p = position;
    float r = length(p.xy);
    // differential rotation: inner stars orbit faster
    float a = uTime * (0.05 + 0.18 / (0.6 + r));
    float c = cos(a), s = sin(a);
    p.xy = mat2(c, -s, s, c) * p.xy;
    p.z += sin(uTime * 0.6 + aSeed * 6.2831) * 0.04;

    // the pointer pushes stars aside
    vec2 d = p.xy - uPointer;
    float dist = length(d);
    float push = uPointerOn * smoothstep(0.9, 0.0, dist) * 0.45;
    p.xy += normalize(d + 1e-4) * push;
    p.z += push * 0.6;

    // entering: everything rushes outward and toward the viewer
    float b = uBurst * uBurst;
    p.xy *= 1.0 + b * (3.0 + aSeed * 5.0);
    p.z += b * (2.0 + aSeed * 3.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixel * (2.2 / -mv.z) * (1.0 + push * 2.0);
    vAlpha = (0.35 + 0.65 * fract(aSeed * 13.7)) * (1.0 - uBurst);
    vWarm = smoothstep(1.2, 0.0, r);
    vPink = step(0.96, fract(aSeed * 71.3)) * smoothstep(0.3, 0.9, r);
  }
`;

const FRAG = /* glsl */ `
  varying float vAlpha;
  varying float vWarm;
  varying float vPink;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    // blue-white arms, a golden core, and scattered pink star-forming knots
    vec3 cool = vec3(0.45, 0.66, 1.0);
    vec3 warm = vec3(1.0, 0.78, 0.42);
    vec3 col = mix(cool, warm, vWarm);
    col = mix(col, vec3(1.0, 0.42, 0.72), vPink);
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;

/**
 * The opening sky: a spiral galaxy of tens of thousands of points, drawn with
 * WebGL. Move a finger or the mouse through it and the stars part; press
 * Enter and they rush past you. An artistic impression, not a real galaxy.
 */
export const GateGL = forwardRef<GateGLHandle, { still: boolean }>(function GateGL({ still }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const burstRef = useRef<{ start: number } | null>(null);
  const stillRef = useRef(still);
  stillRef.current = still;

  useImperativeHandle(ref, () => ({ burst: () => (burstRef.current = { start: performance.now() }) }), []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (disposed) return;
      const touch = window.matchMedia("(pointer: coarse)").matches;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the CSS background stays
      }
      const dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
      camera.position.set(0, -1.6, 2.6);
      camera.lookAt(0, 0, 0);

      const N = touch ? 22000 : 60000;
      const pos = new Float32Array(N * 3);
      const seed = new Float32Array(N);
      const size = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const arm = i % 3;
        const t = Math.pow(Math.random(), 0.65);
        const r = 0.05 + t * 1.9;
        const ang = arm * ((Math.PI * 2) / 3) + r * 2.6 + (Math.random() - 0.5) * (0.5 + (1 - t) * 0.9);
        const spread = (Math.random() - 0.5) * 0.12 * (1.2 - t);
        pos[i * 3] = Math.cos(ang) * r + spread;
        pos[i * 3 + 1] = Math.sin(ang) * r + spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.12 * (1.4 - t);
        seed[i] = Math.random();
        size[i] = Math.random() < 0.02 ? 5 : 1 + Math.random() * 2;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
      const uniforms = {
        uTime: { value: 0 },
        uBurst: { value: 0 },
        uPointer: { value: new THREE.Vector2(9, 9) },
        uPointerOn: { value: 0 },
        uPixel: { value: dpr * (touch ? 1.5 : 1) },
      };
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const points = new THREE.Points(geo, mat);
      points.rotation.x = -0.35;
      scene.add(points);

      const size2 = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(1, h);
        // keep the galaxy filling a portrait phone screen too
        camera.position.z = 2.6 * Math.max(1, 0.9 / camera.aspect);
        // on a tall phone screen, lift the galaxy to the middle
        camera.lookAt(0, camera.aspect < 1 ? -0.9 : 0, 0);
        camera.updateProjectionMatrix();
      };
      size2();
      const ro = new ResizeObserver(size2);
      ro.observe(el);

      // map the pointer onto the galaxy's plane
      const ray = new THREE.Raycaster();
      const plane = new THREE.Plane();
      const hit = new THREE.Vector3();
      const ndc = new THREE.Vector2();
      const target = new THREE.Vector2(9, 9);
      let pointerOn = 0;
      const onMove = (e: PointerEvent) => {
        const b = el.getBoundingClientRect();
        ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        points.updateMatrixWorld();
        plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1).applyQuaternion(points.quaternion), points.position);
        if (ray.ray.intersectPlane(plane, hit)) {
          points.worldToLocal(hit); // same frame as the shader's rotated star positions
          target.set(hit.x, hit.y);
          pointerOn = 1;
        }
      };
      const onLeave = () => (pointerOn = 0);
      // The gate's text sits on top, so listen on the window.
      const onUp = (e: PointerEvent) => e.pointerType !== "mouse" && onLeave();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
      document.documentElement.addEventListener("pointerleave", onLeave);

      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
      });
      io.observe(el);
      const t0 = performance.now();
      let time = 0;
      let last = t0;
      function loop(now: number) {
        raf = 0;
        if (!visible || document.hidden) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        time += stillRef.current ? 0 : dt;
        uniforms.uTime.value = time;
        const p = uniforms.uPointer.value;
        p.lerp(target, 0.12);
        uniforms.uPointerOn.value += (pointerOn - uniforms.uPointerOn.value) * 0.08;
        if (burstRef.current) uniforms.uBurst.value = Math.min(1, (now - burstRef.current.start) / 1100);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onMove);
        window.removeEventListener("pointerup", onUp);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className="gate-gl" aria-hidden="true" />;
});
