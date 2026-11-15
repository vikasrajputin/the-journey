import { describe, expect, it } from "vitest";
import { activeMoment, arrival, dwell, makeRoute, phaseOf } from "@/components/game/world/route";

describe("journey route", () => {
  const route = makeRoute(7);

  it("reaches the moments in time order", () => {
    for (let i = 1; i < 7; i++) expect(route.at[i]).toBeGreaterThan(route.at[i - 1] + 20);
    expect(route.at[6]).toBeLessThan(route.length);
  });

  it("plays a moment from 0 to 1 as the camera arrives", () => {
    expect(phaseOf(route, 2, 0)).toBe(0);
    expect(phaseOf(route, 2, route.at[2] - 16)).toBeGreaterThan(0.3);
    expect(phaseOf(route, 2, route.at[2])).toBe(1);
  });

  it("knows which moment is playing", () => {
    expect(activeMoment(route, 0)).toBe(-1);
    expect(activeMoment(route, route.at[3] - 5)).toBe(3);
    expect(activeMoment(route, arrival(route, 4) + 1)).toBe(4);
  });

  it("slows down during a moment and speeds up between them", () => {
    expect(dwell(route, route.at[1] - 10)).toBeLessThan(0.5);
    expect(dwell(route, route.at[1] + 8)).toBe(1);
  });
});
