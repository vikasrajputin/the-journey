import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("first-life")!,
  subtitle: "Three billion years of microbes that changed a planet",
  opening: "For most of Earth's history, life was too small to see. It still changed everything.",
  orientation: {
    when: "From at least about 3.5 billion years ago to the rise of complex cells, perhaps around 2 billion years ago",
    where: "Oceans, shallow seas, hot springs and mineral surfaces on early Earth",
    scale: "Most life was single cells, a few thousandths of a millimetre across",
  },
  intro:
    "Somewhere on early Earth, chemistry became biology. We do not know exactly when, where or how. But the evidence shows that once life began, it spread, persisted, and slowly reshaped the planet's oceans and air.",
  timeStart: 3_800_000_000,
  timeEnd: 1_600_000_000,
  sections: [
    {
      id: "what-is-life",
      title: "What counts as life?",
      blocks: [
        {
          type: "lead",
          text: "Before asking how life began, it helps to ask what life is. There is no single definition that every scientist accepts.",
        },
        {
          type: "paragraph",
          text: "A working description: life is chemistry that keeps itself going and makes copies of itself that can change over generations. Living things have a boundary, such as a cell membrane, that separates inside from outside. They run on [[metabolism]], capturing energy to maintain and build themselves. And they have [[heredity]]: instructions passed from parent to offspring, with small variations that [[natural-selection]] can act on.",
          sourceIds: ["nasa-what-is-life"],
        },
        {
          type: "paragraph",
          text: "The hard part is the boundary between non-living and living. Viruses, for example, carry genes and evolve but cannot reproduce without a host cell. Any origin of life would have passed through such in-between stages, which is part of why it is so difficult to pin down.",
          sourceIds: ["nasa-what-is-life"],
        },
      ],
    },
    {
      id: "the-origin-question",
      title: "The origin: an open question",
      blocks: [
        {
          type: "callout",
          tone: "uncertainty",
          title: "What we don't know",
          text: "The exact date, place and pathway by which life began remain unresolved. Researchers test several ideas, including chemistry at deep-sea hydrothermal vents, in shallow pools on land that repeatedly dried and wetted, and on mineral surfaces. Laboratory experiments have produced many of life's building blocks, but no one has yet shown a complete path from simple chemistry to a living cell.",
          sourceIds: ["nasa-what-is-life"],
          review: "Add a peer-reviewed review article on origin-of-life hypotheses.",
        },
        {
          type: "paragraph",
          text: "Studies comparing the genes of all living organisms point to a last universal common ancestor: a population of single-celled organisms from which all known life descends. It was not the first life; it was the last ancestor all surviving lineages share.",
          review: "Add a source for the last universal common ancestor (LUCA).",
        },
      ],
    },
    {
      id: "earliest-evidence",
      title: "The earliest evidence",
      kicker: "At least about 3.5 billion years ago",
      blocks: [
        {
          type: "paragraph",
          text: "Evidence indicates life existed by at least about 3.5 billion years ago. Some of the strongest early evidence comes from the Pilbara region of Western Australia, where rocks of that age contain [[stromatolite|stromatolites]] and other textures that appear to have been built by communities of [[microbe|microbes]].",
          sourceIds: ["djokic-2017-hot-springs", "nhm-oldest-stromatolites"],
        },
        {
          type: "callout",
          tone: "uncertainty",
          title: "Older claims are debated",
          text: "Researchers have proposed older signs of life, such as 3.7-billion-year-old structures in Greenland and chemical traces in even older rocks. Other scientists have questioned whether these were made by living things or by non-biological processes. The further back we look, the more the rocks have been heated, squeezed and altered, and the harder they are to read.",
          sourceIds: ["nutman-2016-isua"],
        },
        {
          type: "paragraph",
          text: "Living stromatolites still grow today in a few places, such as the salty waters of Shark Bay in Western Australia. Studying them helps scientists interpret ancient structures, though resemblance alone is not proof that an ancient structure was biological.",
          review: "Add a source for living stromatolites at Shark Bay.",
        },
      ],
    },
    {
      id: "a-microbial-planet",
      title: "A microbial planet",
      blocks: [
        {
          type: "paragraph",
          text: "The earliest life was microbial: no plants, no animals, nothing you could see without a microscope. For well over two billion years, Earth's living world consisted of [[prokaryote|prokaryotes]]: bacteria and archaea, single cells without a nucleus.",
          sourceIds: ["si-early-life"],
        },
        {
          type: "paragraph",
          text: "That does not mean nothing was happening. Microbes evolved ways to draw energy from sunlight, from iron, sulphur and other chemicals, and from each other. They formed vast mats in shallow water and built up layers of rock. Many of the chemical cycles that keep Earth habitable today were first established by microbes.",
          sourceIds: ["si-early-life"],
        },
      ],
    },
    {
      id: "oxygen",
      title: "The air changes",
      kicker: "From about 2.4 billion years ago",
      blocks: [
        {
          type: "paragraph",
          text: "One group of bacteria, the cyanobacteria, evolved a form of [[photosynthesis]] that splits water and releases oxygen. For a long time, the oxygen they produced was absorbed by iron in seawater and by gases and minerals. Eventually, oxygen began to build up in the atmosphere. Geologists call this the [[great-oxidation-event]].",
          sourceIds: ["nasa-goe"],
        },
        { type: "exhibit", exhibitId: "oxygen-through-time" },
        {
          type: "callout",
          tone: "misconception",
          title: "Not a switch, but a long, uneven change",
          text: "Oxygen did not appear suddenly everywhere. Evidence suggests brief local 'whiffs' before the main rise, and oxygen levels in the atmosphere and in different parts of the ocean rose and fell over hundreds of millions of years. For most of Earth's history, oxygen stayed far below today's levels.",
          sourceIds: ["nasa-goe", "nature-2024-oxygenation"],
        },
        {
          type: "paragraph",
          text: "Oxygen was both a poison and an opportunity. It was toxic to many microbes, but it also allowed new, energy-rich ways of living. Over time, it built the ozone layer that now screens out much harmful ultraviolet light.",
          review: "Add a source on the timing of ozone-layer formation.",
        },
      ],
    },
    {
      id: "complex-cells",
      title: "A partnership inside a cell",
      blocks: [
        {
          type: "paragraph",
          text: "At some point, perhaps around two billion years ago, a new kind of cell appeared: the [[eukaryote]], with its DNA enclosed in a nucleus and its interior divided into compartments. Animals, plants, fungi and many single-celled organisms are all eukaryotes.",
          sourceIds: ["ue-prokaryotes-eukaryotes"],
          review: "The timing of the first eukaryotes is uncertain; confirm the 'around two billion years' wording against a dated source.",
        },
        {
          type: "paragraph",
          text: "A key step was [[endosymbiosis]]: one cell living inside another. The mitochondria that power your cells are thought to descend from bacteria that were taken in by an ancestral cell and, instead of being digested, became permanent partners. Later, in the ancestors of plants and algae, a photosynthetic bacterium was taken in the same way and became the chloroplast.",
          sourceIds: ["ue-endosymbiosis-evidence"],
        },
        { type: "exhibit", exhibitId: "cell-comparison" },
        {
          type: "paragraph",
          text: "The evidence is strong. Mitochondria and chloroplasts have their own small, circular DNA, similar to that of bacteria. They divide on their own, much as bacteria do, and their genes are most closely related to those of particular groups of bacteria living today.",
          sourceIds: ["ue-endosymbiosis-evidence"],
        },
      ],
    },
  ],
  evidence: [
    {
      id: "stromatolites",
      title: "Stromatolites and microbial structures",
      what: "Layered rock structures and textures, about 3.5 billion years old and younger, resembling those built by modern microbial mats.",
      helpsUs: "Points to communities of microbes living in shallow water and hot springs.",
      howStudied: "Field mapping, microscopy and chemical analysis, compared with living microbial mats.",
      limitations: "Some layered structures can form without life; each case must be argued from several lines of evidence.",
      status: "strong-evidence",
      sourceIds: ["djokic-2017-hot-springs", "nhm-oldest-stromatolites"],
    },
    {
      id: "isotopes",
      title: "Isotopic signatures",
      what: "Tiny differences in the ratios of carbon, sulphur and other isotopes preserved in ancient rocks.",
      helpsUs: "Living processes favour lighter isotopes, so some ratios can signal biological activity or the presence of oxygen.",
      howStudied: "Mass spectrometry of carefully selected rock samples.",
      limitations: "Heat and chemical alteration over billions of years can create or erase similar signals.",
      status: "active-research",
      sourceIds: ["nasa-goe", "nutman-2016-isua"],
    },
    {
      id: "microfossils",
      title: "Microfossils and geochemistry",
      what: "Microscopic fossil cells and chemical traces of life preserved in fine-grained rocks.",
      helpsUs: "Shows what early cells looked like and where they lived.",
      howStudied: "Thin sections viewed under microscopes, plus chemical mapping at very small scales.",
      limitations: "Simple round or thread-like shapes can also form from minerals; claims for the oldest microfossils are contested.",
      status: "debated",
      sourceIds: ["si-early-life"],
    },
    {
      id: "comparative-genomics",
      title: "Molecular biology and comparative genomics",
      what: "Comparisons of genes and proteins across all living organisms.",
      helpsUs: "Reveals shared ancestry, the deep branches of the tree of life, and the bacterial origins of mitochondria and chloroplasts.",
      howStudied: "DNA sequencing and computational comparison of genomes.",
      limitations: "Genes can move between microbes, which blurs the deepest branches; dating these branches relies on molecular clocks with large uncertainties.",
      status: "strong-evidence",
      sourceIds: ["ue-endosymbiosis-evidence"],
    },
  ],
  goDeeper: [
    {
      id: "why-so-long",
      title: "Why did complex life take so long?",
      blocks: [
        {
          type: "paragraph",
          text: "Microbes dominated Earth for billions of years before large, complex organisms appeared. Possible reasons include low oxygen levels, scarce nutrients, and the rarity of the cellular partnerships that produced eukaryotes. Scientists debate how much each mattered. The answer may also inform how common complex life might be elsewhere in the universe.",
          review: "Needs a review-article source before launch.",
        },
      ],
    },
  ],
  transition: "Life was small, microbial and largely invisible. Yet it had transformed the planet, and set the stage for something new.",
};
