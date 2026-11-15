"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { CHAPTER, moments } from "./moments";
import { detectQuality, hasWebGL, type Quality } from "./quality";
import { loadPref, savePref } from "./progress";
import type { SoundEngine, Sfx } from "./sound-engine";
import { DetailsPanel } from "./DetailsPanel";

const Stage = dynamic(() => import("./Stage"), { ssr: false });

/**
 * Chapter 1 as one immersive journey. No levels, scores or menus to manage:
 * press Begin and drift through the first billion years of the universe.
 * Seven moments unfold around you; a short line tells you what you are
 * seeing, and "Learn more" opens the details and the sources.
 */
export function Game() {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [quality, setQuality] = useState<Quality>("low");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [still, setStill] = useState(false);
  const [muted, setMuted] = useState(false);
  const [moment, setMoment] = useState(-1);
  const [ended, setEnded] = useState(false);
  const [drifting, setDrifting] = useState(true);
  const [jump, setJump] = useState({ index: 0, n: 0 });
  const [details, setDetails] = useState(false);
  const [touch, setTouch] = useState(false);

  const sound = useRef<SoundEngine | null>(null);
  const motion = useRef(0);
  const fill = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const shown = moments[Math.max(0, moment)];

  // Read device and saved settings once we are in the browser.
  useEffect(() => {
    setWebgl(hasWebGL());
    const q = loadPref("graphics");
    setQuality(q === "high" || q === "low" ? q : detectQuality());
    setMuted(loadPref("muted") === "1");
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches || document.documentElement.hasAttribute("data-motion"));
    sync();
    mq.addEventListener("change", sync);
    document.documentElement.classList.add("game-open");
    return () => {
      mq.removeEventListener("change", sync);
      document.documentElement.classList.remove("game-open");
      sound.current?.dispose();
      sound.current = null;
    };
  }, []);

  /* ---------------- sound ---------------- */
  const ensureSound = useCallback(async () => {
    if (sound.current) return sound.current;
    try {
      const { SoundEngine } = await import("./sound-engine");
      sound.current = new SoundEngine();
      sound.current.setMuted(loadPref("muted") === "1");
      await sound.current.resume();
    } catch {
      sound.current = null;
    }
    return sound.current;
  }, []);
  const sfx = useCallback((name: Sfx) => sound.current?.sfx(name), []);
  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    savePref("muted", m ? "1" : "0");
    void ensureSound().then((s) => s?.setMuted(m));
  };

  // The rush of air follows how fast you travel.
  useEffect(() => {
    if (!started) return;
    const t = window.setInterval(() => sound.current?.setRush(motion.current), 100);
    return () => {
      window.clearInterval(t);
      sound.current?.setRush(0);
    };
  }, [started]);

  /* ---------------- journey ---------------- */
  const begin = () => {
    void ensureSound().then((s) => s?.play("garden"));
    sfx("whoosh");
    setStarted(true);
  };
  const goTo = (i: number) => setJump((j) => ({ index: i, n: j.n + 1 }));
  const again = () => {
    setEnded(false);
    goTo(-1);
  };
  const onMoment = useCallback((i: number) => setMoment(i), []);
  const onEnd = useCallback((e: boolean) => setEnded(e), []);
  const onProgress = useCallback((t: number) => {
    if (fill.current) fill.current.style.transform = `scaleY(${t})`;
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onSlow = useCallback(() => setQuality("low"), []);
  const setGraphics = (q: Quality) => {
    setQuality(q);
    savePref("graphics", q);
  };

  // Show the Begin button even if the 3D world is slow to start.
  useEffect(() => {
    if (webgl === false) setReady(true);
    const t = window.setTimeout(() => setReady(true), 3000);
    return () => window.clearTimeout(t);
  }, [webgl]);

  /* ---------------- motion for the words ---------------- */
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || still) return;
    const ctx = gsap.context(() => {
      if (!started) {
        gsap.from(".title-word", { y: 50, opacity: 0, duration: 1.1, stagger: 0.14, ease: "power3.out" });
        gsap.from(".title-actions > *", { y: 16, opacity: 0, duration: 0.7, delay: 0.6, stagger: 0.08 });
      }
      if (started && moment >= 0 && !ended) {
        gsap.from(".cap-line", { y: 24, opacity: 0, duration: 1.2, stagger: 0.35, ease: "power3.out", delay: 0.3 });
      }
      if (ended) gsap.from(".end-line", { y: 24, opacity: 0, duration: 1.1, stagger: 0.3, ease: "power3.out" });
    }, el);
    return () => ctx.revert();
  }, [started, moment, ended, still]);

  return (
    <div
      ref={root}
      className="game journey"
      style={{ "--lvl": shown.color } as React.CSSProperties}
      data-screen={started ? (ended ? "end" : "journey") : "title"}
      data-ready={ready ? "" : undefined}
      data-quality={quality}
    >
      {webgl ? (
        <Stage
          quality={quality}
          onSlow={onSlow}
          onReady={onReady}
          still={still}
          playing={started}
          drifting={drifting && !details}
          jump={jump}
          count={moments.length}
          sfx={sfx}
          onMoment={onMoment}
          onProgress={onProgress}
          onEnd={onEnd}
          motion={motion}
        />
      ) : null}

      <h1 className={started ? "sr-only" : "title"}>
        <span className="title-word">THE</span> <span className="title-word">JOURNEY</span>
        <span className="sr-only">, Chapter 1: Before Everything</span>
      </h1>

      {/* ---------------- title ---------------- */}
      {!started ? (
        <div className="screen title-screen">
          <p className="title-chapter title-word">
            Chapter 1 · <strong>{CHAPTER.title}</strong>
          </p>
          <p className="title-tag title-word">{CHAPTER.tagline}</p>
          <div className="title-load" aria-hidden={ready ? true : undefined}>
            <div className="load-bar" role="progressbar" aria-label="Building the universe" aria-valuetext={ready ? "Ready" : "Loading"}>
              <span />
            </div>
            <p className="load-text">Building the universe…</p>
          </div>
          <div className="title-actions">
            <button type="button" className="btn btn-big" onClick={begin}>
              <PlayIcon /> Begin the journey
            </button>
          </div>
          <Settings quality={quality} setGraphics={setGraphics} muted={muted} toggleMute={toggleMute} webgl={webgl} />
        </div>
      ) : null}

      {/* ---------------- the journey ---------------- */}
      {started && webgl ? (
        <div className="hud journey-hud">
          <div className="hud-top">
            <p className="j-brand">
              THE JOURNEY <span>· Chapter 1</span>
            </p>
            <div className="hud-buttons">
              {moment >= 0 ? (
                <button type="button" className="icon-btn" onClick={() => setDetails(true)} aria-label={`Learn more about ${shown.name}`}>
                  <BookIcon />
                  <span className="icon-label">Learn more</span>
                </button>
              ) : null}
              <button type="button" className="icon-btn" onClick={() => setDrifting((d) => !d)} aria-label={drifting ? "Pause the drift" : "Keep drifting"} aria-pressed={!drifting}>
                {drifting ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button type="button" className="icon-btn" onClick={toggleMute} aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted}>
                {muted ? <MuteIcon /> : <SoundIcon />}
              </button>
            </div>
          </div>

          {/* a thin line of time down the side: where you are in the story */}
          <nav className="jt" aria-label="Moments in time">
            <div className="jt-track" aria-hidden="true">
              <div ref={fill} className="jt-fill" />
            </div>
            <ol>
              {moments.map((m, i) => (
                <li key={m.id} style={{ "--c": m.color, "--at": `${((i + 0.75) / (moments.length + 0.6)) * 100}%` } as React.CSSProperties}>
                  <button type="button" className={i === moment ? "tl-dot on" : i < moment ? "tl-dot past" : "tl-dot"} onClick={() => goTo(i)} aria-current={i === moment ? "step" : undefined}>
                    <span className="tl-label">{m.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {moment < 0 ? (
            <p className="j-hint" key="hint">
              {touch ? (
                <>
                  Just watch, or <strong>swipe up</strong> to travel faster through time.
                </>
              ) : (
                <>
                  Just watch, or <strong>scroll</strong> to travel faster through time. <strong>Move the mouse</strong> to look around.
                </>
              )}
            </p>
          ) : null}

          {moment >= 0 && !ended ? (
            <div className="caption" key={moment} aria-live="polite">
              <p className="cap-line cap-when">{shown.when}</p>
              <h2 className="cap-line cap-name">{shown.name}</h2>
              <p className="cap-line cap-feel">{shown.feel}</p>
              <p className="cap-line cap-fact">{shown.fact}</p>
            </div>
          ) : null}

          {ended ? (
            <div className="caption end" aria-live="polite">
              <p className="end-line cap-when">Chapter 1 · The end</p>
              <h2 className="end-line cap-name">You are made of star stuff.</h2>
              <p className="end-line cap-fact">
                From a tiny hot speck to shining galaxies. The atoms in your body were cooked inside stars, long before the Sun was born.
              </p>
              <p className="end-line coming">
                <span>Coming soon</span> {CHAPTER.next}
              </p>
              <div className="end-line card-actions">
                <button type="button" className="btn btn-big btn-sm" onClick={again}>
                  Travel again
                </button>
                <Link href="/sources" className="btn btn-ghost btn-sm">
                  See the science
                </Link>
              </div>
            </div>
          ) : null}

          <div className="j-steps">
            <button type="button" className="icon-btn" onClick={() => goTo(Math.max(-1, moment - 1))} disabled={moment < 0} aria-label="Back in time">
              <ArrowIcon back />
            </button>
            <button type="button" className="icon-btn" onClick={() => goTo(Math.min(moments.length - 1, moment + 1))} disabled={moment >= moments.length - 1} aria-label="Forward in time">
              <ArrowIcon />
            </button>
          </div>
        </div>
      ) : null}

      {/* ---------------- without WebGL: the same story as a simple scroll ---------------- */}
      {started && webgl === false ? (
        <div className="flat-journey">
          {moments.map((m) => (
            <section key={m.id} className="flat-moment" style={{ "--c": m.color } as React.CSSProperties}>
              <p className="cap-when">{m.when}</p>
              <h2 className="cap-name">{m.name}</h2>
              <p className="cap-feel">{m.feel}</p>
              <p className="cap-fact">{m.fact}</p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setMoment(m.number - 1);
                  setDetails(true);
                }}
              >
                <BookIcon /> Learn more
              </button>
            </section>
          ))}
          <section className="flat-moment">
            <h2 className="cap-name">You are made of star stuff.</h2>
            <Link href="/sources" className="btn btn-ghost btn-sm">
              See the science
            </Link>
          </section>
        </div>
      ) : null}

      <DetailsPanel moment={shown} open={details} onClose={() => setDetails(false)} />
    </div>
  );
}

function Settings({
  quality,
  setGraphics,
  muted,
  toggleMute,
  webgl,
}: {
  quality: Quality;
  setGraphics: (q: Quality) => void;
  muted: boolean;
  toggleMute: () => void;
  webgl: boolean | null;
}) {
  return (
    <div className="settings">
      {webgl ? (
        <div className="seg" role="group" aria-label="Graphics">
          <span className="seg-label">Graphics</span>
          <button type="button" aria-pressed={quality === "high"} onClick={() => setGraphics("high")}>
            Full
          </button>
          <button type="button" aria-pressed={quality === "low"} onClick={() => setGraphics("low")}>
            Lite
          </button>
        </div>
      ) : webgl === false ? (
        <p className="seg-label">Simple mode: this device can&rsquo;t show 3D, so you will see pictures and words instead.</p>
      ) : null}
      <button type="button" className="btn btn-ghost btn-sm" onClick={toggleMute} aria-pressed={!muted}>
        {muted ? <MuteIcon /> : <SoundIcon />} Sound {muted ? "off" : "on"}
      </button>
      <nav aria-label="More" className="settings-links">
        <Link href="/sources">Sources</Link>
        <Link href="/about">About</Link>
      </nav>
    </div>
  );
}

/* ---------------- icons (inline, no icon font) ---------------- */
const svg = { "aria-hidden": true, width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
function PlayIcon() {
  return (
    <svg {...svg} fill="currentColor" stroke="none">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}
function ArrowIcon({ back }: { back?: boolean }) {
  return (
    <svg {...svg} style={back ? { transform: "rotate(180deg)" } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg {...svg} fill="currentColor" stroke="none">
      <path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg {...svg}>
      <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5zM4 20.5A2.5 2.5 0 006.5 23H20v-5" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg {...svg}>
      <path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg {...svg}>
      <path d="M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6" />
    </svg>
  );
}

