import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("age-of-giants")!,
  subtitle: "Dinosaurs, drifting continents, and the day the world changed",
  opening: "Dinosaurs did not all disappear. Look out of a window, and you may see one.",
  orientation: {
    when: "The Mesozoic Era, about 252 to 66 million years ago",
    where: "Every continent, as the supercontinent Pangaea broke apart",
    scale: "From sparrow-sized dinosaurs to long-necked giants over 30 metres long",
  },
  intro:
    "For about 186 million years, the Mesozoic world was home to dinosaurs, marine reptiles, flying pterosaurs, early mammals and the first flowering plants. Then, about 66 million years ago, most of it ended.",
  timeStart: 252_000_000,
  timeEnd: 66_000_000,
  sections: [
    {
      id: "three-periods",
      title: "Three periods, one era",
      blocks: [
        {
          type: "paragraph",
          text: "The [[mesozoic]] is divided into three periods: the Triassic (about 252 to 201 million years ago), the Jurassic (201 to 145) and the Cretaceous (145 to 66). Each lasted tens of millions of years. *Tyrannosaurus* lived closer in time to us than to *Stegosaurus*.",
          sourceIds: ["ics-chart", "nhm-when-dinosaurs"],
        },
        {
          type: "keyFacts",
          items: [
            { value: "≈252 million", label: "Years ago: the Mesozoic begins after the end-Permian extinction" },
            { value: "≈230 million", label: "Years ago: the earliest known dinosaurs" },
            { value: "≈66 million", label: "Years ago: non-avian dinosaurs die out" },
          ],
          sourceIds: ["ics-chart", "nhm-when-dinosaurs", "renne-2013"],
        },
      ],
    },
    {
      id: "rise-of-dinosaurs",
      title: "The rise of the dinosaurs",
      kicker: "From about 230 million years ago",
      blocks: [
        {
          type: "paragraph",
          text: "The earliest known dinosaurs appear in the Triassic, around 230 million years ago, in rocks from what are now South America and Africa. They were mostly modest-sized, two-legged animals, sharing the world with many other reptile groups, including the ancestors of crocodiles.",
          sourceIds: ["nhm-when-dinosaurs", "nhm-dinosaur-origins"],
        },
        {
          type: "paragraph",
          text: "Over the following tens of millions of years, dinosaurs diversified into many ecological roles: giant plant-eating sauropods, armoured and horned herbivores, fast predators, and small feathered forms. They lived on every continent, including those that are now polar.",
          sourceIds: ["nhm-when-dinosaurs"],
        },
      ],
    },
    {
      id: "a-world-in-motion",
      title: "A world in motion",
      blocks: [
        {
          type: "paragraph",
          text: "At the start of the Mesozoic, most land was joined in a single supercontinent, Pangaea. Over the era it broke apart, opening the Atlantic Ocean and separating the continents. Climates were generally warmer than today, often with little or no permanent polar ice, and sea levels were frequently higher.",
          sourceIds: ["usgs-dynamic-earth", "nhm-cretaceous"],
        },
        {
          type: "paragraph",
          text: "As continents separated, animal and plant populations became isolated and evolved along different paths. That is one reason why late Cretaceous dinosaurs in North America differed from those in South America or Asia.",
          sourceIds: ["nhm-cretaceous"],
        },
      ],
    },
    {
      id: "not-just-dinosaurs",
      title: "Not just dinosaurs",
      blocks: [
        {
          type: "paragraph",
          text: "Mesozoic seas held marine reptiles such as ichthyosaurs, plesiosaurs and, later, mosasaurs, which were not dinosaurs. Pterosaurs, the first vertebrates to evolve powered flight, were close relatives of dinosaurs but not dinosaurs themselves. Insects flourished, and in the Cretaceous, flowering plants spread and diversified, transforming landscapes.",
          sourceIds: ["nhm-cretaceous"],
        },
        {
          type: "paragraph",
          text: "Mammals were there too. They first appeared around the same time as the dinosaurs and lived alongside them for well over 100 million years. Most were small, but recent finds show they had already evolved a variety of ways of life: burrowing, climbing, swimming and gliding.",
          sourceIds: ["nhm-cretaceous", "amnh-birds-dinosaurs"],
          review: "Add a dedicated source on Mesozoic mammal diversity.",
        },
      ],
    },
    {
      id: "birds",
      title: "Birds are living dinosaurs",
      blocks: [
        {
          type: "paragraph",
          text: "Birds evolved from small, feathered, meat-eating dinosaurs called theropods, the same broad group that includes *Tyrannosaurus* and *Velociraptor*. Fossils from China and elsewhere show many non-avian dinosaurs with feathers, and birds share features such as hollow bones and wishbones with their dinosaur relatives.",
          sourceIds: ["nhm-birds-dinosaurs", "amnh-birds-dinosaurs"],
        },
        { type: "exhibit", exhibitId: "dinosaur-bird-tree" },
        {
          type: "callout",
          tone: "misconception",
          title: "The dinosaurs did not all die",
          text: "The extinction 66 million years ago wiped out the non-avian dinosaurs: all dinosaurs except birds. Some birds survived, and today there are more than ten thousand bird species. In the scientific sense, dinosaurs are still with us.",
          sourceIds: ["nhm-birds-dinosaurs"],
        },
      ],
    },
    {
      id: "the-end",
      title: "The end of the Cretaceous",
      kicker: "About 66 million years ago",
      blocks: [
        {
          type: "paragraph",
          text: "In 1980, a team led by physicist Luis Alvarez and geologist Walter Alvarez reported a thin clay layer at the boundary between Cretaceous and later rocks, enriched in iridium: a metal rare in Earth's crust but more common in many asteroids. They proposed that a large asteroid had struck Earth. Later, the [[iridium-anomaly]] was found worldwide, along with [[shocked-quartz]] and other impact debris.",
          sourceIds: ["alvarez-1980"],
        },
        {
          type: "paragraph",
          text: "The crater was identified at Chicxulub, buried beneath Mexico's Yucatán Peninsula. It is roughly 180 kilometres across, and its age matches the extinction layer, which radiometric dating places at about 66 million years ago. The impact would have caused fires, tsunamis and a global darkening that disrupted photosynthesis.",
          sourceIds: ["schulte-2010-chicxulub", "renne-2013"],
        },
        { type: "exhibit", exhibitId: "kpg-boundary" },
        {
          type: "callout",
          tone: "uncertainty",
          title: "The role of volcanoes",
          text: "At around the same time, enormous volcanic eruptions in what is now India, the Deccan Traps, released large amounts of gas. Most researchers see the impact as the main cause of the extinction, but scientists continue to study how much the volcanism stressed ecosystems before and after, and how the two may have interacted.",
          sourceIds: ["schulte-2010-chicxulub", "deccan-2019"],
        },
      ],
    },
    {
      id: "after",
      title: "After the impact",
      blocks: [
        {
          type: "paragraph",
          text: "Around three-quarters of species are estimated to have disappeared. The survivors included birds, mammals, crocodiles, turtles, many insects and plants. Over the following millions of years, mammals diversified into many of the ecological roles once filled by dinosaurs, eventually including primates.",
          sourceIds: ["nhm-mass-extinction", "amnh-birds-dinosaurs"],
          review: "Confirm the 'three-quarters of species' figure against the cited sources.",
        },
      ],
    },
  ],
  evidence: [
    {
      id: "fossil-beds",
      title: "Fossils and fossil-bearing rock layers",
      what: "Bones, teeth, eggs, footprints, feathers and plant remains preserved in Mesozoic sedimentary rocks.",
      helpsUs: "Reconstructs who lived where and when, and how they were related.",
      howStudied: "Excavation, anatomical comparison, CT scanning and analysis of the surrounding rock.",
      limitations: "Preservation favours large, hard-bodied animals in certain environments; colours and behaviour are usually inferred.",
      status: "well-established",
      sourceIds: ["nhm-when-dinosaurs"],
    },
    {
      id: "chicxulub-crater",
      title: "The Chicxulub crater",
      what: "A large buried impact structure in the Yucatán region of Mexico.",
      helpsUs: "Identifies the impact site, matching the age of the extinction boundary.",
      howStudied: "Gravity and magnetic surveys, seismic imaging and drilled rock cores.",
      limitations: "The crater is buried, so its full structure is reconstructed from indirect measurements and limited drill cores.",
      status: "well-established",
      sourceIds: ["schulte-2010-chicxulub"],
    },
    {
      id: "boundary-layer",
      title: "Iridium-rich boundary layer and shocked minerals",
      what: "A thin, global clay layer with high iridium, shocked quartz and glassy spherules.",
      helpsUs: "Records the debris of a large impact spread around the world.",
      howStudied: "Chemical analysis and microscopy of samples from many sites on land and in ocean sediment cores.",
      limitations: "Local erosion and mixing mean the layer is not equally well preserved everywhere.",
      status: "well-established",
      sourceIds: ["alvarez-1980", "schulte-2010-chicxulub"],
    },
    {
      id: "boundary-dating",
      title: "Radiometric dating of the boundary",
      what: "High-precision ages from volcanic ash and impact glass close to the boundary.",
      helpsUs: "Places the extinction and the impact at about 66 million years ago, close together in time.",
      howStudied: "Argon–argon and uranium–lead dating.",
      limitations: "Precision is high, but resolving the exact sequence of impact and volcanic pulses remains challenging.",
      status: "well-established",
      sourceIds: ["renne-2013", "deccan-2019"],
    },
  ],
  goDeeper: [
    {
      id: "carbon14-myth",
      title: "Why carbon dating can't date dinosaurs",
      blocks: [
        {
          type: "paragraph",
          text: "[[radiocarbon-dating|Radiocarbon dating]] works only for once-living material up to around 50,000 years old, because carbon-14 decays too quickly to measure beyond that. Dinosaur fossils are tens of millions of years old. They are dated using other isotopes with much longer half-lives, usually from volcanic layers above and below the fossils.",
          sourceIds: ["oxford-c14", "usgs-decay-age"],
        },
      ],
    },
  ],
  transition: "In the world the asteroid left behind, mammals diversified. One small branch of them, the primates, would lead to us.",
};
