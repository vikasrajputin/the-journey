/**
 * Period boundaries in millions of years ago, rounded to the nearest million
 * (Quaternary to 0.1), from the International Chronostratigraphic Chart
 * (source id "ics-chart"). Used by the geological period exhibit.
 */
export type GeologicPeriod = { name: string; start: number; end: number; era: "Paleozoic" | "Mesozoic" | "Cenozoic" };

export const geologicPeriods: readonly GeologicPeriod[] = [
  { name: "Cambrian", start: 539, end: 485, era: "Paleozoic" },
  { name: "Ordovician", start: 485, end: 444, era: "Paleozoic" },
  { name: "Silurian", start: 444, end: 419, era: "Paleozoic" },
  { name: "Devonian", start: 419, end: 359, era: "Paleozoic" },
  { name: "Carboniferous", start: 359, end: 299, era: "Paleozoic" },
  { name: "Permian", start: 299, end: 252, era: "Paleozoic" },
  { name: "Triassic", start: 252, end: 201, era: "Mesozoic" },
  { name: "Jurassic", start: 201, end: 145, era: "Mesozoic" },
  { name: "Cretaceous", start: 145, end: 66, era: "Mesozoic" },
  { name: "Paleogene", start: 66, end: 23, era: "Cenozoic" },
  { name: "Neogene", start: 23, end: 2.6, era: "Cenozoic" },
  { name: "Quaternary", start: 2.6, end: 0, era: "Cenozoic" },
];
