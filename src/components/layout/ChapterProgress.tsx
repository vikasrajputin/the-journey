"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { chapters, type ChapterSummary } from "@/data/navigation";

export const LAST_CHAPTER_KEY = "journey:last-chapter";

/**
 * A slim sticky bar under the site header on chapter pages: current chapter,
 * its time span, a reading-progress line and a 10-step map of the journey.
 * It is 40px tall, so it never hides more than a line of text, and it is
 * hidden from print. Progress uses a transform, so it causes no layout shift.
 */
export function ChapterProgress({ chapter }: { chapter: ChapterSummary }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LAST_CHAPTER_KEY, chapter.slug);
    } catch {
      /* storage unavailable */
    }
  }, [chapter.slug]);

  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-chapter]");
    const bar = barRef.current;
    if (!article || !bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="chapter-progress print:hidden" data-theme={chapter.theme}>
      <div className="container-wide flex h-10 items-center justify-between gap-4 text-xs">
        <p className="min-w-0 truncate text-muted">
          <span className="text-chapter tabular-nums">{String(chapter.number).padStart(2, "0")}</span>
          <span className="mx-2 text-border-dark" aria-hidden="true">/</span>
          <span className="text-text-light">{chapter.title}</span>
          <span className="hidden sm:inline"> · {chapter.timeLabel}</span>
        </p>
        {/* Small screens: a compact, decorative position indicator (chapter links live in the menu). */}
        <p className="flex shrink-0 items-center gap-1 sm:hidden">
          <span className="sr-only">
            Chapter {chapter.number} of {chapters.length}
          </span>
          {chapters.map((c) => (
            <span
              key={c.id}
              aria-hidden="true"
              className={`block h-1.5 rounded-full ${c.slug === chapter.slug ? "w-4 bg-chapter" : c.number < chapter.number ? "w-1.5 bg-text-light/60" : "w-1.5 bg-text-light/20"}`}
            />
          ))}
        </p>
        {/* Larger screens: each step is a link with a 24px target. */}
        <nav aria-label="Journey map" className="hidden shrink-0 sm:block">
          <ol className="flex items-center">
            {chapters.map((c) => {
              const current = c.slug === chapter.slug;
              const passed = c.number < chapter.number;
              return (
                <li key={c.id}>
                  <Link
                    href={`/journey/${c.slug}`}
                    aria-current={current ? "page" : undefined}
                    aria-label={`Chapter ${c.number}: ${c.title}`}
                    title={`${c.number}. ${c.title}`}
                    className="group flex h-8 w-6 items-center justify-center"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all ${
                        current ? "w-5 bg-chapter" : passed ? "w-1.5 bg-text-light/60 group-hover:bg-accent" : "w-1.5 bg-text-light/20 group-hover:bg-accent"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
      <div aria-hidden="true" className="h-px w-full bg-border-dark">
        <div ref={barRef} className="h-px origin-left bg-chapter" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
