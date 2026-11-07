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

import { scenes } from "@/components/experience/scene-data";
import { getSource } from "@/data/sources";

describe("immersive journey", () => {
  it("backs every caption with at least one registered source and labels what is shown", () => {
    for (const scene of scenes) {
      for (const beat of scene.beats) {
        expect(beat.sources.length, beat.text).toBeGreaterThan(0);
        for (const id of beat.sources) expect(getSource(id), `${scene.id}: ${id}`).toBeDefined();
        expect(beat.see).toMatch(/^(Real|Simulation|Reconstructed)/);
      }
    }
  });

  it("labels every real sound, registers its sources, and credits it in the scene", () => {
    for (const scene of scenes) {
      if (!scene.sound) continue;
      expect(scene.sound.label).toMatch(/^Real (recording|data as sound)/);
      expect(scene.media).toContain(scene.sound.media);
      for (const id of scene.sound.sources) expect(getSource(id), `${scene.id}: ${id}`).toBeDefined();
    }
  });

  it("points 3D specimens at the Smithsonian only", () => {
    for (const scene of scenes) {
      for (const a of scene.artefacts ?? []) {
        expect(a.page).toMatch(/^https:\/\/3d\.si\.edu\/object\/3d\//);
        expect(a.embed).toMatch(/^https:\/\/3d-api\.si\.edu\/voyager\/3d_package:/);
      }
    }
  });
});
