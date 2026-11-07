"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ResolvedMedia } from "@/lib/media";
import { ExperienceContext, type ExperienceApi } from "./ExperienceContext";
import { SceneShell } from "./SceneShell";
import { scenes } from "./scene-data";
import { SoundEngine, type Sfx } from "./sound-engine";
import { AmbientPlayer } from "./ambient";
import { GateGL, type GateGLHandle } from "./GateGL";
import { LiveNow } from "./LiveNow";
import { ScaleZoom } from "./ScaleZoom";
import { askMotionPermission, buzz, startTilt, stopTilt } from "./tilt";
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

/** One bright colour per letter of the title, taken from the chapter colours. */
const TITLE_COLOURS = ["#ff5f6d", "#ffb347", "#ffe14d", "#7dff7a", "#3ee0ff", "#4f8bff", "#b36bff", "#ff6bd6", "#ff9a3c", "#5cf2a0"];

/** Vibration on Android phones for the big physical moments. */
const HAPTICS: Partial<Record<Sfx, number | number[]>> = {
  step: 35,
  impact: [90, 40, 220],
  bang: [60, 30, 140],
  roar: [25, 25, 25, 25, 60],
};

export function Experience({ media }: { media: Record<string, ResolvedMedia> }) {
  const engine = useRef<SoundEngine | null>(null);
  const ambient = useRef<AmbientPlayer | null>(null);
  const [hearing, setHearing] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const gl = useRef<GateGLHandle>(null);
  const [sound, setSound] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [current, setCurrent] = useState<{ id: string; beat: number }>({ id: scenes[0].id, beat: 0 });
  const currentRef = useRef(current);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches || document.documentElement.hasAttribute("data-motion"));
    update();
    mq.addEventListener("change", update);
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      mq.removeEventListener("change", update);
      mo.disconnect();
    };
  }, []);

  useEffect(
    () => () => {
      engine.current?.dispose();
      ambient.current?.dispose();
      stopTilt();
    },
    [],
  );

  /** Real recording for a scene, over the synth bed; the bed comes back if it fails. */
  const playReal = useCallback(
    (sceneId: string) => {
      const a = ambient.current;
      if (!a) return;
      const scene = scenes.find((s) => s.id === sceneId);
      const m = scene?.sound ? media[scene.sound.media] : undefined;
      a.play(m);
    },
    [media],
  );

  const enter = (withSound: boolean) => {
    setSound(withSound);
    void askMotionPermission().then((r) => r === "granted" && startTilt());
    if (!engine.current) {
      try {
        engine.current = new SoundEngine();
      } catch {
        engine.current = null;
      }
    }
    const e = engine.current;
    if (e) {
      void e.resume();
      e.setMuted(!withSound);
      const scene = scenes.find((s) => s.id === currentRef.current.id) ?? scenes[0];
      e.play(scene.soundscape);
    }
    if (!ambient.current) {
      ambient.current = new AmbientPlayer((playing) => {
        engine.current?.setBedLevel(playing ? 0.35 : 1);
        setHearing(playing ? (scenes.find((s) => s.id === currentRef.current.id)?.sound?.media ?? null) : null);
      });
    }
    ambient.current.setMuted(!withSound);
    playReal(currentRef.current.id);
    const open = () => {
      setEntered(true);
      const target = scenes.find((s) => `#${s.id}` === window.location.hash);
      if (target) document.getElementById(target.id)?.scrollIntoView();
      else window.scrollTo({ top: 0 });
      const scene = target ?? scenes[0];
      document.getElementById(scene.id + "-title")?.focus({ preventScroll: true });
    };
    if (reduced || entered) return open();
    // The stars rush past, then the gate lifts.
    gl.current?.burst();
    setLeaving(true);
    window.setTimeout(open, 750);
  };

  const onReport = useCallback((id: string, beat: number) => {
    const c = currentRef.current;
    if (c.id === id && c.beat === beat) return;
    const next = { id, beat };
    currentRef.current = next;
    setCurrent(next);
    const scene = scenes.find((s) => s.id === id);
    if (!scene) return;
    if (c.id !== id) {
      engine.current?.play(scene.soundscape);
      playReal(id);
    }
  }, [playReal]);

  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    if (!engine.current && on) {
      enter(true);
      return;
    }
    engine.current?.setMuted(!on);
    ambient.current?.setMuted(!on);
    if (on) void engine.current?.resume();
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

  const sfx = useCallback((s: Sfx) => {
    engine.current?.sfx(s);
    const pattern = HAPTICS[s];
    if (pattern) buzz(pattern);
  }, []);

  const api: ExperienceApi = useMemo(() => ({ engine, sound, hearing, reduced, media, sfx, shake }), [sound, hearing, reduced, media, sfx, shake]);
  const currentScene = scenes.find((s) => s.id === current.id) ?? scenes[0];

  return (
    <ExperienceContext.Provider value={api}>
      <div className="experience" data-entered={entered || undefined}>
        <h1 className="sr-only">THE JOURNEY: 13.8 billion years, from the first light to you</h1>
        {!entered ? (
          <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title" data-leaving={leaving || undefined}>
            <GateGL ref={gl} still={reduced} />
            <div className="gate-inner">
              <p className="gate-eyebrow">A trip through 13.8 billion years</p>
              <p id="gate-title" className="gate-title">
                <span className="sr-only">THE JOURNEY</span>
                <span className="gate-letters" aria-hidden="true">
                  {["THE", "JOURNEY"].map((word, w) => (
                    <span key={word} className="gate-word">
                      {word.split("").map((ch, i) => (
                        <span key={i} className="gate-letter" style={{ "--i": w * 3 + i, color: TITLE_COLOURS[(w * 3 + i) % TITLE_COLOURS.length] } as React.CSSProperties}>
                          {ch}
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </p>
              <p className="gate-sub">From the very first light in the universe, all the way to you. Ten worlds to explore, touch and hear!</p>
              <div className="gate-buttons">
                <button type="button" className="gate-primary" onClick={() => enter(true)} autoFocus>
                  <span className="pulse-dot" aria-hidden="true" /> Enter with sound
                </button>
                <button type="button" className="gate-secondary" onClick={() => enter(false)}>
                  Enter in silence
                </button>
              </div>
              <p className="gate-hint">Put on headphones! Scroll or swipe to travel through time. Tap things to play with them.</p>
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
            const shell = (
              <SceneShell key={def.id} def={def} onReport={onReport}>
                {(s) => <Scene s={s} />}
              </SceneShell>
            );
            // After "Our World": live data and the scale of everything, then "You".
            if (def.id !== "world") return shell;
            return (
              <Fragment key={def.id}>
                {shell}
                <LiveNow />
                <ScaleZoom />
              </Fragment>
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
              Photographs and video are real, from NASA, ESA, ISRO, NOAA and photographers on Wikimedia Commons, and load directly from Wikimedia. Animations are artistic impressions. Some sounds are real: recordings of rain, waves, birds and fire, a NOAA underwater recording, and NASA data from Voyager 1 and the Chandra telescope turned into sound. The rest is synthesised live in your browser. The dinosaur calls are reconstructions: nobody knows exactly what dinosaurs sounded like.
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
