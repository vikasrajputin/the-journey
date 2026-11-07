import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";

/**
 * Base maps rendered at build time from Natural Earth land outlines (public
 * domain, via the world-atlas package). No map tiles, no network requests.
 */
export const MAP_W = 960;
export const MAP_H = 470;

const topo = land110 as unknown as Topology<{ land: GeometryCollection }>;
const land = feature(topo, topo.objects.land);

/** A world map centred on the given longitude. */
export function makeMap(centreLon = 0) {
  const projection = geoNaturalEarth1().rotate([-centreLon, 0]).fitExtent([[4, 4], [MAP_W - 4, MAP_H - 4]], { type: "Sphere" });
  const path = geoPath(projection);
  const landPath = path(land) ?? "";
  const spherePath = path({ type: "Sphere" }) ?? "";
  const project = (lon: number, lat: number): [number, number] => {
    const p = projection([lon, lat]);
    return p ? [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10] : [0, 0];
  };
  function Base() {
    return (
      <>
        <path d={spherePath} fill="color-mix(in srgb, var(--color-panel-raised) 60%, transparent)" />
        <path d={landPath} fill="var(--color-panel-raised)" stroke="var(--color-border-dark)" strokeWidth={0.6} />
      </>
    );
  }
  return { project, Base };
}
