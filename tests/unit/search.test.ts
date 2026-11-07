import { describe, expect, it } from "vitest";
import { buildSearchIndex } from "@/lib/search-index";
import { search } from "@/lib/search";

const index = buildSearchIndex();

describe("site search", () => {
  it("indexes chapters, sections, glossary, timeline and methods", () => {
    const kinds = new Set(index.map((r) => r.kind));
    for (const k of ["Chapter", "Section", "Glossary", "Timeline", "Method"]) expect(kinds.has(k as never)).toBe(true);
    expect(index.every((r) => r.href.startsWith("/") && r.text.length > 0)).toBe(true);
  });

  it("finds by title first and ignores accents and case", () => {
    const hits = search(index, "RADIOCARBON");
    expect(hits[0].record.title.toLowerCase()).toContain("radiocarbon");
    expect(search(index, "gobekli").some((h) => h.record.title.includes("Göbekli"))).toBe(true);
  });

  it("requires every word and highlights a match", () => {
    const hits = search(index, "oxygen microbes");
    expect(hits.length).toBeGreaterThan(0);
    expect(search(index, "oxygen zzzzqx")).toEqual([]);
    expect(hits[0].snippet.match.length).toBeGreaterThan(0);
  });
});
