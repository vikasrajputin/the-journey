import type { Chapter } from "@/lib/content-schema";
import { collectChapterRefs } from "@/lib/chapter-refs";
import { GlossaryPopovers } from "@/components/content/GlossaryTerm";
import { SourcePopovers } from "@/components/content/SourceCitation";
import { ChapterProgress } from "@/components/layout/ChapterProgress";
import { ChapterHeader } from "./ChapterHeader";
import { EraWarp } from "./EraWarp";
import { eras } from "@/lib/era-warp";

/** The full chapter: the flight into its era, then the whole chapter as one sideways reel. */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const { citations, terms } = collectChapterRefs(chapter);

  return (
    <>
      <ChapterProgress chapter={chapter} />
      {eras[chapter.slug] ? (
        <div data-theme={chapter.theme}>
          <EraWarp era={eras[chapter.slug]} question={chapter.centralQuestion} slug={chapter.slug} />
        </div>
      ) : null}
      <article data-theme={chapter.theme} aria-labelledby="chapter-title" data-chapter={chapter.slug}>
        <ChapterHeader chapter={chapter} />
        <GlossaryPopovers ids={terms} />
        <SourcePopovers citations={citations} />
      </article>
    </>
  );
}
