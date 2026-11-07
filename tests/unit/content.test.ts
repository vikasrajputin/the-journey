import { describe, expect, it } from "vitest";
import { collectReviewNotes, validateContent } from "@/lib/content-validate";
import { allChapters } from "@/content/chapters";
import { parseInline, toPlainText } from "@/lib/rich-text";
import { yearToYearsAgo } from "@/data/timeline";
import { sources } from "@/data/sources";

describe("content", () => {
  it("passes validation with no broken references", () => {
    expect(validateContent()).toEqual([]);
  });

  it("has ten chapters, each with a cinematic opening, orientation, narrative and transition", () => {
    expect(allChapters).toHaveLength(10);
    for (const c of allChapters) {
      expect(c.opening.length).toBeGreaterThan(20);
      expect(c.orientation.when).toBeTruthy();
      expect(c.sections.length).toBeGreaterThanOrEqual(3);
      expect(c.transition).toBeTruthy();
    }
  });

  it("never claims sources were checked unless marked so", () => {
    for (const s of sources) expect(["located", "checked"]).toContain(s.verification);
  });

  it("lists editorial review notes", () => {
    const notes = collectReviewNotes();
    expect(notes.length).toBeGreaterThan(0);
    for (const n of notes) expect(n.note.length).toBeGreaterThan(10);
  });
});

describe("rich text", () => {
  it("parses glossary terms and emphasis", () => {
    expect(parseInline("The [[redshift]] of *Tiktaalik* and [[cmb|old light]].")).toEqual([
      { kind: "text", text: "The " },
      { kind: "term", id: "redshift", text: undefined },
      { kind: "text", text: " of " },
      { kind: "em", text: "Tiktaalik" },
      { kind: "text", text: " and " },
      { kind: "term", id: "cmb", text: "old light" },
      { kind: "text", text: "." },
    ]);
  });

  it("renders plain text", () => {
    expect(toPlainText("See [[cmb|the CMB]] and [[redshift]].", () => "redshift")).toBe("See the CMB and redshift.");
  });
});

describe("time convention", () => {
  it("converts calendar years to years before 2000 CE without a year zero", () => {
    expect(yearToYearsAgo(2000)).toBe(0);
    expect(yearToYearsAgo(1)).toBe(1999);
    expect(yearToYearsAgo(-1)).toBe(2000);
    expect(yearToYearsAgo(-3200)).toBe(5199);
  });
});

import { methods } from "@/content/methods";
import { getSource as getSrc } from "@/data/sources";
import { getChapterSummary as getSummary } from "@/data/navigation";

describe("evidence methods", () => {
  it("cite real sources and real chapters", () => {
    for (const m of methods) {
      expect(m.sourceIds.length).toBeGreaterThan(0);
      for (const id of m.sourceIds) expect(getSrc(id), `${m.id} → ${id}`).toBeDefined();
      for (const slug of m.chapters) expect(getSummary(slug), `${m.id} → ${slug}`).toBeDefined();
    }
  });
});
