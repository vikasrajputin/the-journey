import type { GlossaryEntry } from "@/lib/content-schema";

/**
 * Plain-language glossary. Referenced inline with [[id]] or [[id|text]].
 * Definitions aim for one or two sentences a curious 15-year-old can follow.
 */
export const glossary: readonly GlossaryEntry[] = [
  /* Cosmos */
  { id: "observable-universe", term: "observable universe", definition: "The part of the universe from which light has had time to reach us since the universe began. The whole universe may be much larger, or even infinite." },
  { id: "big-bang-model", term: "Big Bang model", definition: "The scientific description of the universe developing from an extremely hot, dense early state and expanding ever since. It describes what happened after that early state, not what, if anything, came before it.", related: ["cosmic-expansion", "cmb"] },
  { id: "cosmic-expansion", term: "expansion of space", definition: "The steady increase in distances between galaxies that are not bound together by gravity. Space itself stretches; galaxies are not flying apart through a pre-existing void.", sourceIds: ["nasa-hubble-redshift"] },
  { id: "redshift", term: "redshift", definition: "The stretching of light to longer, redder wavelengths. Light from distant galaxies is redshifted because space expanded while the light was travelling to us.", sourceIds: ["nasa-hubble-redshift"] },
  { id: "cmb", term: "cosmic microwave background", definition: "Faint microwave radiation that fills the sky in every direction. It is light released about 380,000 years after the Big Bang, when the universe first became transparent.", sourceIds: ["esa-planck-cmb"] },
  { id: "nucleosynthesis", term: "nucleosynthesis", definition: "The making of atomic nuclei. Hydrogen, helium and a little lithium formed in the first minutes of the universe; most heavier elements were made later, in stars and stellar explosions.", sourceIds: ["nasa-star-stuff", "wmap-bbn"] },
  { id: "galaxy", term: "galaxy", definition: "A vast system of stars, gas, dust and dark matter held together by gravity. Our galaxy, the Milky Way, contains hundreds of billions of stars." },
  { id: "dark-matter", term: "dark matter", definition: "Matter that does not emit or absorb light but whose gravity shapes galaxies and the large-scale structure of the universe. What it is made of is still unknown." },

  /* Earth */
  { id: "accretion", term: "accretion", definition: "The gradual growth of a body as smaller pieces collide and stick to it. Planets grew by accretion from dust, pebbles and larger rocky bodies." },
  { id: "differentiation", term: "differentiation", definition: "The separation of a young planet into layers by density: heavy iron sank to form the core, while lighter rock formed the mantle and crust." },
  { id: "zircon", term: "zircon", definition: "A tough mineral crystal that traps uranium but not lead when it forms. This makes zircons excellent natural clocks, and some have survived for over 4 billion years." },
  { id: "radiometric-dating", term: "radiometric dating", definition: "Working out the age of a rock or object from the steady decay of radioactive atoms it contains, using their known half-lives.", sourceIds: ["usgs-radiometric"] },
  { id: "half-life", term: "half-life", definition: "The time it takes for half of the radioactive atoms in a sample to decay. Each isotope has its own fixed half-life, from fractions of a second to billions of years." },
  { id: "plate-tectonics", term: "plate tectonics", definition: "The slow movement of the large rigid plates that make up Earth's outer shell. Plates spread apart, collide and sink, recycling the surface over hundreds of millions of years.", sourceIds: ["usgs-dynamic-earth"] },
  { id: "habitability", term: "habitability", definition: "Whether an environment could support life as we know it, for example by having liquid water, energy sources and the right chemistry. Being habitable does not mean life must appear." },

  /* Life */
  { id: "microbe", term: "microbe", definition: "A living thing too small to see without a microscope, such as a bacterium or archaeon. Microbes were the only life on Earth for most of its history." },
  { id: "stromatolite", term: "stromatolite", definition: "A layered rock structure built up by communities of microbes trapping sediment or causing minerals to form. Living examples still grow today, for instance in Shark Bay, Australia." },
  { id: "metabolism", term: "metabolism", definition: "The chemical reactions a living thing uses to capture energy and build or break down materials." },
  { id: "heredity", term: "heredity", definition: "The passing of traits from parents to offspring through genetic material, mostly DNA." },
  { id: "natural-selection", term: "natural selection", definition: "The process in which inherited traits that help organisms survive and reproduce in their environment become more common over generations. It has no goal or foresight.", sourceIds: ["ue-misconceptions"] },
  { id: "photosynthesis", term: "photosynthesis", definition: "Using sunlight to make food from carbon dioxide and water. The kind used by cyanobacteria, algae and plants releases oxygen as a by-product." },
  { id: "great-oxidation-event", term: "Great Oxidation Event", definition: "A period beginning roughly 2.4 billion years ago when oxygen first built up in Earth's atmosphere. It unfolded over a long time and unevenly, rather than in a single moment.", sourceIds: ["nasa-goe"] },
  { id: "prokaryote", term: "prokaryote", definition: "A single-celled organism whose DNA is not enclosed in a nucleus. Bacteria and archaea are prokaryotes." },
  { id: "eukaryote", term: "eukaryote", definition: "An organism whose cells keep their DNA inside a nucleus and contain other internal compartments. Animals, plants, fungi and many single-celled organisms are eukaryotes." },
  { id: "endosymbiosis", term: "endosymbiosis", definition: "One organism living inside another to the benefit of both. Mitochondria and chloroplasts are thought to descend from bacteria that once lived inside other cells.", sourceIds: ["ue-endosymbiosis-evidence"] },

  /* Diversification */
  { id: "common-ancestor", term: "common ancestor", definition: "A population from which two or more later groups are descended. Humans and chimpanzees share a common ancestor; neither descends from the other." },
  { id: "mutation", term: "mutation", definition: "A change in the DNA sequence. Most have little effect, some are harmful and a few are useful. Mutations are the ultimate source of new genetic variation." },
  { id: "genetic-drift", term: "genetic drift", definition: "Random changes in how common gene variants are in a population, especially strong in small populations. Unlike natural selection, it is driven by chance." },
  { id: "multicellularity", term: "multicellularity", definition: "Life made of many cooperating cells. It evolved independently several times, including in animals, plants, fungi and some algae." },
  { id: "cambrian-diversification", term: "Cambrian diversification", definition: "The appearance of most major animal groups in the fossil record between roughly 539 and 500 million years ago. It built on earlier animal life and unfolded over tens of millions of years.", sourceIds: ["rom-burgess-explosion"] },
  { id: "tetrapod", term: "tetrapod", definition: "A vertebrate with four limbs, or descended from ancestors that had them. Amphibians, reptiles, birds and mammals are tetrapods." },
  { id: "mass-extinction", term: "mass extinction", definition: "A geologically brief interval in which a large share of the world's species die out. Five are usually recognised in the past 500 million years.", sourceIds: ["nhm-mass-extinction"] },
  { id: "stratigraphy", term: "stratigraphy", definition: "The study of rock or soil layers. In undisturbed layers, lower layers were laid down first, which lets scientists put events in order.", sourceIds: ["nps-relative-dating"] },
  { id: "transitional-fossil", term: "transitional fossil", definition: "A fossil showing a mix of features from an earlier group and a later one. It records a stage in a branching history, not necessarily a direct ancestor." },

  /* Giants */
  { id: "mesozoic", term: "Mesozoic Era", definition: "The era from about 252 to 66 million years ago, divided into the Triassic, Jurassic and Cretaceous periods.", sourceIds: ["ics-chart"] },
  { id: "non-avian-dinosaur", term: "non-avian dinosaurs", definition: "All dinosaurs except birds. Non-avian dinosaurs died out 66 million years ago; birds survived." },
  { id: "iridium-anomaly", term: "iridium anomaly", definition: "An unusually high concentration of the metal iridium in a thin rock layer. Iridium is rare in Earth's crust but more common in many asteroids.", sourceIds: ["alvarez-1980"] },
  { id: "shocked-quartz", term: "shocked quartz", definition: "Quartz grains with microscopic deformation features formed only under extreme, sudden pressure, such as a large impact." },

  /* Human story */
  { id: "primate", term: "primate", definition: "The group of mammals that includes lemurs, monkeys, apes and humans." },
  { id: "hominin", term: "hominin", definition: "Humans and the extinct species more closely related to us than to chimpanzees and bonobos. The group has many branches, most of which died out.", sourceIds: ["si-intro-human-evolution"] },
  { id: "neanderthal", term: "Neanderthals", definition: "A hominin group that lived across Europe and western Asia until about 40,000 years ago. Many living people carry a small share of Neanderthal DNA.", sourceIds: ["green-2010-neandertal"] },
  { id: "denisovan", term: "Denisovans", definition: "A hominin group known mainly from DNA and a small number of fossils from Asia. Some living populations, especially in Oceania, carry Denisovan DNA.", sourceIds: ["nobel-2022"] },
  { id: "ancient-dna", term: "ancient DNA", definition: "Genetic material recovered from old bones, teeth or sediments. It is usually damaged and fragmentary, so special methods are needed to read it reliably." },
  { id: "cumulative-culture", term: "cumulative culture", definition: "Knowledge and skills that build up across generations, with each generation learning from and improving on what came before." },

  /* Civilisation */
  { id: "domestication", term: "domestication", definition: "A long-term relationship in which people shape the breeding of plants or animals, which change genetically as a result. It usually took centuries to millennia.", sourceIds: ["larson-2014-domestication"] },
  { id: "neolithic", term: "Neolithic", definition: "A label for the period when farming and settled villages spread in a region. It began at different times in different places." },
  { id: "cuneiform", term: "cuneiform", definition: "A writing system of wedge-shaped marks pressed into clay, developed in Mesopotamia. It was used for several languages over about 3,000 years.", sourceIds: ["met-origins-writing"] },
  { id: "bce-ce", term: "BCE / CE", definition: "Before the Common Era and Common Era: a calendar convention numbering years from a traditional starting point. It is widely used today, but ancient societies kept their own calendars." },
  { id: "radiocarbon-dating", term: "radiocarbon dating", definition: "Dating once-living material from the decay of carbon-14. It works back to around 50,000 years at most, so it cannot date dinosaur fossils.", sourceIds: ["oxford-c14"] },

  /* Ideas */
  { id: "manuscript", term: "manuscript", definition: "A handwritten document. For many ancient works, the surviving manuscripts were copied centuries after the text was first composed." },
  { id: "textual-criticism", term: "textual criticism", definition: "Comparing surviving copies of a text to understand how it changed over time and, where possible, what earlier versions said." },
  { id: "oral-transmission", term: "oral transmission", definition: "Passing on texts, stories or knowledge by speech and memory rather than in writing. Many traditions were transmitted orally for generations before being written down." },
  { id: "peer-review", term: "peer review", definition: "Evaluation of research by other experts before publication. It catches many errors but does not guarantee that a result is correct." },

  /* World we built */
  { id: "scientific-method", term: "scientific methods", definition: "Ways of testing ideas against evidence: observing, measuring, experimenting, sharing results and having others check and try to repeat them." },
  { id: "industrialisation", term: "industrialisation", definition: "The shift to producing goods with machines and large amounts of energy, beginning in Britain in the 1700s and spreading unevenly worldwide." },
  { id: "machine-learning", term: "machine learning", definition: "Building computer systems that improve at a task by finding patterns in data rather than following only hand-written rules." },
  { id: "language-model", term: "language model", definition: "A machine-learning system trained on large amounts of text to predict likely next words. Such systems can produce fluent text but can also be wrong." },

  /* Methods */
  { id: "taphonomy", term: "taphonomy", definition: "The study of what happens to an organism after death, including how it might become a fossil. It explains why the fossil record is patchy.", sourceIds: ["ucmp-taphonomy"] },
  { id: "molecular-clock", term: "molecular clock", definition: "Estimating when lineages split from the number of genetic differences between them. It depends on assumptions about mutation rates and needs calibration with fossils.", sourceIds: ["scitable-molecular-clock"] },
  { id: "proxy-data", term: "proxy data", definition: "Indirect records of past conditions, such as ice cores, tree rings and sediment layers, used where no direct measurements exist.", sourceIds: ["noaa-proxy"] },
];

const byId = new Map(glossary.map((g) => [g.id, g]));

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return byId.get(id);
}
