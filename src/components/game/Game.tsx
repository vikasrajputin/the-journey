"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { CHAPTER, levels, type Level } from "./levels";
import { detectQuality, hasWebGL, type Quality } from "./quality";
import { loadPref, loadProgress, savePref, saveProgress, type Progress } from "./progress";
import type { SceneStatus } from "./shared";
import type { SoundEngine, Sfx } from "./sound-engine";
import type { StageMode } from "./Stage";
import { FlatScene } from "./FlatScene";
import { DetailsPanel } from "./DetailsPanel";

const Stage = dynamic(() => import("./Stage"), { ssr: false });

type Screen = "title" | "map" | "warp" | "play" | "won" | "end";
type RunStars = { finish: boolean; speed: boolean; quiz: boolean | null; seconds: number };

const unlocked = (p: Progress, i: number) => i === 0 || p[levels[i - 1].id] !== undefined;
const starsOf = (r: RunStars) => Number(r.finish) + Number(r.speed) + Number(r.quiz === true);

export function Game() {
  const [screen, setScreen] = useState<Screen>("title");
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState<Progress>({});
  const [quality, setQuality] = useState<Quality>("low");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [still, setStill] = useState(false);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState<SceneStatus | null>(null);
  const [run, setRun] = useState<RunStars | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [details, setDetails] = useState(false);

  const level = levels[index];
  const sound = useRef<SoundEngine | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const barValue = useRef<HTMLDivElement>(null);
  const started = useRef(0);
  const root = useRef<HTMLDivElement>(null);

  // Read device and saved settings once we are in the browser.
  useEffect(() => {
    setProgress(loadProgress());
    setWebgl(hasWebGL());
    const q = loadPref("graphics");
    setQuality(q === "high" || q === "low" ? q : detectQuality());
    setMuted(loadPref("muted") === "1");
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

  /* ---------------- level flow ---------------- */
  const go = useCallback(
    (i: number) => {
      void ensureSound().then((s) => s?.play(levels[i].id === "forge" ? "forge" : "cosmos"));
      sfx("whoosh");
      setIndex(i);
      setAttempt((a) => a + 1);
      setRun(null);
      setAnswer(null);
      setStatus(null);
      setScreen("warp");
    },
    [ensureSound, sfx],
  );

  useEffect(() => {
    if (screen !== "warp") return;
    const t = window.setTimeout(() => {
      started.current = performance.now();
      setScreen("play");
    }, still ? 900 : 2200);
    return () => window.clearTimeout(t);
  }, [screen, still]);

  const onProgress = useCallback((p: number) => {
    const v = Math.max(0, Math.min(1, p));
    if (bar.current) bar.current.style.transform = `scaleX(${v})`;
    const pct = Math.round(v * 100);
    if (barValue.current && barValue.current.getAttribute("aria-valuenow") !== String(pct)) {
      barValue.current.setAttribute("aria-valuenow", String(pct));
    }
  }, []);

  const onWin = useCallback(() => {
    const seconds = (performance.now() - started.current) / 1000;
    const r: RunStars = { finish: true, speed: seconds <= levels[index].par, quiz: null, seconds };
    setRun(r);
    setScreen("won");
    sfx("chime");
    setProgress((p) => {
      const next = { ...p, [levels[index].id]: Math.max(p[levels[index].id] ?? 0, starsOf(r)) };
      saveProgress(next);
      return next;
    });
  }, [index, sfx]);

  const choose = (i: number) => {
    if (answer !== null || !run) return;
    setAnswer(i);
    const right = i === level.quiz.correct;
    sfx(right ? "chime" : "divide");
    const r = { ...run, quiz: right };
    setRun(r);
    setProgress((p) => {
      const next = { ...p, [level.id]: Math.max(p[level.id] ?? 0, starsOf(r)) };
      saveProgress(next);
      return next;
    });
  };

  const next = () => (index + 1 < levels.length ? go(index + 1) : setScreen("end"));
  const skip = () => {
    setProgress((p) => {
      const nextP = { ...p, [level.id]: p[level.id] ?? 0 };
      saveProgress(nextP);
      return nextP;
    });
    next();
  };
  const play = () => {
    const first = levels.findIndex((_, i) => unlocked(progress, i) && progress[levels[i].id] === undefined);
    go(first === -1 ? 0 : first);
  };

  const setGraphics = (q: Quality) => {
    setQuality(q);
    savePref("graphics", q);
  };
  const onSlow = useCallback(() => setQuality("low"), []);

  /* ---------------- keyboard play ---------------- */
  useEffect(() => {
    if (screen !== "play") return;
    const isAction = (e: KeyboardEvent) => (e.key === " " || e.key === "Enter") && !(e.target as Element)?.closest?.("button, a, dialog");
    const down = (e: KeyboardEvent) => {
      if (!isAction(e) || e.repeat) return;
      e.preventDefault();
      window.dispatchEvent(new Event("game:press"));
    };
    const up = (e: KeyboardEvent) => {
      if (!isAction(e)) return;
      e.preventDefault();
      window.dispatchEvent(new Event("game:release"));
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [screen]);

  /* ---------------- motion for the screens ---------------- */
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || still) return;
    const ctx = gsap.context(() => {
      if (screen === "title") {
        gsap.from(".title-word", { y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: "back.out(1.6)" });
        gsap.from(".title-actions > *", { y: 20, opacity: 0, duration: 0.5, delay: 0.5, stagger: 0.08 });
      }
      if (screen === "warp") {
        gsap.fromTo(".warp-card", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" });
        gsap.to(".warp-card", { scale: 1.6, opacity: 0, duration: 0.5, delay: 1.6, ease: "power2.in" });
      }
      if (screen === "won" || screen === "end") {
        gsap.from(".card", { y: 50, opacity: 0, duration: 0.55, ease: "back.out(1.4)" });
        gsap.from(".star-badge", { scale: 0, rotate: -90, duration: 0.5, delay: 0.3, stagger: 0.15, ease: "back.out(3)" });
      }
      if (screen === "map") gsap.from(".map-node", { y: 30, opacity: 0, duration: 0.45, stagger: 0.06, ease: "back.out(1.6)" });
    }, el);
    return () => ctx.revert();
  }, [screen, still]);

  const mode: StageMode =
    screen === "title" || screen === "map" || screen === "end"
      ? { kind: "title" }
      : screen === "warp"
        ? { kind: "warp", color: level.color }
        : { kind: "level", id: level.id, attempt };

  const total = levels.reduce((n, l) => n + (progress[l.id] ?? 0), 0);

  return (
    <div ref={root} className="game" style={{ "--lvl": level.color } as React.CSSProperties} data-screen={screen}>
      {webgl ? (
        <Stage
          mode={screen === "won" ? { kind: "level", id: level.id, attempt } : mode}
          quality={quality}
          onSlow={onSlow}
          onProgress={onProgress}
          onWin={onWin}
          onStatus={setStatus}
          sfx={sfx}
          still={still}
        />
      ) : null}

      <h1 className={screen === "title" ? "title" : "sr-only"}>
        <span className="title-word">THE</span> <span className="title-word">JOURNEY</span>
        <span className="sr-only">, Chapter 1: Before Everything</span>
      </h1>

      {/* ---------------- title ---------------- */}
      {screen === "title" ? (
        <div className="screen title-screen">
          <p className="title-chapter title-word">
            Chapter 1 · <strong>{CHAPTER.title}</strong>
          </p>
          <p className="title-tag title-word">{CHAPTER.tagline}</p>
          <div className="title-actions">
            <button type="button" className="btn btn-big" onClick={play}>
              <PlayIcon /> {total > 0 ? "Keep playing" : "Play"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setScreen("map")}>
              Pick a level
            </button>
          </div>
          <Settings quality={quality} setGraphics={setGraphics} muted={muted} toggleMute={toggleMute} webgl={webgl} />
        </div>
      ) : null}

      {/* ---------------- level map ---------------- */}
      {screen === "map" ? (
        <div className="screen map-screen">
          <div className="map-head">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setScreen("title")}>
              ← Back
            </button>
            <h2 className="map-title">Chapter 1: {CHAPTER.title}</h2>
            <p className="map-stars" aria-label={`${total} of ${levels.length * 3} stars`}>
              <StarIcon on /> {total} / {levels.length * 3}
            </p>
          </div>
          <ol className="map-path">
            {levels.map((l, i) => {
              const open = unlocked(progress, i);
              const got = progress[l.id];
              return (
                <li key={l.id} className="map-node" style={{ "--c": l.color } as React.CSSProperties}>
                  <button type="button" className="map-btn" disabled={!open} onClick={() => go(i)}>
                    <span className="map-orb" aria-hidden="true">
                      {open ? l.number : <LockIcon />}
                    </span>
                    <span className="map-text">
                      <span className="map-name">{l.name}</span>
                      <span className="map-when">{l.when}</span>
                      <span className="map-got" aria-label={open ? `${got ?? 0} of 3 stars` : "Locked: finish the level before"}>
                        {open ? [0, 1, 2].map((k) => <StarIcon key={k} on={(got ?? 0) > k} />) : "Locked"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {/* ---------------- warp ---------------- */}
      {screen === "warp" ? (
        <div className="screen warp-screen" role="status">
          <div className="warp-card">
            <p className="warp-level">Level {level.number}</p>
            <p className="warp-name">{level.name}</p>
            <p className="warp-when">{level.when}</p>
          </div>
        </div>
      ) : null}

      {/* ---------------- playing ---------------- */}
      {screen === "play" || screen === "won" ? (
        <div className="hud" aria-hidden={screen === "won" ? true : undefined}>
          <div className="hud-top">
            <div className="hud-level">
              <span className="hud-num">Level {level.number}/{levels.length}</span>
              <span className="hud-name">{level.name}</span>
              <span className="hud-when">{level.when}</span>
            </div>
            <div className="hud-buttons">
              <button type="button" className="icon-btn" onClick={() => setDetails(true)} aria-label="Learn more about this level">
                <BookIcon />
                <span className="icon-label">Learn more</span>
              </button>
              <button type="button" className="icon-btn" onClick={toggleMute} aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted}>
                {muted ? <MuteIcon /> : <SoundIcon />}
              </button>
              <button type="button" className="icon-btn" onClick={() => setScreen("map")} aria-label="Level map">
                <MapIcon />
              </button>
            </div>
          </div>

          {status ? (
            <div className="hud-status" aria-live="polite">
              <span>{status.label}</span>
              {status.chips ? (
                <span className="chips">
                  {status.chips.map((c) => (
                    <abbr key={c.text} title={c.title} className={c.on ? "chip on" : "chip"}>
                      {c.text}
                    </abbr>
                  ))}
                </span>
              ) : null}
            </div>
          ) : null}

          {webgl ? null : <FlatScene key={`${level.id}-${attempt}`} level={level} onProgress={onProgress} onWin={onWin} sfx={sfx} />}

          <div className="hud-bottom">
            <p className="hud-goal" aria-live="polite">
              <span className="goal-long">{level.goal}</span>
              <span className="goal-short" aria-hidden="true">{level.goalShort}</span>
            </p>
            <div className="hud-bar-row">
              <div ref={barValue} className="hud-bar" role="progressbar" aria-label="Level progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                <div ref={bar} className="hud-bar-fill" />
              </div>
              <button type="button" className="skip" onClick={skip}>
                Skip
              </button>
            </div>
            {webgl ? <p className="sr-only">You can also play with the keyboard: press or hold Space.</p> : null}
          </div>
        </div>
      ) : null}

      {/* ---------------- level complete ---------------- */}
      {screen === "won" && run ? (
        <div className="screen won-screen">
          <div className="card" role="dialog" aria-modal="false" aria-labelledby="won-title">
            <p className="card-kicker">Level {level.number} complete!</p>
            <h2 id="won-title" className="card-title">{level.win}</h2>
            <ul className="stars-row" aria-label={`${starsOf(run)} of 3 stars`}>
              <StarBadge on={run.finish} label="Finished" />
              <StarBadge on={run.speed} label={run.speed ? `Speedy! ${Math.round(run.seconds)}s` : `Under ${level.par}s`} />
              <StarBadge on={run.quiz === true} label={run.quiz === null ? "Quiz" : run.quiz ? "Quiz right!" : "Quiz"} />
            </ul>
            <p className="card-fact">{level.fact}</p>

            <div className="quiz">
              <p className="quiz-q">
                <span className="quiz-tag">Quick quiz</span> {level.quiz.question}
              </p>
              <div className="quiz-answers">
                {level.quiz.answers.map((a, i) => (
                  <button
                    key={a}
                    type="button"
                    className={`quiz-a${answer === null ? "" : i === level.quiz.correct ? " right" : i === answer ? " wrong" : ""}`}
                    onClick={() => choose(i)}
                    disabled={answer !== null}
                  >
                    {a}
                  </button>
                ))}
              </div>
              {answer !== null ? (
                <p className="quiz-why" role="status">
                  <strong>{answer === level.quiz.correct ? "Yes! " : "Not quite. "}</strong>
                  {level.quiz.why}
                </p>
              ) : null}
            </div>

            <div className="card-actions">
              <button type="button" className="btn btn-big" onClick={next} autoFocus>
                {index + 1 < levels.length ? "Next level" : "Finish chapter"} <ArrowIcon />
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setDetails(true)}>
                <BookIcon /> Learn more
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => go(index)}>
                Play again
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------- chapter complete ---------------- */}
      {screen === "end" ? (
        <div className="screen won-screen">
          <div className="card end-card">
            <p className="card-kicker">Chapter 1 complete!</p>
            <h2 className="card-title">You built the universe!</h2>
            <p className="end-total">
              <StarIcon on /> {total} of {levels.length * 3} stars
            </p>
            <p className="card-fact">
              From a tiny hot speck to shining galaxies. The atoms that make you were cooked in stars like the ones you just built.
              You really are made of star stuff.
            </p>
            <p className="coming">
              <span className="quiz-tag">Coming soon</span> {CHAPTER.next}
            </p>
            <div className="card-actions">
              <button type="button" className="btn btn-big" onClick={() => setScreen("map")}>
                Level map
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => go(0)}>
                Play again
              </button>
              <Link href="/sources" className="btn btn-ghost">
                See the science
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <DetailsPanel level={level} open={details} onClose={() => setDetails(false)} />
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
        <p className="seg-label">Simple mode: this device can&rsquo;t show 3D, so the game uses flat pictures.</p>
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

function StarBadge({ on, label }: { on: boolean; label: string }) {
  return (
    <li className={on ? "star-badge on" : "star-badge"}>
      <StarIcon on={on} big />
      <span>{label}</span>
    </li>
  );
}

/* ---------------- icons (inline, no icon font) ---------------- */
function StarIcon({ on, big }: { on: boolean; big?: boolean }) {
  const s = big ? 44 : 18;
  return (
    <svg aria-hidden="true" width={s} height={s} viewBox="0 0 24 24" className={on ? "star on" : "star"}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  );
}
const svg = { "aria-hidden": true, width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
function PlayIcon() {
  return (
    <svg {...svg} fill="currentColor" stroke="none">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg {...svg}>
      <path d="M5 12h14M13 6l6 6-6 6" />
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
function MapIcon() {
  return (
    <svg {...svg}>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg {...svg} width={26} height={26}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

export type { Level };
