import type { Block } from "@/lib/content-schema";
import { allChapters } from "@/content/chapters";
import { glossary, getGlossaryEntry } from "@/content/glossary";
import { getExhibit } from "@/content/exhibits";
import { methods } from "@/content/methods";
import { timelineEvents } from "@/data/timeline";
import { getChapterSummary } from "@/data/navigation";
import { toPlainText } from "@/lib/rich-text";

export type SearchRecord = {
  kind: "Chapter" | "Section" | "Glossary" | "Timeline" | "Method" | "Exhibit";
  title: string;
  /** Where the result lives, e.g. "Chapter 3: The Spark of Life". */
  context: string;
  href: string;
  text: string;
};

const term = (id: string) => getGlossaryEntry(id)?.term;
const plain = (s: string) => toPlainText(s, term).replace(/\*/g, "");

function blockText(b: Block): string {
  switch (b.type) {
    case "paragraph":
    case "lead":
    case "pullquote":
      return plain(b.text);
    case "callout":
      return `${b.title}. ${plain(b.text)}`;
    case "keyFacts":
      return b.items.map((i) => `${i.value} ${i.label}${i.note ? ` ${i.note}` : ""}`).join(". ");
    case "list":
      return b.items.map(plain).join(". ");
    case "exhibit": {
      const e = getExhibit(b.exhibitId);
      return e ? `${e.title}. ${e.textAlternative}` : "";
    }
  }
}

/** Every searchable passage on the site, built at build time. */
export function buildSearchIndex(): SearchRecord[] {
  const records: SearchRecord[] = [];
  for (const c of allChapters) {
    const ctx = `Chapter ${c.number}: ${c.title}`;
    records.push({ kind: "Chapter", title: c.title, context: `Chapter ${c.number} · ${c.timeLabel}`, href: `/journey/${c.slug}`, text: `${c.subtitle}. ${c.centralQuestion} ${plain(c.intro)}` });
    for (const s of c.sections) {
      records.push({ kind: "Section", title: s.title, context: ctx, href: `/journey/${c.slug}#${s.id}`, text: s.blocks.map(blockText).join(" ") });
    }
    for (const e of c.evidence) {
      records.push({ kind: "Section", title: e.title, context: `${ctx} · Evidence`, href: `/journey/${c.slug}#evidence-${e.id}`, text: `${e.what} ${e.helpsUs} ${e.limitations}` });
    }
    for (const d of c.goDeeper) {
      records.push({ kind: "Section", title: d.title, context: `${ctx} · Go deeper`, href: `/journey/${c.slug}#deeper-${d.id}`, text: d.blocks.map(blockText).join(" ") });
    }
  }
  for (const g of glossary) {
    records.push({ kind: "Glossary", title: g.term, context: "Glossary", href: `/glossary#${g.id}`, text: plain(g.definition) });
  }
  for (const e of timelineEvents) {
    const c = getChapterSummary(e.chapterId);
    records.push({ kind: "Timeline", title: e.title, context: `Timeline · ${e.dateLabel}`, href: `/timeline#event-${e.id}`, text: `${e.summary}${c ? ` ${c.title}` : ""}` });
  }
  for (const m of methods) {
    records.push({ kind: "Method", title: m.title, context: "How do we know?", href: `/evidence#${m.id}`, text: `${m.question} ${m.how} ${m.tells} ${m.limits}` });
  }
  return records;
}
