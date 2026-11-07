"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { isTouch, prefersStill } from "@/components/motion/motion-pref";

export type ShowcaseCard = {
  slug: string;
  number: number;
  title: string;
  time: string;
  question: string;
  theme: string;
  image?: string;
  imageLarge?: string;
  video?: { src: string; type: string }[];
  credit?: string;
};

const EXPAND_MS = 820;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

/**
 * Grows the card's picture until it fills the screen, then opens the chapter
 * underneath. The chapter's opening shows the same picture, and the copy
 * fades away there (see ExpandLanding), so the move feels like one shot.
 */
function expandInto(card: HTMLElement, image: string | undefined, theme: string, go: () => void) {
  const frame = card.querySelector<HTMLElement>(".show-media");
  if (!frame) return go();
  const r = frame.getBoundingClientRect();
  const clone = document.createElement("div");
  clone.className = "expand-clone";
  clone.setAttribute("data-theme", theme);
  clone.setAttribute("aria-hidden", "true");
  const pic = document.createElement("div");
  if (image) pic.style.backgroundImage = `url("${image}")`;
  clone.appendChild(pic);
  document.body.appendChild(clone);
  const radius = getComputedStyle(frame).borderRadius;
  const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round ${radius})`;
  const html = document.documentElement;
  html.setAttribute("data-expanding", "");
  const timing = { duration: EXPAND_MS, easing: EASE, fill: "forwards" as const };
  clone.animate([{ clipPath: from }, { clipPath: "inset(0px 0px 0px 0px round 0px)" }], timing);
  pic.animate([{ transform: "scale(1.15)" }, { transform: "scale(1)" }], timing);
  window.setTimeout(go, EXPAND_MS - 120);
  // Never leave the picture covering the page if the next one fails to load.
  window.setTimeout(() => {
    if (!clone.isConnected) return;
    html.removeAttribute("data-expanding");
    clone.remove();
  }, 6000);
}

export function ShowcaseGrid({ cards }: { cards: ShowcaseCard[] }) {
  const router = useRouter();
  const busy = useRef(false);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, c: ShowcaseCard) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || prefersStill() || busy.current) return;
    e.preventDefault();
    busy.current = true;
    expandInto(e.currentTarget, c.image, c.theme, () => {
      router.push(`/journey/${c.slug}`);
      window.setTimeout(() => (busy.current = false), 1500);
    });
  };

  const play = (e: React.PointerEvent<HTMLElement>, on: boolean) => {
    if (e.pointerType !== "mouse" || isTouch()) return;
    const v = e.currentTarget.querySelector("video");
    if (!v) return;
    if (on) void v.play().catch(() => {});
    else v.pause();
  };

  return (
    <ol className="show-grid">
      {cards.map((c, i) => (
        <li key={c.slug} data-theme={c.theme} className="show-item" data-reveal style={{ "--i": i % 2 } as React.CSSProperties}>
          <Link
            href={`/journey/${c.slug}`}
            className="show-card"
            data-no-curtain
            onClick={(e) => onClick(e, c)}
            onPointerEnter={(e) => play(e, true)}
            onPointerLeave={(e) => play(e, false)}
          >
            <span className="show-media">
              <span className="show-media-inner" data-parallax="0.12">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote Wikimedia Commons file
                  <img src={c.image} alt="" loading={i < 2 ? "eager" : "lazy"} decoding="async" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                ) : null}
                {c.video ? (
                  <video muted loop playsInline preload="none" poster={c.image} tabIndex={-1}>
                    {c.video.map((s) => (
                      <source key={s.src} src={s.src} type={s.type} />
                    ))}
                  </video>
                ) : null}
              </span>
              <span className="show-num" aria-hidden="true">
                {String(c.number).padStart(2, "0")}
              </span>
              <span className="show-go" aria-hidden="true">
                Open
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
            <span className="show-text">
              <span className="show-chip">Chapter {c.number}</span>
              <span className="show-title">{c.title}</span>
              <span className="show-q">{c.question}</span>
              <span className="show-time">{c.time}</span>
            </span>
          </Link>
          {c.credit ? <p className="show-credit">Picture: {c.credit}</p> : null}
        </li>
      ))}
    </ol>
  );
}
