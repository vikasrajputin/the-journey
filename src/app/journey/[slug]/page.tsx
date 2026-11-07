import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chapters, getAdjacentChapters, getChapterSummary } from "@/data/navigation";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapterSummary(slug);
  if (!chapter) return {};
  return {
    title: `${chapter.number}. ${chapter.title}`,
    description: `${chapter.centralQuestion} ${chapter.timeLabel}.`,
  };
}

export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const chapter = getChapterSummary(slug);
  if (!chapter) notFound();
  const { previous, next } = getAdjacentChapters(slug);

  return (
    <article data-theme={chapter.theme} aria-labelledby="chapter-title">
      <header className="relative isolate overflow-hidden border-b border-border-dark">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_30%,var(--chapter-glow),transparent_70%)]" />
        <div aria-hidden="true" className="starfield absolute inset-0 -z-10 opacity-30" />
        <div className="container-wide pt-20 pb-16 md:pt-32 md:pb-24">
          <p className="eyebrow text-chapter">Chapter {chapter.number} of {chapters.length}</p>
          <h1 id="chapter-title" className="mt-4 font-display text-[length:var(--text-h1)]">
            {chapter.title}
          </h1>
          <p className="mt-6 text-muted">{chapter.timeLabel}</p>
          <p className="mt-8 max-w-2xl font-display text-2xl italic text-text-light/90 md:text-3xl">
            {chapter.centralQuestion}
          </p>
        </div>
      </header>

      <nav aria-label="Chapter navigation" className="container-wide grid gap-4 py-16 sm:grid-cols-2">
        {previous ? (
          <Link href={`/journey/${previous.slug}`} className="rounded-xl border border-border-dark p-6 hover:border-accent">
            <span className="eyebrow text-muted">Previous</span>
            <span className="mt-2 block font-display text-xl">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/journey/${next.slug}`} className="rounded-xl border border-border-dark p-6 text-right hover:border-accent">
            <span className="eyebrow text-muted">Next chapter</span>
            <span className="mt-2 block font-display text-xl">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
