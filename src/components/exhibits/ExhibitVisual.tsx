/**
 * Maps exhibit ids to their visual components. Exhibits without a visual yet
 * fall back to their text alternative inside ExhibitShell, which is a complete,
 * readable version of the exhibit.
 */
const visuals: Record<string, React.ComponentType> = {};

export function hasExhibitVisual(id: string): boolean {
  return id in visuals;
}

export function ExhibitVisual({ id }: { id: string }) {
  const Visual = visuals[id];
  return Visual ? <Visual /> : null;
}
