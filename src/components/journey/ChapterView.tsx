import Link from "next/link";
import type { Chapter } from "@/lib/content-schema";
import { getAdjacentChapters } from "@/data/navigation";
import { getSource } from "@/data/sources";
import { blockAnchorId, chapterSourceIds, collectChapterRefs } from "@/lib/chapter-refs";
import { GlossaryPopovers } from "@/components/content/GlossaryTerm";
import { SourceLine, SourcePopovers } from "@/components/content/SourceCitation";
import { EvidenceCard } from "@/components/exhibits/EvidenceCard";
import { ChapterHeader } from "./ChapterHeader";
import { NarrativeBlock } from "./NarrativeBlock";
import { ChapterTransition } from "./ChapterTransition";
import { SectionNav } from "./SectionNav";

/** The full chapter: header, narrative, evidence, deeper reading, sources and transition. */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const { previous, next } = getAdjacentChapters(chapter.slug);
  const { citations, terms } = collectChapterRefs(chapter);
  const sourceList = chapterSourceIds(chapter).map(getSource).filter((s) => s !== undefined);

  const toc = [
    ...chapter.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(chapter.evidence.length ? [{ id: "evidence", title: "Evidence we have" }] : []),
    ...(chapter.goDeeper.length ? [{ id: "go-deeper", title: "Go deeper" }] : []),
    ...(sourceList.length ? [{ id: "chapter-sources", title: "Sources" }] : []),
  ];

  return (
    <article data-theme={chapter.theme} aria-labelledby="chapter-title" data-chapter={chapter.slug}>
      <ChapterHeader chapter={chapter} />

      <div className="container-wide relative lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16 xl:grid-cols-[14rem_minmax(0,1fr)_14rem]">
        <div className="hidden xl:block" aria-hidden="true" />
        <div className="min-w-0">
          <div className="mx-auto max-w-[var(--width-reading)] pt-14 md:pt-20">
            <p className="text-[length:var(--text-lead)] leading-relaxed text-text-light/90" data-reveal>
              {chapter.intro}
            </p>
            {chapter.evidence.length ? (
              <p className="mt-6 text-sm">
                <a href="#evidence" className="link-quiet text-chapter">
                  Skip to the evidence for this chapter
                </a>
              </p>
            ) : null}
          </div>

          {chapter.sections.map((section, si) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="chapter-section">
              <div className="mx-auto max-w-[var(--width-reading)]">
                <div className="flex items-baseline gap-4" data-reveal>
                  <span aria-hidden="true" className="font-display text-sm tabular-nums text-chapter">
                    {String(si + 1).padStart(2, "0")}
                  </span>
                  <div>
                    {section.kicker ? <p className="eyebrow text-muted">{section.kicker}</p> : null}
                    <h2 id={`${section.id}-title`} className="mt-1 font-display text-[length:var(--text-h2)] text-text-light">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="prose-journey mt-8">
                  {section.blocks.map((block, bi) => (
                    <NarrativeBlock key={bi} block={block} anchorId={blockAnchorId(section.id, bi)} />
                  ))}
                </div>
              </div>
            </section>
          ))}

          {chapter.evidence.length ? (
            <section id="evidence" aria-labelledby="evidence-title" className="chapter-section">
              <div className="mx-auto max-w-[var(--width-reading)]" data-reveal>
                <p className="eyebrow text-chapter">How do we know?</p>
                <h2 id="evidence-title" className="mt-2 font-display text-[length:var(--text-h2)]">
                  Evidence we have
                </h2>
                <p className="mt-4 text-muted">
                  The main kinds of evidence behind this chapter, what each can and cannot tell us, and how confident
                  researchers are. <Link href="/evidence#reading-evidence" className="link-quiet text-text-light">How to read these labels</Link>.
                </p>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {chapter.evidence.map((item) => (
                  <EvidenceCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {chapter.goDeeper.length ? (
            <section id="go-deeper" aria-labelledby="go-deeper-title" className="chapter-section">
              <div className="mx-auto max-w-[var(--width-reading)]">
                <p className="eyebrow text-chapter">Optional</p>
                <h2 id="go-deeper-title" className="mt-2 font-display text-[length:var(--text-h2)]">
                  Go deeper
                </h2>
                <div className="mt-8 grid gap-3">
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
            <section id="chapter-sources" aria-labelledby="chapter-sources-title" className="chapter-section">
              <div className="mx-auto max-w-[var(--width-reading)]">
                <h2 id="chapter-sources-title" className="font-display text-[length:var(--text-h3)]">
                  Sources for this chapter
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Every source was found on its publisher&rsquo;s own site. See the{" "}
                  <Link href="/sources" className="link-quiet text-text-light">full source directory</Link> for how
                  sources are checked.
                </p>
                <ol className="mt-6 grid gap-5 text-sm">
                  {sourceList.map((s) => (
                    <li key={s.id} id={`src-${s.id}`}>
                      <SourceLine source={s} />
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ) : null}
        </div>

        <SectionNav items={toc} />
      </div>

      <ChapterTransition text={chapter.transition} previous={previous} next={next} />

      <GlossaryPopovers ids={terms} />
      <SourcePopovers citations={citations} />
    </article>
  );
}
