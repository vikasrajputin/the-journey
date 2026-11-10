import { describe, expect, it } from "vitest";
import { levels } from "@/components/game/levels";
import { getSource, sources } from "@/data/sources";

describe("Chapter 1 game levels", () => {
  it("has seven levels in order with unique ids", () => {
    expect(levels.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(levels.map((l) => l.id)).size).toBe(levels.length);
  });

  it("backs every level with at least one known source", () => {
    for (const l of levels) {
      expect(l.sourceIds.length, l.id).toBeGreaterThan(0);
      for (const id of l.sourceIds) expect(getSource(id), `${l.id} -> ${id}`).toBeDefined();
    }
  });

  it("keeps every source in the registry in use", () => {
    const used = new Set(levels.flatMap((l) => l.sourceIds));
    const unused = sources.filter((s) => !used.has(s.id)).map((s) => s.id);
    expect(unused).toEqual([]);
  });

  it("gives every quiz three different answers and a valid correct one", () => {
    for (const l of levels) {
      expect(new Set(l.quiz.answers).size, l.id).toBe(3);
      expect(l.quiz.answers[l.quiz.correct]).toBeTruthy();
    }
  });

  it("keeps on-screen text short and simple", () => {
    for (const l of levels) {
      expect(l.goalShort.length, l.id).toBeLessThanOrEqual(34);
      expect(l.fact.split(/\s+/).length, l.id).toBeLessThanOrEqual(30);
      for (const p of l.details) expect(p.split(/\s+/).length, `${l.id}: ${p}`).toBeLessThanOrEqual(50);
    }
  });
});
