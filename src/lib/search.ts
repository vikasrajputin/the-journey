import type { SearchRecord } from "@/lib/search-index";

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export type SearchHit = { record: SearchRecord; score: number; snippet: { before: string; match: string; after: string } };

/** Every query word must appear in the title or text. Title matches rank higher. */
export function search(records: SearchRecord[], query: string, limit = 40): SearchHit[] {
  const terms = fold(query).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  for (const record of records) {
    const title = fold(record.title);
    const text = fold(record.text);
    if (!terms.every((t) => title.includes(t) || text.includes(t))) continue;
    let score = 0;
    for (const t of terms) {
      if (title.includes(t)) score += title.startsWith(t) ? 12 : 8;
      score += Math.min(5, text.split(t).length - 1);
    }
    if (record.kind === "Chapter") score += 2;
    hits.push({ record, score, snippet: makeSnippet(record.text, text, terms) });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

function makeSnippet(original: string, folded: string, terms: string[]) {
  const at = terms.map((t) => folded.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (at === undefined) return { before: original.slice(0, 160), match: "", after: original.length > 160 ? "…" : "" };
  const term = terms.find((t) => folded.indexOf(t) === at)!;
  const start = Math.max(0, at - 70);
  const end = Math.min(original.length, at + term.length + 90);
  return {
    before: (start > 0 ? "…" : "") + original.slice(start, at),
    match: original.slice(at, at + term.length),
    after: original.slice(at + term.length, end) + (end < original.length ? "…" : ""),
  };
}
