"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getSource } from "@/data/sources";
import { Artefacts } from "./Artefacts";
import { SplitWords } from "@/components/motion/SplitWords";
import { useExperience } from "./ExperienceContext";
import type { SceneDef } from "./scene-data";

export type SceneState = {
  progress: React.RefObject<number>;
  active: boolean;
  beat: number;
};

/**
 * One chapter of the experience: a tall section with a sticky full-screen
 * stage. Scrolling moves through the scene's beats; nothing hijacks the scroll.
 */
export function SceneShell({
  def,
  onReport,
  children,
}: {
  def: SceneDef;
  onReport: (id: string, beat: number, active: boolean) => void;
  children: (s: SceneState) => React.ReactNode;
}) {
  const { media, hearing } = useExperience();
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [beat, setBeat] = useState(0);
  const [active, setActive] = useState(false);
  const reportRef = useRef(onReport);
  reportRef.current = onReport;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let lastBeat = -1;
    let lastActive: boolean | null = null;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      progress.current = p;
      let b = 0;
      def.beats.forEach((bt, i) => {
        if (p >= bt.at) b = i;
      });
      const isActive = r.top <= vh * 0.5 && r.bottom >= vh * 0.5;
      if (b !== lastBeat) {
        lastBeat = b;
        setBeat(b);
      }
      if (isActive !== lastActive) {
        lastActive = isActive;
        setActive(isActive);
      }
      if (isActive) reportRef.current(def.id, b, true);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [def]);

  const credits = def.media.map((id) => media[id]).filter(Boolean);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = def.beats[beat] ?? def.beats[0];
  const orgs = [...new Set(current.sources.map((id) => shortOrg(getSource(id)?.organisation)))].filter(Boolean).slice(0, 2);
  const openProof = () => dialog.current?.showModal();

  return (
    <section
      ref={ref}
      id={def.id}
      data-theme={def.theme}
      aria-labelledby={`${def.id}-title`}
      className="scene"
      style={{ height: `${def.length * 100}svh` }}
      data-active={active || undefined}
    >
      <div className="scene-stage">
        {children({ progress, active, beat })}
        <div className="scene-vignette" aria-hidden="true" />

        <header className="scene-head">
          <p className="scene-eyebrow">
            <span className="scene-chip">Chapter {def.number}</span> {def.beats[beat]?.when ?? def.beats[0].when}
          </p>
          <h2 id={`${def.id}-title`} className="scene-title" tabIndex={-1}>
            <SplitWords text={def.title} />
          </h2>
          <p className="scene-see" data-real={current.real || undefined}>
            <span className="scene-see-dot" aria-hidden="true" />
            {current.see}
          </p>
          {def.sound && hearing === def.sound.media ? (
            <p className="scene-hear">
              <span className="scene-hear-bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>
                <span className="sr-only">You are hearing: </span>
                {def.sound.label}
              </span>
            </p>
          ) : null}
        </header>

        <div className="scene-captions">
          {def.beats.map((b, i) => (
            <p key={i} className="scene-caption" data-on={i === beat || undefined}>
              <SplitWords text={b.text} whole highlight />
            </p>
          ))}
        </div>

        <div className="scene-foot">
          <button type="button" className="scene-proof" onClick={openProof}>
            How do we know?
            {orgs.length ? <span className="scene-proof-orgs">· {orgs.join(" · ")}</span> : null}
          </button>
          {def.artefacts?.length ? <Artefacts items={def.artefacts} sceneId={def.id} /> : null}
          <Link href={`/journey/${def.chapter}/`} className="scene-deeper">
            Read more <span aria-hidden="true">→</span>
            <span className="sr-only">: read chapter {def.number}, {def.title}</span>
          </Link>
          {credits.length ? (
            <details className="scene-credits">
              <summary>Credits</summary>
              <ul>
                {credits.map((m) => (
                  <li key={m.id}>
                    <a href={m.page} target="_blank" rel="noopener noreferrer">
                      {m.kind === "video" ? "Video" : m.kind === "audio" ? "Sound" : "Photo"}: {m.credit}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
                {def.note ? <li>{def.note}</li> : null}
              </ul>
            </details>
          ) : null}
        </div>
      </div>

      <dialog ref={dialog} className="proof" aria-labelledby={`${def.id}-proof-title`} onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        <div className="proof-inner">
          <div className="proof-head">
            <div>
              <p className="scene-eyebrow">Chapter {def.number} · The proof</p>
              <h3 id={`${def.id}-proof-title`} className="proof-title">
                {def.title}
              </h3>
            </div>
            <button type="button" className="proof-close" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
          <p className="proof-intro">
            Every line in this scene is backed by a science body, museum or peer-reviewed study. Labels show what is real and what is a simulation.
          </p>
          <ol className="proof-list">
            {def.beats.map((b, i) => (
              <li key={i} data-current={i === beat || undefined}>
                <p className="proof-claim">{b.text}</p>
                <p className="proof-see" data-real={b.real || undefined}>
                  <span className="scene-see-dot" aria-hidden="true" />
                  {b.see}
                </p>
                <ul className="proof-sources">
                  {b.sources.map((id) => {
                    const src = getSource(id);
                    if (!src) return null;
                    return (
                      <li key={id}>
                        <a href={src.url} target="_blank" rel="noopener noreferrer">
                          {src.title}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                        <span className="proof-org">
                          {" "}
                          · {src.organisation}
                          {src.verification === "located" ? " · publisher blocks automated checks; awaiting a hand check" : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
            {def.sound ? (
              <li>
                <p className="proof-claim">What you hear</p>
                <p className="proof-see" data-real="true">
                  <span className="scene-see-dot" aria-hidden="true" />
                  {def.sound.label}
                </p>
                <ul className="proof-sources">
                  {media[def.sound.media] ? (
                    <li>
                      <a href={media[def.sound.media].page} target="_blank" rel="noopener noreferrer">
                        The recording on Wikimedia Commons
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      <span className="proof-org"> · {media[def.sound.media].credit}</span>
                    </li>
                  ) : null}
                  {def.sound.sources.map((id) => {
                    const src = getSource(id);
                    if (!src) return null;
                    return (
                      <li key={id}>
                        <a href={src.url} target="_blank" rel="noopener noreferrer">
                          {src.title}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                        <span className="proof-org"> · {src.organisation}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : null}
          </ol>
          <div className="proof-foot">
            <Link href={`/journey/${def.chapter}/#evidence`} className="scene-action-inline">
              Read Chapter {def.number} with all its evidence
            </Link>
            <Link href="/evidence/" className="scene-action-inline ghost">
              How do scientists know?
            </Link>
          </div>
        </div>
      </dialog>
    </section>
  );
}

/** "NASA Science, Hubble Space Telescope" → "NASA Science" */
function shortOrg(org?: string) {
  if (!org) return "";
  const first = org.split(/,|\|/)[0].trim();
  return first.replace(/^Smithsonian National Museum of Natural History.*/, "Smithsonian").replace(/^Indian Space Research Organisation \(ISRO\)/, "ISRO");
}
