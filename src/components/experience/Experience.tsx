"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ResolvedMedia } from "@/lib/media";
import { ExperienceContext, type ExperienceApi } from "./ExperienceContext";
import { SceneShell } from "./SceneShell";
import { scenes } from "./scene-data";
import { Narrator, SoundEngine, type Sfx } from "./sound-engine";
import { Starfield } from "./scenes/Starfield";
import { useCanvasLoop } from "./useCanvasLoop";
import { MotionToggle } from "@/components/layout/MotionToggle";
import { ContinueJourney } from "@/components/journey/ContinueJourney";
import { BeginningScene } from "./scenes/Beginning";
import { PlanetScene } from "./scenes/Planet";
import { LifeScene } from "./scenes/Life";
import { ExplosionScene } from "./scenes/Explosion";
import { GiantsScene } from "./scenes/Giants";
import { HumansScene } from "./scenes/Humans";
import { CivilisationScene } from "./scenes/Civilisation";
import { IdeasScene } from "./scenes/Ideas";
import { WorldScene } from "./scenes/World";
import { YouScene } from "./scenes/You";

const SCENE_COMPONENTS = {
  beginning: BeginningScene,
  planet: PlanetScene,
  life: LifeScene,
  explosion: ExplosionScene,
  giants: GiantsScene,
  humans: HumansScene,
  civilisation: CivilisationScene,
  ideas: IdeasScene,
  world: WorldScene,
  you: YouScene,
} as const;

function readPref(key: string, fallback: boolean) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "1";
  } catch {
    return fallback;
  }
}
function writePref(key: string, v: boolean) {
  try {
    localStorage.setItem(key, v ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
}

function GateSky() {
  const stars = useRef(new Starfield(320));
  const ref = useCanvasLoop((ctx, w, h, t) => {
    ctx.fillStyle = "#020208";
    ctx.fillRect(0, 0, w, h);
    stars.current.draw(ctx, w, h, t, 1, 4);
    const g = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.min(w, h) * 0.5);
    g.addColorStop(0, `rgba(255,235,200,${0.1 + Math.sin(t) * 0.03})`);
    g.addColorStop(1, "rgba(255,200,150,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  return <canvas ref={ref} className="gate-sky" aria-hidden="true" />;
}

export function Experience({ media }: { media: Record<string, ResolvedMedia> }) {
  const engine = useRef<SoundEngine | null>(null);
  const narrator = useRef<Narrator | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [sound, setSound] = useState(true);
  const [voice, setVoice] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [current, setCurrent] = useState<{ id: string; beat: number }>({ id: scenes[0].id, beat: 0 });
  const currentRef = useRef(current);
  const sayTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches || document.documentElement.hasAttribute("data-motion"));
    update();
    mq.addEventListener("change", update);
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    setVoice(readPref("journey:voice", true));
    return () => {
      mq.removeEventListener("change", update);
      mo.disconnect();
    };
  }, []);

  useEffect(() => () => {
    engine.current?.dispose();
    narrator.current?.stop();
  }, []);

  const enter = (withSound: boolean) => {
    setSound(withSound);
    if (!engine.current) {
      try {
        engine.current = new SoundEngine();
      } catch {
        engine.current = null;
      }
    }
    if (!narrator.current && Narrator.supported()) {
      narrator.current = new Narrator();
      narrator.current.onSpeaking = (on) => engine.current?.duck(on);
    }
    const e = engine.current;
    if (e) {
      void e.resume();
      e.setMuted(!withSound);
      const scene = scenes.find((s) => s.id === currentRef.current.id) ?? scenes[0];
      e.play(scene.soundscape);
    }
    if (narrator.current) narrator.current.enabled = withSound && voice;
    setEntered(true);
    const target = scenes.find((s) => `#${s.id}` === window.location.hash);
    if (target) document.getElementById(target.id)?.scrollIntoView();
    else window.scrollTo({ top: 0 });
    const scene = target ?? scenes[0];
    if (withSound && voice) setTimeout(() => narrator.current?.say(scene.beats[0].text), 900);
    document.getElementById(scene.id + "-title")?.focus({ preventScroll: true });
  };

  const onReport = useCallback((id: string, beat: number) => {
    const c = currentRef.current;
    if (c.id === id && c.beat === beat) return;
    const next = { id, beat };
    currentRef.current = next;
    setCurrent(next);
    const scene = scenes.find((s) => s.id === id);
    if (!scene) return;
    if (c.id !== id) engine.current?.play(scene.soundscape);
    clearTimeout(sayTimer.current);
    narrator.current?.stop();
    sayTimer.current = setTimeout(() => {
      if (currentRef.current === next) narrator.current?.say(scene.beats[beat].text);
    }, 650);
  }, []);

  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    if (!engine.current && on) {
      enter(true);
      return;
    }
    engine.current?.setMuted(!on);
    if (on) void engine.current?.resume();
    if (narrator.current) {
      narrator.current.enabled = on && voice;
      if (!on) narrator.current.stop();
    }
  };

  const toggleVoice = () => {
    const on = !voice;
    setVoice(on);
    writePref("journey:voice", on);
    if (narrator.current) {
      narrator.current.enabled = on && sound;
      if (on && sound) {
        const scene = scenes.find((s) => s.id === currentRef.current.id);
        if (scene) narrator.current.say(scene.beats[currentRef.current.beat].text);
      } else narrator.current.stop();
    }
  };

  const shake = useCallback(
    (strength = 8, ms = 500) => {
      const el = root.current;
      if (!el || reduced) return;
      const start = performance.now();
      const step = (now: number) => {
        const k = 1 - (now - start) / ms;
        if (k <= 0) {
          el.style.transform = "";
          return;
        }
        const s = strength * k * k;
        el.style.transform = `translate3d(${(Math.random() - 0.5) * s}px, ${(Math.random() - 0.5) * s}px, 0)`;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    [reduced],
  );

  const sfx = useCallback((s: Sfx) => engine.current?.sfx(s), []);

  const api: ExperienceApi = useMemo(() => ({ engine, narrator, sound, reduced, media, sfx, shake }), [sound, reduced, media, sfx, shake]);
  const currentScene = scenes.find((s) => s.id === current.id) ?? scenes[0];

  return (
    <ExperienceContext.Provider value={api}>
      <div className="experience" data-entered={entered || undefined}>
        <h1 className="sr-only">THE JOURNEY: 13.8 billion years, from the first light to you</h1>
        {!entered ? (
          <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
            <GateSky />
            <div className="gate-inner">
              <p className="gate-eyebrow">An immersive journey through 13.8 billion years</p>
              <p id="gate-title" className="gate-title">
                THE JOURNEY
              </p>
              <p className="gate-sub">From the first light of the universe to you. Ten worlds to step into, see, touch and hear.</p>
              <div className="gate-buttons">
                <button type="button" className="gate-primary" onClick={() => enter(true)} autoFocus>
                  <span className="pulse-dot" aria-hidden="true" /> Enter with sound
                </button>
                <button type="button" className="gate-secondary" onClick={() => enter(false)}>
                  Enter in silence
                </button>
              </div>
              <p className="gate-hint">Best with headphones. Scroll or swipe to travel through time. Tap and drag to interact.</p>
              <div className="mt-3">
                <ContinueJourney />
              </div>
            </div>
          </div>
        ) : null}

        <div className="hud" aria-label="Journey controls" role="region">
          <Link href="/" className="hud-brand" aria-label="THE JOURNEY, home">
            THE JOURNEY
          </Link>
          <p className="hud-when" aria-hidden="true">
            <span>{currentScene.beats[current.beat]?.when}</span>
          </p>
          <div className="hud-buttons">
            <button type="button" className="hud-btn" aria-pressed={sound} onClick={toggleSound} title={sound ? "Sound on" : "Sound off"}>
              {sound ? <IconSound /> : <IconMute />}
              <span className="sr-only">Sound</span>
            </button>
            <button type="button" className="hud-btn" aria-pressed={voice} onClick={toggleVoice} title={voice ? "Narration on" : "Narration off"} disabled={!sound}>
              <IconVoice off={!voice} />
              <span className="sr-only">Narration</span>
            </button>
            <MotionToggle className="hud-btn hud-motion" />
            <Link href="/journey/" className="hud-btn hud-text">
              Library
            </Link>
          </div>
        </div>

        <nav className="hud-rail" aria-label="Chapters">
          <ol>
            {scenes.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={s.id === current.id ? "step" : undefined} data-theme={s.theme}>
                  <span className="rail-dot" aria-hidden="true" />
                  <span className="rail-label">
                    {s.number}. {s.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div ref={root} className="experience-world">
          {scenes.map((def) => {
            const Scene = SCENE_COMPONENTS[def.id as keyof typeof SCENE_COMPONENTS];
            return (
              <SceneShell key={def.id} def={def} onReport={onReport}>
                {(s) => <Scene s={s} />}
              </SceneShell>
            );
          })}
        </div>

        <section className="outro" aria-labelledby="outro-title">
          <div className="container-wide">
            <h2 id="outro-title" className="font-display text-[length:var(--text-h2)]">
              Go deeper
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              Every caption in this journey comes from the chapters, where each claim is linked to its source. Step into the library to read the full story, explore the timeline, or see how scientists know what they know.
            </p>
            <ul className="outro-links">
              <li><Link href="/journey/">The ten chapters</Link></li>
              <li><Link href="/timeline/">Timeline of everything</Link></li>
              <li><Link href="/evidence/">How do we know?</Link></li>
              <li><Link href="/sources/">Sources</Link></li>
            </ul>
            <h3 className="mt-14 font-display text-[length:var(--text-h3)]">Photographs, video and sound</h3>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Photographs and video are real, from NASA, ESA, ISRO, NOAA and photographers on Wikimedia Commons, and load directly from Wikimedia. Animations are artistic impressions. Every sound is synthesised live in your browser. The dinosaur calls are reconstructions: nobody knows exactly what dinosaurs sounded like. The narration uses your device&rsquo;s own voice.
            </p>
            <ul className="outro-credits">
              {Object.values(media).map((m) => (
                <li key={m.id}>
                  <a href={m.page} target="_blank" rel="noopener noreferrer">
                    {m.alt}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <span className="text-muted"> · {m.credit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </ExperienceContext.Provider>
  );
}

function IconSound() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}
function IconMute() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </svg>
  );
}
function IconVoice({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M7 10h4M7 14h7M14 10h3" />
      {off ? <path d="M3 21L21 3" /> : null}
    </svg>
  );
}
