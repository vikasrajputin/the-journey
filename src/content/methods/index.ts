/**
 * "How do we know?" methods. Each entry is written only from what its cited
 * sources support. `range` is the span of time the method typically covers.
 */
export type Method = {
  id: string;
  title: string;
  question: string;
  range: string;
  how: string;
  tells: string;
  limits: string;
  sourceIds: string[];
  /** Chapters where this method matters most (slugs). */
  chapters: string[];
};

export const methods: readonly Method[] = [
  {
    id: "radiometric-dating",
    title: "Radiometric dating",
    question: "How can a rock have an age in years?",
    range: "Thousands to billions of years, depending on the isotope",
    how: "Some atoms are unstable and decay into other atoms at a steady, measurable rate, described by a half-life. Measuring how much of the original (parent) isotope remains compared with what it has decayed into (the daughter) gives the time since the mineral formed. Isotopes with very long half-lives are used for very old rocks.",
    tells: "Numeric ages for volcanic rocks and minerals, and the age of Earth itself: about 4.54 billion years, from lead isotopes in meteorites.",
    limits: "It dates when a mineral crystallised, not when a fossil animal lived, so fossils are usually dated by the volcanic layers above and below them. Samples can be altered by later heating or weathering, which is why results are cross-checked between methods and laboratories.",
    sourceIds: ["usgs-radiometric", "usgs-decay-age", "usgs-age-earth"],
    chapters: ["planet-earth", "age-of-giants"],
  },
  {
    id: "radiocarbon",
    title: "Radiocarbon dating",
    question: "Why can't carbon dating date a dinosaur?",
    range: "Up to about 50,000 years",
    how: "Living things take in carbon, including a tiny amount of radioactive carbon-14. When an organism dies, it stops taking in carbon and its carbon-14 decays. Measuring how much remains gives the time since death.",
    tells: "Ages for once-living material such as bone, charcoal, wood, seeds and textiles: the tool behind much of the dating of the last tens of thousands of years, including early farming and the earliest cities.",
    limits: "After about 50,000 years too little carbon-14 is left to measure, so it cannot date dinosaurs or most of human evolution. Results must be calibrated, because the amount of carbon-14 in the atmosphere has varied over time.",
    sourceIds: ["oxford-c14", "acs-libby"],
    chapters: ["human-story", "civilisation"],
  },
  {
    id: "stratigraphy",
    title: "Stratigraphy and relative dating",
    question: "How can layers of rock put events in order?",
    range: "Any age where layers survive",
    how: "In undisturbed layers of rock or soil, deeper layers were laid down first, so they are older. Archaeologists and geologists record which layer each find came from and match layers between sites, sometimes using distinctive fossils.",
    tells: "The order of events, even when no numeric age is possible. Combined with radiometric or radiocarbon dates from some layers, it puts numeric ages on whole sequences.",
    limits: "Layers can be folded, eroded, dug into or mixed, and a missing layer can hide a long gap in time. Relative dating says 'older than' or 'younger than'; numeric ages need another method.",
    sourceIds: ["nps-relative-dating", "nps-archaeology-dating", "ue-chronology"],
    chapters: ["diversification", "age-of-giants", "civilisation"],
  },
  {
    id: "fossils",
    title: "Fossils and taphonomy",
    question: "What can a fossil tell us, and what is missing?",
    range: "From over 3 billion years ago to the recent past",
    how: "Fossils are the preserved remains or traces of past life: bones, shells, leaves, footprints, burrows and microbial structures. Taphonomy is the study of what happens to remains between death and discovery.",
    tells: "What lived, when (from the layers they are found in), and often how it moved, grew and fed. The order of fossils in rock layers shows how life changed over time.",
    limits: "Most organisms decay or are destroyed before they can fossilise, and soft-bodied life is rarely preserved. The record is a biased sample: it favours hard parts, certain environments and certain times, so absence of a fossil is not proof of absence.",
    sourceIds: ["ucmp-taphonomy", "ue-chronology"],
    chapters: ["first-life", "diversification", "age-of-giants", "human-story"],
  },
  {
    id: "cores",
    title: "Ice and sediment cores",
    question: "How do we know what past climates were like?",
    range: "Ice: hundreds of thousands of years. Ocean and lake sediments: far longer",
    how: "Snow that piles up on ice sheets traps air bubbles and records conditions year after year. Drilled ice cores and cores of ocean and lake mud are 'proxy' records: they do not measure temperature directly, but preserve clues that track it, alongside other proxies such as tree rings and corals.",
    tells: "Past temperatures, precipitation, the composition of the atmosphere including carbon dioxide, volcanic eruptions and wind patterns.",
    limits: "Proxies have to be calibrated against modern measurements, and each records a particular place. Their time resolution blurs further back in time.",
    sourceIds: ["nasa-ice-cores", "noaa-proxy"],
    chapters: ["planet-earth", "world-we-built", "you"],
  },
  {
    id: "dna",
    title: "Ancient DNA and molecular clocks",
    question: "How can genes reveal history?",
    range: "Ancient DNA: limited by how long DNA survives. Molecular clocks: any age, with calibration",
    how: "DNA recovered from ancient bones can be sequenced and compared with living people. Molecular clocks estimate when two lineages split by counting the differences between their DNA and applying a rate of change, calibrated against dated fossils.",
    tells: "Relationships between populations and species, including that many people today carry a small share of Neanderthal DNA. Estimates of when lineages diverged.",
    limits: "DNA breaks down over time, so old samples are rare and often damaged. Rates of genetic change vary, so clock estimates depend on their calibrations and come with wide ranges.",
    sourceIds: ["si-ancient-dna", "nobel-2022", "scitable-molecular-clock"],
    chapters: ["human-story", "first-life"],
  },
  {
    id: "cosmic-light",
    title: "Cosmic light: background radiation and redshift",
    question: "How can we know what happened 13.8 billion years ago?",
    range: "Back to about 380,000 years after the Big Bang (directly visible light)",
    how: "Light from distant galaxies is stretched to longer, redder wavelengths as space expands: the farther the galaxy, the greater the redshift. The cosmic microwave background is light released when the universe became transparent, about 380,000 years after the Big Bang; its pattern can be mapped across the whole sky.",
    tells: "That the universe is expanding, how fast, and, from detailed maps of the background light, its age of about 13.8 billion years and its contents.",
    limits: "Nothing earlier than the background light can be seen directly; earlier stages are inferred from models.",
    sourceIds: ["nasa-hubble-redshift", "esa-planck-cmb", "wmap-age"],
    chapters: ["before-everything"],
  },
  {
    id: "texts",
    title: "Manuscripts, inscriptions and source criticism",
    question: "How do historians test what old texts say?",
    range: "Roughly the last 5,000 years, since writing began",
    how: "Historians date and test written sources by their material (clay, parchment, birch bark, paper), their script and language, and sometimes by radiocarbon dating the material itself. They ask who wrote a text, when, for whom and why, and compare independent sources.",
    tells: "Names, events, beliefs and everyday records such as accounts and rations, often from the people involved.",
    limits: "Most people in the past left no writing, and texts reflect the views of those who wrote them. Copies may change over time, and a material date gives the age of the material, not necessarily of the text.",
    sourceIds: ["met-origins-writing", "dss-intro", "ox-bakhshali"],
    chapters: ["civilisation", "age-of-ideas"],
  },
];
