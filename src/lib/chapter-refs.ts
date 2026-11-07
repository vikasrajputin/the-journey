import type { Block, Chapter } from "@/lib/content-schema";
import { termRefs } from "@/lib/rich-text";
import { getExhibit } from "@/content/exhibits";
import type { Citation } from "@/components/content/SourceCitation";

export const blockAnchorId = (scope: string, index: number) => `${scope}-b${index}`;

function blockText(b: Block): string[] {
  switch (b.type) {
    case "paragraph":
    case "lead":
    case "pullquote":
      return [b.text];
    case "callout":
      return [b.title, b.text];
    case "list":
      return b.items;
    case "keyFacts":
      return b.items.flatMap((i) => [i.label, i.note ?? ""]);
    case "exhibit":
      return [];
  }
}

/** Collects every cited passage and glossary term in a chapter, so their panels can be rendered once. */
export function collectChapterRefs(chapter: Chapter): { citations: Citation[]; terms: string[] } {
  const citations: Citation[] = [];
  const terms: string[] = [];
  const walk = (scope: string, blocks: Block[]) =>
    blocks.forEach((b, i) => {
      const ids = b.type === "exhibit" ? [...(b.sourceIds ?? []), ...(getExhibit(b.exhibitId)?.sourceIds ?? [])] : b.sourceIds ?? [];
      if (ids.length) citations.push({ anchorId: blockAnchorId(scope, i), ids: Array.from(new Set(ids)) });
      blockText(b).forEach((t) => terms.push(...termRefs(t)));
    });
  chapter.sections.forEach((s) => walk(s.id, s.blocks));
  chapter.goDeeper.forEach((d) => walk(`deeper-${d.id}`, d.blocks));
  chapter.evidence.forEach((e) => {
    if (e.sourceIds.length) citations.push({ anchorId: `evidence-${e.id}`, ids: e.sourceIds });
  });
  return { citations, terms };
}

/** All unique source ids used in a chapter, in first-use order. */
export function chapterSourceIds(chapter: Chapter): string[] {
  const { citations } = collectChapterRefs(chapter);
  return Array.from(new Set(citations.flatMap((c) => c.ids)));
}
