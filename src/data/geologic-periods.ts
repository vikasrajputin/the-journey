/**
 * Period boundaries in millions of years ago, rounded to the nearest million
 * (Quaternary to 0.1), from the International Chronostratigraphic Chart
 * v2024/12 (source id "ics-chart"), checked against the chart on 2026-11-07. Used by the geological period exhibit.
 */
export type GeologicPeriod = { name: string; start: number; end: number; era: "Paleozoic" | "Mesozoic" | "Cenozoic" };

export const geologicPeriods: readonly GeologicPeriod[] = [
  { name: "Cambrian", start: 539, end: 487, era: "Paleozoic" },
  { name: "Ordovician", start: 487, end: 443, era: "Paleozoic" },
  { name: "Silurian", start: 443, end: 420, era: "Paleozoic" },
  { name: "Devonian", start: 420, end: 359, era: "Paleozoic" },
  { name: "Carboniferous", start: 359, end: 299, era: "Paleozoic" },
  { name: "Permian", start: 299, end: 252, era: "Paleozoic" },
  { name: "Triassic", start: 252, end: 201, era: "Mesozoic" },
  { name: "Jurassic", start: 201, end: 143, era: "Mesozoic" },
  { name: "Cretaceous", start: 143, end: 66, era: "Mesozoic" },
  { name: "Paleogene", start: 66, end: 23, era: "Cenozoic" },
  { name: "Neogene", start: 23, end: 2.6, era: "Cenozoic" },
  { name: "Quaternary", start: 2.6, end: 0, era: "Cenozoic" },
];
