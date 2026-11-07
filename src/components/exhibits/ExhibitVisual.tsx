import { GeologicPeriodStrip } from "./visuals/GeologicPeriodStrip";
import { LifetimeScale } from "./visuals/LifetimeScale";
import { EarthCutaway } from "./visuals/EarthCutaway";
import { IndependentOrigins } from "./visuals/IndependentOrigins";
import { DispersalMap } from "./visuals/DispersalMap";
import { KpgBoundary } from "./visuals/KpgBoundary";
import { TreeNotLadder } from "./visuals/TreeNotLadder";

/**
 * Maps exhibit ids to their visual components. Exhibits without a visual yet
 * fall back to their text alternative inside ExhibitShell, which is a complete,
 * readable version of the exhibit. Every visual is drawn from the facts in its
 * text alternative, never the other way round.
 */
const visuals: Record<string, React.ComponentType> = {
  "geologic-period-strip": GeologicPeriodStrip,
  "lifetime-scale": LifetimeScale,
  "earth-cutaway": EarthCutaway,
  "independent-origins": IndependentOrigins,
  "dispersal-map": DispersalMap,
  "kpg-boundary": KpgBoundary,
  "tree-not-ladder": TreeNotLadder,
};

export function hasExhibitVisual(id: string): boolean {
  return id in visuals;
}

export function ExhibitVisual({ id }: { id: string }) {
  const Visual = visuals[id];
  return Visual ? <Visual /> : null;
}
