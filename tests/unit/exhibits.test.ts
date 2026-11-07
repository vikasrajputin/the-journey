import { describe, expect, it } from "vitest";
import { rulers, secondsBeforeBirthday } from "@/components/exhibits/visuals/LifetimeScale";
import { geologicPeriods } from "@/data/geologic-periods";
import { getExhibit } from "@/content/exhibits";

describe("lifetime scale exhibit", () => {
  it("matches the figures in its text alternative", () => {
    const text = getExhibit("lifetime-scale")!.textAlternative;
    const labels = rulers.flatMap((r) => r.marks.map((m) => m.at));
    expect(labels).toContain("age 53 years 8 months");
    expect(labels).toContain("age 59 years 8 months");
    expect(text).toMatch(/53 years and 8 months/);
    expect(secondsBeforeBirthday(66e6) / (365.25 * 24 * 3600 / 12)).toBeCloseTo(4.6, 1);
    expect(Math.round(secondsBeforeBirthday(300_000) / 3600)).toBe(15);
    expect(Math.round(secondsBeforeBirthday(5_100) / 60)).toBe(16);
    expect(Math.round(secondsBeforeBirthday(80))).toBe(15);
  });
});

describe("geological periods", () => {
  it("are contiguous and match the text alternative", () => {
    const text = getExhibit("geologic-period-strip")!.textAlternative;
    geologicPeriods.forEach((p, i) => {
      if (i) expect(p.start).toBe(geologicPeriods[i - 1].end);
      expect(text).toContain(p.name);
      expect(text).toContain(String(p.start));
    });
  });
});
