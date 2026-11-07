"use client";

import { useEffect, useRef } from "react";
import type { ResolvedMedia } from "@/lib/media";
import { prefersStill } from "@/components/motion/motion-pref";

/**
 * A wide photo or video between two sections. It opens up from a smaller
 * frame as it scrolls into view, and its caption slides in from the side.
 * Videos only play while they are on screen.
 */
export function MediaSlide({ m, flip }: { m: ResolvedMedia; flip?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !prefersStill()) void v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`media-slide${flip ? " flip" : ""}`} data-reveal>
      <div className="media-slide-frame">
        <div className="media-slide-inner" data-parallax="0.1">
          {m.kind === "video" ? (
            <video ref={video} muted loop playsInline preload="none" poster={m.srcSmall} aria-label={m.alt}>
              {m.sources?.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
            </video>
          ) : (
            <picture>
              <source media="(max-width: 700px)" srcSet={m.srcSmall} />
              <img src={m.src} alt={m.alt} loading="lazy" decoding="async" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
            </picture>
          )}
        </div>
      </div>
      <figcaption className="media-slide-cap">
        <span className="media-slide-text">{m.alt}</span>
        <span className="media-slide-credit">
          {m.credit} ·{" "}
          <a href={m.page} target="_blank" rel="noopener noreferrer">
            See the original<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
