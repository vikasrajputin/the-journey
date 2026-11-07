import { chapters as chapterIndex } from "@/data/navigation";
import { sources } from "@/data/sources";
import { timelineEvents } from "@/data/timeline";
import { allChapters } from "@/content/chapters";
import { exhibits } from "@/content/exhibits";
import { glossary } from "@/content/glossary";
import type { Block, Chapter } from "@/lib/content-schema";
import { termRefs } from "@/lib/rich-text";

export type ContentIssue = { where: string; problem: string };

const FORBIDDEN = [/lorem ipsum/i, /\bTODO\b/, /\bTBD\b/];

function blockStrings(block: Block): string[] {
  switch (block.type) {
    case "paragraph":
    case "lead":
    case "pullquote":
      return [block.text];
    case "callout":
      return [block.title, block.text];
    case "list":
      return block.items;
    case "keyFacts":
      return block.items.flatMap((i) => [i.value, i.label, i.note ?? ""]);
    case "exhibit":
      return [];
  }
}

/**
 * Cross-checks every reference in the content. Returns a list of problems;
 * an empty list means the content is consistent.
 */
export function validateContent(): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const sourceIds = new Set<string>();
  const glossaryIds = new Set(glossary.map((g) => g.id));
  const exhibitIds = new Set(exhibits.map((e) => e.id));
  const chapterIds = new Set(chapterIndex.map((c) => c.id));

  for (const s of sources) {
    if (sourceIds.has(s.id)) issues.push({ where: `source ${s.id}`, problem: "duplicate id" });
    sourceIds.add(s.id);
    if (!/^https:\/\//.test(s.url)) issues.push({ where: `source ${s.id}`, problem: "URL must use https" });
    if (!s.supports.trim()) issues.push({ where: `source ${s.id}`, problem: "missing 'supports' description" });
  }

  const checkSources = (where: string, ids: readonly string[] | undefined) => {
    for (const id of ids ?? []) if (!sourceIds.has(id)) issues.push({ where, problem: `unknown source "${id}"` });
  };
  const checkText = (where: string, text: string) => {
    for (const ref of termRefs(text)) if (!glossaryIds.has(ref)) issues.push({ where, problem: `unknown glossary term "${ref}"` });
    for (const re of FORBIDDEN) if (re.test(text)) issues.push({ where, problem: `placeholder text matched ${re}` });
  };
  const checkBlocks = (where: string, blocks: Block[]) => {
    blocks.forEach((b, i) => {
      const w = `${where} block ${i}`;
      checkSources(w, b.sourceIds);
      blockStrings(b).forEach((t) => checkText(w, t));
      if (b.type === "exhibit" && !exhibitIds.has(b.exhibitId)) issues.push({ where: w, problem: `unknown exhibit "${b.exhibitId}"` });
    });
  };

  // Glossary
  const seenTerms = new Set<string>();
  for (const g of glossary) {
    if (seenTerms.has(g.id)) issues.push({ where: `glossary ${g.id}`, problem: "duplicate id" });
    seenTerms.add(g.id);
    checkSources(`glossary ${g.id}`, g.sourceIds);
    for (const r of g.related ?? []) if (!glossaryIds.has(r)) issues.push({ where: `glossary ${g.id}`, problem: `unknown related term "${r}"` });
  }

  // Exhibits
  const seenExhibits = new Set<string>();
  for (const e of exhibits) {
    if (seenExhibits.has(e.id)) issues.push({ where: `exhibit ${e.id}`, problem: "duplicate id" });
    seenExhibits.add(e.id);
    checkSources(`exhibit ${e.id}`, e.sourceIds);
    if (e.textAlternative.length < 80) issues.push({ where: `exhibit ${e.id}`, problem: "text alternative is too short to stand in for the visual" });
  }

  // Chapters
  if (allChapters.length !== chapterIndex.length) issues.push({ where: "chapters", problem: "chapter files do not match the navigation index" });
  allChapters.forEach((c: Chapter, i) => {
    const where = `chapter ${c.slug}`;
    if (chapterIndex[i]?.slug !== c.slug) issues.push({ where, problem: "chapter order does not match navigation" });
    if (c.sections.length < 3) issues.push({ where, problem: "fewer than three narrative sections" });
    if (c.number !== 10 && c.evidence.length === 0) issues.push({ where, problem: "missing 'Evidence we have' items" });
    if (!c.sections.some((s) => s.blocks.some((b) => b.type === "exhibit"))) issues.push({ where, problem: "no visual exhibit" });
    [c.opening, c.intro, c.transition].forEach((t) => checkText(where, t));
    const sectionIds = new Set<string>();
    for (const s of c.sections) {
      if (sectionIds.has(s.id)) issues.push({ where: `${where} section ${s.id}`, problem: "duplicate section id" });
      sectionIds.add(s.id);
      checkBlocks(`${where} section ${s.id}`, s.blocks);
    }
    for (const d of c.goDeeper) checkBlocks(`${where} deep-dive ${d.id}`, d.blocks);
    for (const e of c.evidence) checkSources(`${where} evidence ${e.id}`, e.sourceIds);
  });

  // Timeline
  const seenEvents = new Set<string>();
  for (const t of timelineEvents) {
    const where = `timeline ${t.id}`;
    if (seenEvents.has(t.id)) issues.push({ where, problem: "duplicate id" });
    seenEvents.add(t.id);
    if (!chapterIds.has(t.chapterId)) issues.push({ where, problem: `unknown chapter "${t.chapterId}"` });
    if (t.yearsAgo < 0) issues.push({ where, problem: "yearsAgo must be positive" });
    if (t.range && !(t.range[0] >= t.yearsAgo && t.yearsAgo >= t.range[1])) issues.push({ where, problem: "range must be [older, younger] and contain yearsAgo" });
    if (t.sourceIds.length === 0) issues.push({ where, problem: "timeline events need at least one source" });
    checkSources(where, t.sourceIds);
  }

  return issues;
}

/** Throws with a readable report if content is invalid. Called at build time. */
export function assertContentValid(): void {
  const issues = validateContent();
  if (issues.length) {
    throw new Error(`Content validation failed:\n${issues.map((i) => `  - ${i.where}: ${i.problem}`).join("\n")}`);
  }
}

/** Every block that carries an editorial review note, for the review dashboard and docs. */
export function collectReviewNotes(): { chapter: string; where: string; note: string }[] {
  const out: { chapter: string; where: string; note: string }[] = [];
  for (const c of allChapters) {
    for (const s of c.sections) for (const b of s.blocks) if (b.review) out.push({ chapter: c.title, where: s.title, note: b.review });
    for (const d of c.goDeeper) for (const b of d.blocks) if (b.review) out.push({ chapter: c.title, where: d.title, note: b.review });
  }
  return out;
}
