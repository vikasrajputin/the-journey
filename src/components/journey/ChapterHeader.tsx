import type { Chapter } from "@/lib/content-schema";
import { chapters } from "@/data/navigation";
import { ChapterBackdrop } from "./ChapterBackdrop";

/** Chapter opening: number, title, time, central question, cinematic statement and orientation. */
export function ChapterHeader({ chapter }: { chapter: Chapter }) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border-dark">
      <ChapterBackdrop theme={chapter.theme} />
      <div className="container-wide pt-16 pb-14 md:pt-28 md:pb-20">
        <p className="eyebrow text-chapter">
          Chapter {chapter.number} <span className="text-muted">of {chapters.length}</span>
        </p>
        <h1 id="chapter-title" className="mt-4 max-w-5xl font-display text-[length:var(--text-h1)] leading-[0.98]">
          {chapter.title}
        </h1>
        <p className="mt-5 max-w-2xl text-[length:var(--text-lead)] text-text-light/80">{chapter.subtitle}</p>

        <p className="mt-12 max-w-3xl font-display text-2xl italic leading-snug text-text-light md:text-4xl">
          {chapter.opening}
        </p>

        <dl className="mt-12 grid max-w-5xl gap-px overflow-hidden rounded-xl border border-border-dark bg-border-dark text-sm sm:grid-cols-3">
          <div className="bg-night/85 p-4 backdrop-blur-sm md:p-5">
            <dt className="eyebrow text-chapter">When</dt>
            <dd className="mt-2 text-text-light/90">{chapter.orientation.when}</dd>
          </div>
          <div className="bg-night/85 p-4 backdrop-blur-sm md:p-5">
            <dt className="eyebrow text-chapter">Where</dt>
            <dd className="mt-2 text-text-light/90">{chapter.orientation.where}</dd>
          </div>
          <div className="bg-night/85 p-4 backdrop-blur-sm md:p-5">
            <dt className="eyebrow text-chapter">Scale</dt>
            <dd className="mt-2 text-text-light/90">{chapter.orientation.scale}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
