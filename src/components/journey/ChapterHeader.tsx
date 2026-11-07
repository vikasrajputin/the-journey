import Link from "next/link";
import type { Block, Chapter } from "@/lib/content-schema";
import { SplitWords } from "@/components/motion/SplitWords";
import { chapters, getAdjacentChapters } from "@/data/navigation";
import { scenes } from "@/components/experience/scene-data";
import { getGlossaryEntry } from "@/content/glossary";
import { toPlainText } from "@/lib/rich-text";
import { media, type ResolvedMedia } from "@/lib/media";
import { heroMedia } from "@/lib/chapter-media";
import { ChapterBackdrop } from "./ChapterBackdrop";
import { ExpandLanding } from "./ExpandLanding";
import { ReelTrack } from "./ReelTrack";

const plain = (s: string) => toPlainText(s, (id) => getGlossaryEntry(id)?.term).replace(/\*/g, "");

/** A short taste of a section: the start of its first lead or paragraph, cut at a word. */
function excerpt(blocks: Block[], max = 170) {
  const b = blocks.find((x) => x.type === "lead" || x.type === "paragraph");
  if (!b || !("text" in b)) return "";
  const t = plain(b.text);
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, "") + "…" : t;
}

function Pic({ m, className = "" }: { m: ResolvedMedia; className?: string }) {
  return m.kind === "video" ? (
    <video className={className} autoPlay muted loop playsInline preload="metadata" poster={m.src}>
      {m.sources?.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  ) : (
    <div className={className} style={{ backgroundImage: `url("${m.src}")` }} />
  );
}

/**
 * The chapter's opening as a reel that slides from right to left as you
 * scroll down: the title, the chapter's main picture, a card for each part
 * of the chapter, and the next chapter at the end. Without JavaScript, or
 * with reduced motion, it is a row you can swipe or scroll sideways.
 */
export function ChapterHeader({ chapter }: { chapter: Chapter }) {
  const hero = media[heroMedia[chapter.slug]?.media ?? ""];
  const more = (scenes.find((s) => s.chapter === chapter.slug)?.media ?? [])
    .filter((id) => id !== heroMedia[chapter.slug]?.media)
    .map((id) => media[id])
    .filter((m): m is ResolvedMedia => !!m && m.kind !== "audio");
  const { next } = getAdjacentChapters(chapter.slug);

  return (
    <header id="chapter-start" className="reel" aria-labelledby="chapter-title">
      <ExpandLanding />
      <ReelTrack>
        <div className="reel-panel reel-intro">
          <ChapterBackdrop theme={chapter.theme} />
          <p className="eyebrow text-chapter">
            Chapter {chapter.number} <span className="text-muted">of {chapters.length}</span>
          </p>
          <h1 id="chapter-title" className="reel-h1">
            <SplitWords text={chapter.title} className="split-load" />
          </h1>
          <p className="reel-sub">{chapter.subtitle}</p>
          <p className="reel-when">{chapter.orientation.when}</p>
          <p className="reel-actions">
            <Link href={`/#${heroMedia[chapter.slug]?.scene ?? ""}`} className="reel-btn">
              <span aria-hidden="true">▶</span> Experience this chapter
            </Link>
            <Link href={`/timeline?chapter=${chapter.slug}`} className="reel-link">
              See this chapter on the full timeline →
            </Link>
          </p>
          <p className="reel-hint" aria-hidden="true">
            Scroll <span>→</span>
          </p>
        </div>

        {hero ? (
          <figure className="reel-panel reel-card reel-hero">
            <div className="reel-media chapter-hero" aria-hidden="true">
              <Pic m={hero} className={hero.kind === "video" ? "" : "chapter-hero-img"} />
            </div>
            <div className="reel-over">
              <p className="reel-quote">{chapter.opening}</p>
            </div>
            <figcaption className="reel-credit">
              Picture: {hero.alt}. {hero.credit}
            </figcaption>
          </figure>
        ) : null}

        <div className="reel-panel reel-about">
          <p className="eyebrow text-chapter">Before you start</p>
          <p className="reel-about-intro">{chapter.intro}</p>
          <dl className="reel-about-facts">
            <div>
              <dt>When</dt>
              <dd>{chapter.orientation.when}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{chapter.orientation.where}</dd>
            </div>
            <div>
              <dt>Scale</dt>
              <dd>{chapter.orientation.scale}</dd>
            </div>
          </dl>
          {chapter.evidence.length ? (
            <a href="#evidence" className="reel-link">
              Skip to the evidence for this chapter
            </a>
          ) : null}
        </div>

        {chapter.sections.map((s, i) => {
          const m = more[i];
          return (
            <article key={s.id} className={`reel-panel reel-card${m ? "" : " reel-plain"}`} aria-labelledby={`reel-${s.id}`}>
              {m ? (
                <div className="reel-media" aria-hidden="true">
                  <Pic m={m} />
                </div>
              ) : (
                <span className="reel-bignum" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <div className="reel-over">
                <span className="reel-num">Part {i + 1}</span>
                {s.kicker ? <p className="reel-kicker">{s.kicker}</p> : null}
                <h2 id={`reel-${s.id}`} className="reel-title">
                  {s.title}
                </h2>
                <p className="reel-text">{excerpt(s.blocks)}</p>
                <a href={`#${s.id}`} className="reel-read">
                  Read this part <span aria-hidden="true">↓</span>
                </a>
              </div>
              {m ? (
                <p className="reel-credit">
                  Picture: {m.alt}. {m.credit}
                </p>
              ) : null}
            </article>
          );
        })}

        <div className="reel-panel reel-next">
          {next ? (
            <Link href={`/journey/${next.slug}`} className="reel-next-link" data-theme={next.theme}>
              <span className="reel-next-label">Next chapter</span>
              <span className="reel-next-title">{next.title}</span>
              <span className="reel-next-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ) : (
            <Link href="/journey/" className="reel-next-link">
              <span className="reel-next-label">You reached the end</span>
              <span className="reel-next-title">See all chapters</span>
              <span className="reel-next-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          )}
        </div>
      </ReelTrack>

    </header>
  );
}
