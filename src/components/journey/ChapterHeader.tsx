import type { Chapter } from "@/lib/content-schema";
import { SplitWords } from "@/components/motion/SplitWords";
import Link from "next/link";
import { chapters } from "@/data/navigation";
import { ChapterBackdrop } from "./ChapterBackdrop";
import { media } from "@/lib/media";

const heroMedia: Record<string, { media: string; scene: string }> = {
  "before-everything": { media: "hubble-zoom", scene: "beginning" },
  "planet-earth": { media: "lava", scene: "planet" },
  "first-life": { media: "black-smoker", scene: "life" },
  diversification: { media: "marrella", scene: "explosion" },
  "age-of-giants": { media: "sue", scene: "giants" },
  "human-story": { media: "campfire", scene: "humans" },
  civilisation: { media: "pyramids", scene: "civilisation" },
  "age-of-ideas": { media: "hudf", scene: "ideas" },
  "world-we-built": { media: "city-lights", scene: "world" },
  you: { media: "pale-blue-dot", scene: "you" },
};

/** Full-bleed photograph or video behind the chapter title. A failed load leaves the painted backdrop. */
function ChapterHero({ slug }: { slug: string }) {
  const h = heroMedia[slug];
  const m = h ? media[h.media] : undefined;
  if (!m) return null;
  return (
    <div className="chapter-hero" aria-hidden="true">
      {m.kind === "video" ? (
        <video autoPlay muted loop playsInline preload="metadata" poster={m.src}>
          {m.sources?.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
        </video>
      ) : (
        <div className="chapter-hero-img" style={{ backgroundImage: `url("${m.src}")` }} />
      )}
    </div>
  );
}

/** Chapter opening: number, title, time, central question, cinematic statement and orientation. */
export function ChapterHeader({ chapter }: { chapter: Chapter }) {
  return (
    <header className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden border-b border-border-dark">
      <ChapterBackdrop theme={chapter.theme} />
      <ChapterHero slug={chapter.slug} />
      <div className="container-wide relative pt-28 pb-14 md:pt-40 md:pb-20">
        <p className="eyebrow text-chapter">
          Chapter {chapter.number} <span className="text-muted">of {chapters.length}</span>
        </p>
        <h1 id="chapter-title" className="mt-4 max-w-5xl font-display text-[length:var(--text-h1)] leading-[0.98]">
          <SplitWords text={chapter.title} className="split-load" />
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
        <p className="mt-8">
          <Link href={`/#${heroMedia[chapter.slug]?.scene ?? ""}`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-night hover:scale-[1.03] transition-transform">
            <span aria-hidden="true">▶</span> Experience this chapter
          </Link>
        </p>
        <p className="mt-5 text-sm">
          <Link href={`/timeline?chapter=${chapter.slug}`} className="link-quiet text-muted hover:text-text-light">
            See this chapter on the full timeline →
          </Link>
        </p>
      </div>
    </header>
  );
}
