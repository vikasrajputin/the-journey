import { describe, expect, it } from "vitest";
import { assignLanes, bandCompression, bands, getZoom, position, formatYears } from "@/lib/timeline-scale";
import { timelineEvents } from "@/data/timeline";

describe("timeline scale", () => {
  it("maps the segmented scale from 0 (Big Bang) to 1 (present)", () => {
    const all = getZoom("all");
    expect(position(13.8e9, all)).toBe(0);
    expect(position(0, all)).toBe(1);
    expect(position(4.6e9, all)).toBeCloseTo(0.2);
    expect(position(12_000, all)).toBeCloseTo(0.8);
  });

  it("keeps events in chronological order on every view", () => {
    for (const id of ["all", "cosmic", "geological", "evolutionary", "human"]) {
      const z = getZoom(id);
      const ps = [...timelineEvents]
        .sort((a, b) => b.yearsAgo - a.yearsAgo)
        .map((e) => position(e.yearsAgo, z))
        .filter((p): p is number => p !== null);
      expect(ps).toEqual([...ps].sort((a, b) => a - b));
    }
  });

  it("hides events outside a true-scale view", () => {
    expect(position(66e6, getZoom("human"))).toBeNull();
    expect(position(5_000, getZoom("human"))).toBeCloseTo(7 / 12);
  });

  it("states compression honestly", () => {
    expect(bandCompression(bands[0]).factor).toBeCloseTo(0.3, 2);
    expect(bandCompression(bands[4]).text).toMatch(/230,000 times wider/);
  });

  it("formats years", () => {
    expect(formatYears(13.8e9)).toBe("13.8 billion years");
    expect(formatYears(539e6)).toBe("539 million years");
    expect(formatYears(12_000)).toBe("12,000 years");
  });

  it("stacks close markers into lanes", () => {
    expect(assignLanes([0, 0, 0.01, 0.5], 0.02)).toEqual([0, 1, 2, 0]);
  });
});
