import Link from "next/link";
import type { ChapterSummary } from "@/data/navigation";

type Props = { text: string; previous?: ChapterSummary; next?: ChapterSummary };

/** A quiet bridge into the next chapter, plus chapter-to-chapter navigation. */
export function ChapterTransition({ text, previous, next }: Props) {
  return (
    <section aria-label="Continue the journey" className="relative isolate mt-[var(--space-section)] overflow-hidden border-t border-border-dark">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_100%,var(--chapter-glow),transparent_70%)]" />
      <div className="container-reading py-20 text-center md:py-28">
        <p className="font-display text-2xl italic leading-snug text-text-light md:text-4xl" data-reveal>
          {text}
        </p>
      </div>

      <nav aria-label="Chapters" className="container-wide grid gap-4 pb-20 sm:grid-cols-2">
        {previous ? (
          <Link href={`/journey/${previous.slug}`} rel="prev" className="group rounded-2xl border border-border-dark p-6 transition-colors hover:border-accent md:p-8">
            <span className="eyebrow text-muted">← Chapter {previous.number}</span>
            <span className="mt-2 block font-display text-2xl group-hover:text-accent">{previous.title}</span>
          </Link>
        ) : (
          <Link href="/journey" className="group rounded-2xl border border-border-dark p-6 transition-colors hover:border-accent md:p-8">
            <span className="eyebrow text-muted">← All chapters</span>
            <span className="mt-2 block font-display text-2xl group-hover:text-accent">The journey</span>
          </Link>
        )}
        {next ? (
          <Link href={`/journey/${next.slug}`} rel="next" className="group rounded-2xl border border-accent/50 bg-panel/60 p-6 text-right transition-colors hover:border-accent md:p-8">
            <span className="eyebrow text-accent">Next · Chapter {next.number} →</span>
            <span className="mt-2 block font-display text-2xl group-hover:text-accent">{next.title}</span>
            <span className="mt-1 block text-sm text-muted">{next.centralQuestion}</span>
          </Link>
        ) : (
          <Link href="/timeline" className="group rounded-2xl border border-accent/50 bg-panel/60 p-6 text-right transition-colors hover:border-accent md:p-8">
            <span className="eyebrow text-accent">Keep exploring →</span>
            <span className="mt-2 block font-display text-2xl group-hover:text-accent">See the whole story on one timeline</span>
          </Link>
        )}
      </nav>
    </section>
  );
}
