import { describe, expect, it } from "vitest";
import { chapters, getAdjacentChapters, getChapterSummary } from "@/data/navigation";
import { isActivePath } from "@/components/layout/NavLink";

describe("chapter index", () => {
  it("has ten chapters numbered 1 to 10 in order", () => {
    expect(chapters.map((c) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("uses unique, URL-safe slugs and ids", () => {
    const slugs = chapters.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(chapters.map((c) => c.id)).size).toBe(chapters.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("matches the route list in the specification", () => {
    expect(chapters.map((c) => c.slug)).toEqual([
      "before-everything",
      "planet-earth",
      "first-life",
      "diversification",
      "age-of-giants",
      "human-story",
      "civilisation",
      "age-of-ideas",
      "world-we-built",
      "you",
    ]);
  });

  it("finds adjacent chapters", () => {
    expect(getAdjacentChapters("before-everything").previous).toBeUndefined();
    expect(getAdjacentChapters("before-everything").next?.slug).toBe("planet-earth");
    expect(getAdjacentChapters("you").next).toBeUndefined();
    expect(getChapterSummary("nope")).toBeUndefined();
  });
});

describe("isActivePath", () => {
  it("matches exact and nested paths but not prefixes of other words", () => {
    expect(isActivePath("/journey", "/journey")).toBe(true);
    expect(isActivePath("/journey/you", "/journey")).toBe(true);
    expect(isActivePath("/journeys", "/journey")).toBe(false);
    expect(isActivePath("/timeline", "/")).toBe(false);
    expect(isActivePath("/", "/")).toBe(true);
  });
});
