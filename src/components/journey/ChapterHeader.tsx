import Link from "next/link";
import type { Block, Chapter } from "@/lib/content-schema";
import { SplitWords } from "@/components/motion/SplitWords";
import { chapters, getAdjacentChapters } from "@/data/navigation";
import { scenes } from "@/components/experience/scene-data";
import { getSource } from "@/data/sources";
import { blockAnchorId, chapterSourceIds } from "@/lib/chapter-refs";
import { media, type ResolvedMedia } from "@/lib/media";
import { heroMedia } from "@/lib/chapter-media";
import { SourceLine } from "@/components/content/SourceCitation";
import { EvidenceCard } from "@/components/exhibits/EvidenceCard";
import { ChapterBackdrop } from "./ChapterBackdrop";
import { ExpandLanding } from "./ExpandLanding";
import { NarrativeBlock } from "./NarrativeBlock";
import { ReelTrack } from "./ReelTrack";

function Pic({ m, className = "" }: { m: ResolvedMedia; className?: string }) {
  return m.kind === "video" ? (
    <video className={className} autoPlay muted loop playsInline preload="metadata" poster={m.src}>
      {m.sources?.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  ) : (
    <div className={className} style={{ backgroundImage: `url("${m.src}")` }} />
  );
}

/** Roughly how much room a block takes, in words, so short blocks can share a column. */
function weight(b: Block): number {
  const words = (s: string) => s.split(/\s+/).length;
  switch (b.type) {
    case "lead":
      return words(b.text) * 1.6 + 10;
    case "paragraph":
      return words(b.text) + 6;
    case "pullquote":
      return words(b.text) * 1.8 + 10;
    case "callout":
      return words(b.text) + 30;
    case "keyFacts":
      return b.items.length * 30;
    case "list":
      return b.items.join(" ").split(/\s+/).length + b.items.length * 4;
    case "exhibit":
      return Infinity;
  }
}

type Column = { kind: "text"; blocks: { b: Block; i: number }[] } | { kind: "exhibit"; b: Block; i: number };

/** Packs a part's blocks into reading columns; exhibits get a wide panel of their own. */
function columns(blocks: Block[], budget = 100): Column[] {
  const out: Column[] = [];
  let cur: { b: Block; i: number }[] = [];
  let used = 0;
  const flush = () => {
    if (cur.length) out.push({ kind: "text", blocks: cur });
    cur = [];
    used = 0;
  };
  blocks.forEach((b, i) => {
    if (b.type === "exhibit") {
      flush();
      out.push({ kind: "exhibit", b, i });
      return;
    }
    const w = weight(b);
    if (cur.length && used + w > budget) flush();
    cur.push({ b, i });
    used += w;
  });
  flush();
  return out;
}

/**
 * The whole chapter as one reel that slides from right to left as you scroll
 * down: the title, the main picture, a "before you start" card, every part of
 * the story in reading columns with its diagrams, the evidence, deeper
 * reading, the sources, and the way on to the next chapter. Without
 * JavaScript, or with reduced motion, it is a row you can swipe sideways.
 */
export function ChapterHeader({ chapter }: { chapter: Chapter }) {
  const hero = media[heroMedia[chapter.slug]?.media ?? ""];
  const more = (scenes.find((s) => s.chapter === chapter.slug)?.media ?? [])
    .filter((id) => id !== heroMedia[chapter.slug]?.media)
    .map((id) => media[id])
    .filter((m): m is ResolvedMedia => !!m && m.kind !== "audio");
  const { previous, next } = getAdjacentChapters(chapter.slug);
  const sourceList = chapterSourceIds(chapter).map(getSource).filter((s) => s !== undefined);

  return (
    <div id="chapter-start" className="reel">
      <ExpandLanding />
      <ReelTrack>
        <header className="reel-panel reel-intro">
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
            Scroll down to travel <span>→</span>
          </p>
        </header>

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

        {chapter.sections.map((s, si) => {
          const m = more[si];
          return (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="reel-part">
              <div className={`reel-panel reel-card reel-opener${m ? "" : " reel-plain"}`} data-reveal>
                {m ? (
                  <div className="reel-media" aria-hidden="true">
                    <Pic m={m} />
                  </div>
                ) : (
                  <span className="reel-bignum" aria-hidden="true">
                    {String(si + 1).padStart(2, "0")}
                  </span>
                )}
                <div className="reel-over">
                  <span className="reel-num">Part {si + 1}</span>
                  {s.kicker ? <p className="reel-kicker">{s.kicker}</p> : null}
                  <h2 id={`${s.id}-title`} className="reel-title">
                    {s.title}
                  </h2>
                </div>
                {m ? (
                  <p className="reel-credit">
                    Picture: {m.alt}. {m.credit}
                  </p>
                ) : null}
              </div>
              {columns(s.blocks).map((col, ci) =>
                col.kind === "exhibit" ? (
                  <div key={ci} className="reel-panel reel-wide">
                    <NarrativeBlock block={col.b} anchorId={blockAnchorId(s.id, col.i)} />
                  </div>
                ) : (
                  <div key={ci} className="reel-panel reel-col prose-journey">
                    {col.blocks.map(({ b, i }) => (
                      <NarrativeBlock key={i} block={b} anchorId={blockAnchorId(s.id, i)} />
                    ))}
                  </div>
                ),
              )}
            </section>
          );
        })}

        {chapter.evidence.length ? (
          <section id="evidence" aria-labelledby="evidence-title" className="reel-part">
            <div className="reel-panel reel-col reel-head" data-reveal>
              <p className="eyebrow text-chapter">How do we know?</p>
              <h2 id="evidence-title" className="reel-title">
                Evidence we have
              </h2>
              <p className="text-text-light/85">
                The main kinds of evidence behind this chapter, what each can and cannot tell us, and how confident researchers
                are. <Link href="/evidence#reading-evidence" className="link-quiet text-text-light">How to read these labels</Link>.
              </p>
            </div>
            {chapter.evidence.map((item) => (
              <div key={item.id} className="reel-panel reel-col reel-scrolly">
                <EvidenceCard item={item} />
              </div>
            ))}
          </section>
        ) : null}

        {chapter.goDeeper.length ? (
          <section id="go-deeper" aria-labelledby="go-deeper-title" className="reel-part">
            <div className="reel-panel reel-wide reel-scrolly">
              <p className="eyebrow text-chapter">Optional</p>
              <h2 id="go-deeper-title" className="reel-title">
                Go deeper
              </h2>
              <div className="mt-6 grid gap-3">
                {chapter.goDeeper.map((d) => (
                  <details key={d.id} id={`deeper-${d.id}`} className="deep-dive">
                    <summary>
                      <span className="font-display text-xl text-text-light">{d.title}</span>
                    </summary>
                    <div className="prose-journey mt-4">
                      {d.blocks.map((block, bi) => (
                        <NarrativeBlock key={bi} block={block} anchorId={blockAnchorId(`deeper-${d.id}`, bi)} />
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {sourceList.length ? (
          <section id="chapter-sources" aria-labelledby="chapter-sources-title" className="reel-part">
            <div className="reel-panel reel-wide reel-scrolly">
              <h2 id="chapter-sources-title" className="reel-title">
                Sources for this chapter
              </h2>
              <p className="mt-2 text-sm text-muted">
                Every source was found on its publisher&rsquo;s own site. See the{" "}
                <Link href="/sources" className="link-quiet text-text-light">
                  full source directory
                </Link>{" "}
                for how sources are checked.
              </p>
              <ol className="mt-6 grid gap-5 text-sm">
                {sourceList.map((src) => (
                  <li key={src.id} id={`src-${src.id}`}>
                    <SourceLine source={src} />
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        <section aria-label="Continue the journey" className="reel-part">
          <div className="reel-panel reel-col reel-bridge" data-reveal>
            <p className="reel-quote">{chapter.transition}</p>
          </div>
          <nav aria-label="Chapters" className="reel-panel reel-next">
            {next ? (
              <Link href={`/journey/${next.slug}`} rel="next" className="reel-next-link" data-theme={next.theme}>
                <span className="reel-next-label">Next · Chapter {next.number} →</span>
                <span className="reel-next-title">{next.title}</span>
                <span className="reel-next-q">{next.centralQuestion}</span>
              </Link>
            ) : (
              <Link href="/timeline" className="reel-next-link">
                <span className="reel-next-label">Keep exploring →</span>
                <span className="reel-next-title">See the whole story on one timeline</span>
              </Link>
            )}
            {previous ? (
              <Link href={`/journey/${previous.slug}`} rel="prev" className="reel-prev-link">
                ← Chapter {previous.number}: {previous.title}
              </Link>
            ) : (
              <Link href="/journey" className="reel-prev-link">
                ← All chapters
              </Link>
            )}
          </nav>
        </section>
      </ReelTrack>
    </div>
  );
}
