import type { TimelineCategory } from "@/lib/content-schema";

/**
 * Scales for the timeline. All values are years before present (present = 2000 CE).
 *
 * The "all of time" view is segmented: five bands share the width equally and
 * each band is linear inside. That compresses the oldest stretch and stretches
 * the youngest, so every band also reports how much it has been resized
 * compared with a true, straight-line scale.
 */

export const AGE_OF_UNIVERSE = 13.8e9;

export type Band = { id: string; label: string; older: number; younger: number };

export const bands: readonly Band[] = [
  { id: "cosmic", label: "Cosmic time", older: AGE_OF_UNIVERSE, younger: 4.6e9 },
  { id: "early-earth", label: "Early Earth and microbial life", older: 4.6e9, younger: 539e6 },
  { id: "complex-life", label: "Complex life", older: 539e6, younger: 7e6 },
  { id: "human-evolution", label: "Human evolution", older: 7e6, younger: 12_000 },
  { id: "civilisation", label: "Civilisation", older: 12_000, younger: 0 },
];

export type ZoomLevel = {
  id: "all" | "cosmic" | "geological" | "evolutionary" | "human";
  label: string;
  description: string;
  /** Linear range shown; undefined means the segmented view. */
  range?: [older: number, younger: number];
};

export const zoomLevels: readonly ZoomLevel[] = [
  { id: "all", label: "All of time", description: "Compressed scale: five bands of equal width, each linear inside." },
  { id: "cosmic", label: "Cosmic", description: "True scale, 13.8 billion years to today. Everything after the dinosaurs fits in the last half of one percent.", range: [AGE_OF_UNIVERSE, 0] },
  { id: "geological", label: "Geological", description: "True scale, Earth's 4.6 billion years.", range: [4.6e9, 0] },
  { id: "evolutionary", label: "Evolutionary", description: "True scale, the last 7.5 million years of the human lineage.", range: [7.5e6, 0] },
  { id: "human", label: "Human history", description: "True scale, the last 12,000 years.", range: [12_000, 0] },
];

export function getZoom(id: string): ZoomLevel {
  return zoomLevels.find((z) => z.id === id) ?? zoomLevels[0];
}

/** Position from 0 (oldest) to 1 (present), or null when outside the view. */
export function position(yearsAgo: number, zoom: ZoomLevel): number | null {
  if (zoom.range) {
    const [older, younger] = zoom.range;
    if (yearsAgo > older || yearsAgo < younger) return null;
    return (older - yearsAgo) / (older - younger);
  }
  const clamped = Math.min(AGE_OF_UNIVERSE, Math.max(0, yearsAgo));
  const i = bands.findIndex((b) => clamped <= b.older && clamped >= b.younger);
  const b = bands[i];
  return (i + (b.older - clamped) / (b.older - b.younger)) / bands.length;
}

function sig2(n: number): string {
  const p = Math.pow(10, Math.floor(Math.log10(n)) - 1);
  return (Math.round(n / p) * p).toLocaleString("en-GB", { maximumFractionDigits: 2 });
}

/** How much a band is resized on the segmented scale compared with a true scale. */
export function bandCompression(b: Band): { factor: number; text: string } {
  const trueShare = (b.older - b.younger) / AGE_OF_UNIVERSE;
  const factor = 1 / bands.length / trueShare;
  const text =
    factor < 1
      ? `Squeezed to about ${Math.round(factor * 100)}% of its true-scale width`
      : `Stretched about ${sig2(factor)} times wider than on a true scale`;
  return { factor, text };
}

/** Short label for a span or age in years. */
export function formatYears(years: number): string {
  const sig3 = (n: number) => Number(n.toPrecision(3)).toLocaleString("en-GB");
  if (years >= 1e9) return `${sig3(years / 1e9)} billion years`;
  if (years >= 1e6) return `${sig3(years / 1e6)} million years`;
  return `${Math.round(years).toLocaleString("en-GB")} years`;
}

/**
 * Assign each point a lane so markers closer than `minGap` (as a fraction of
 * the width) do not overlap. Points must be sorted by position.
 */
export function assignLanes(points: number[], minGap: number): number[] {
  const lastInLane: number[] = [];
  return points.map((p) => {
    let lane = lastInLane.findIndex((last) => p - last >= minGap);
    if (lane === -1) lane = lastInLane.length;
    lastInLane[lane] = p;
    return lane;
  });
}

/** Category labels and colours. Colour is never the only cue: names appear in the legend, labels and list. */
export const categoryInfo: Record<TimelineCategory, { label: string; color: string }> = {
  cosmic: { label: "Cosmic", color: "#b9a8f2" },
  earth: { label: "Earth", color: "#e8925a" },
  life: { label: "Life", color: "#7fd0b4" },
  "human-evolution": { label: "Human evolution", color: "#ee8fb3" },
  civilisation: { label: "Civilisation", color: "#e2c06f" },
  "science-technology": { label: "Ideas, science and technology", color: "#7cbbe0" },
};

/** Compact age label for axis ticks. */
export function formatAgoShort(years: number): string {
  if (years <= 0) return "Today";
  const sig3 = (n: number) => Number(n.toPrecision(3)).toLocaleString("en-GB");
  if (years >= 1e9) return `${sig3(years / 1e9)} bn yrs ago`;
  if (years >= 1e6) return `${sig3(years / 1e6)} m yrs ago`;
  return `${Math.round(years).toLocaleString("en-GB")} yrs ago`;
}
