import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { ENTER_RADIUS, NEAR_RADIUS, makeRoad, nearestPortal, outsideRoad, portalPosition, viewpoint } from "@/components/game/world/path";

describe("universe map road", () => {
  it("puts the portals in time order, further away each level", () => {
    for (let i = 1; i < 7; i++) expect(portalPosition(i).z).toBeLessThan(portalPosition(i - 1).z);
  });

  it("starts each viewpoint near its portal but outside it", () => {
    for (let i = 0; i < 7; i++) {
      const d = viewpoint(i).distanceTo(portalPosition(i));
      expect(d).toBeGreaterThan(ENTER_RADIUS * 2);
      expect(d).toBeLessThan(NEAR_RADIUS);
      expect(nearestPortal(viewpoint(i), 7).index).toBe(i);
    }
  });

  it("passes through every portal", () => {
    const road = makeRoad(7);
    const push = new THREE.Vector3();
    for (let i = 0; i < 7; i++) expect(outsideRoad(portalPosition(i), road, push)).toBe(0);
  });

  it("pushes a player who drifted far away back towards the road", () => {
    const road = makeRoad(7);
    const push = new THREE.Vector3();
    const far = new THREE.Vector3(60, 0, -30);
    expect(outsideRoad(far, road, push)).toBeGreaterThan(0);
    expect(push.x).toBeLessThan(0);
  });
});
