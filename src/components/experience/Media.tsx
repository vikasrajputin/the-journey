"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { useExperience } from "./ExperienceContext";

/** Calls `fn(progress)` every frame while the scene is active. */
export function useScrub(progress: React.RefObject<number>, active: boolean, fn: (p: number) => void) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    fnRef.current(progress.current ?? 0);
    if (!active) return;
    let raf = 0;
    const loop = () => {
      fnRef.current(progress.current ?? 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, progress]);
}

type LayerProps = { id: string; className?: string; style?: React.CSSProperties; kenburns?: boolean; priority?: boolean };

/** A full-bleed photograph. If it cannot load, it fades away and the scene's own artwork shows through. */
export const MediaImage = forwardRef<HTMLDivElement, LayerProps>(function MediaImage({ id, className = "", style, kenburns, priority }, ref) {
  const { media } = useExperience();
  const m = media[id];
  const [failed, setFailed] = useState(false);
  if (!m || failed) return <div ref={ref} className={`media-layer ${className}`} style={style} aria-hidden="true" />;
  return (
    <div ref={ref} className={`media-layer ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element -- remote Wikimedia file, sized by Wikimedia */}
      <img
        src={m.src}
        srcSet={`${m.srcSmall} 960w, ${m.src} 1920w`}
        sizes="100vw"
        alt={m.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={kenburns ? "kenburns" : undefined}
        onError={() => setFailed(true)}
      />
    </div>
  );
});

/**
 * A full-bleed, muted, looping video that only plays while its scene is on
 * screen. Falls back to its poster frame, then to nothing.
 */
export const MediaVideo = forwardRef<HTMLDivElement, LayerProps & { play: boolean; rate?: number }>(function MediaVideo(
  { id, className = "", style, play, rate = 1 },
  ref,
) {
  const { media, reduced } = useExperience();
  const m = media[id];
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (play && !reduced) {
      if (v.preload !== "auto") v.preload = "auto";
      v.play().catch(() => undefined);
    } else v.pause();
  }, [play, reduced]);

  useEffect(() => {
    if (video.current) video.current.playbackRate = rate;
  }, [rate]);

  if (!m) return <div ref={ref} className={`media-layer ${className}`} style={style} aria-hidden="true" />;
  if (failed)
    return (
      <div ref={ref} className={`media-layer ${className}`} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element -- poster frame fallback */}
        <img src={m.src} alt={m.alt} className="kenburns" onError={(e) => e.currentTarget.remove()} />
      </div>
    );
  return (
    <div ref={ref} className={`media-layer ${className}`} style={style}>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        poster={m.src}
        aria-label={m.alt}
        onError={() => setFailed(true)}
      >
        {m.sources?.map((s, i) => (
          <source key={i} src={s.src} type={s.type} onError={i === (m.sources?.length ?? 0) - 1 ? () => setFailed(true) : undefined} />
        ))}
      </video>
    </div>
  );
});
