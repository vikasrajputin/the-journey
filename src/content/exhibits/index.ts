import type { ExhibitDefinition } from "@/lib/content-schema";

/**
 * Exhibit registry. Each exhibit has a full text alternative, which is also
 * its static fallback: if the visual cannot render, the visitor still gets
 * everything it communicates, in words.
 */
export const exhibits: readonly ExhibitDefinition[] = [
  /* 1. Before everything */
  {
    id: "early-universe-timeline",
    title: "The first 400 million years, roughly",
    kind: "diagram",
    caption: "Milestones of the early universe as described by the standard cosmological model. The spacing is not to scale, and all times are approximate.",
    textAlternative:
      "A sequence of milestones after the Big Bang. In the first fraction of a second, the universe is extremely hot and dense and expanding. Within about the first three minutes, protons and neutrons combine into the nuclei of hydrogen, helium and a trace of lithium. For the next several hundred thousand years, the universe is a hot, glowing fog of charged particles and light. At about 380,000 years, it cools enough for electrons to join nuclei and form neutral atoms; light travels freely for the first time, and this light is the cosmic microwave background we detect today. A long 'dark age' follows with no stars. Within a few hundred million years, gravity pulls gas into the first stars and galaxies.",
    sourceIds: ["esa-planck-cmb", "wmap-bbn", "nasa-universe-overview"],
  },
  {
    id: "expanding-grid",
    title: "Expansion: an analogy and its limits",
    kind: "diagram",
    caption: "Dots on a stretching surface move apart without moving across it. This is an analogy, not a picture of the real universe.",
    textAlternative:
      "A grid of dots representing galaxies is shown at two moments. In the second, the grid has been stretched evenly, so every dot is further from every other dot. From any one dot, all the others appear to move away, and the more distant ones appear to move away faster. No dot is at the centre. The analogy's limits: real space is not a two-dimensional surface, there is no outside 'edge' into which it expands, and gravity holds galaxies themselves together, so they do not stretch.",
    sourceIds: ["nasa-hubble-redshift"],
  },
  {
    id: "element-origins",
    title: "Where the elements in you came from",
    kind: "diagram",
    caption: "Simplified main origins of selected elements. Most elements have more than one source, and the exact contributions are still being refined.",
    textAlternative:
      "Hydrogen: formed in the first minutes of the universe. Helium: mostly formed in the first minutes, with more made later in stars. Carbon, nitrogen and oxygen: made by nuclear fusion inside stars and released when stars shed their outer layers or explode. Calcium and iron: made in stars, released largely in supernova explosions. Many of the heaviest elements, such as gold and iodine: made in rare, violent events including neutron-star mergers and some supernovae. Everyday conclusion: apart from hydrogen, most of the atoms in your body were forged inside earlier generations of stars.",
    sourceIds: ["nasa-star-stuff", "nhm-stardust"],
  },

  /* 2. Planet Earth */
  {
    id: "solar-nebula-sequence",
    title: "From a cloud to a planetary system",
    kind: "illustration",
    caption: "A schematic sequence of Solar System formation, based on observations of young star systems and on models. Not to scale.",
    textAlternative:
      "Step 1: a cold cloud of gas and dust begins to collapse under its own gravity. Step 2: the collapsing cloud spins faster and flattens into a disc, with the young Sun forming at its centre. Step 3: within the disc, dust grains stick together into pebbles and then larger bodies called planetesimals. Step 4: planetesimals collide and merge, growing into planets over millions of years; rocky planets form closer to the Sun and gas giants further out. Leftover material survives today as asteroids, comets and meteorites.",
    sourceIds: ["nasa-solar-system-form"],
  },
  {
    id: "earth-cutaway",
    title: "Inside the Earth",
    kind: "diagram",
    caption: "Earth's main layers. Thicknesses are approximate and simplified. No one has drilled deeper than the upper crust; the deeper layers are known mainly from how earthquake waves travel.",
    textAlternative:
      "From outside in: the atmosphere; a thin rocky crust, roughly 5 to 70 kilometres thick, thinnest under the oceans; the mantle, about 2,900 kilometres of hot rock that flows extremely slowly; a liquid outer core of mostly iron and nickel, whose motion generates Earth's magnetic field; and a solid inner core at the centre, about 6,370 kilometres down.",
    sourceIds: ["usgs-interior"],
    // Layer figures are textbook values; flagged for exact-figure check in Phase 5.
  },

  /* 3. First life */
  {
    id: "cell-comparison",
    title: "Two ways to build a cell",
    kind: "diagram",
    caption: "Simplified prokaryotic and eukaryotic cells. Real cells vary enormously, and sizes are not to scale.",
    textAlternative:
      "Left, a prokaryotic cell such as a bacterium: a membrane, often a cell wall, and DNA floating in the cell's interior without a nucleus. Right, a eukaryotic cell: typically much larger, with DNA enclosed in a nucleus, internal membranes, and mitochondria that release energy from food. Plant and algal cells also contain chloroplasts for photosynthesis. Mitochondria and chloroplasts have their own small loops of DNA, resembling those of bacteria.",
    sourceIds: ["ue-endosymbiosis-evidence", "ue-prokaryotes-eukaryotes"],
  },
  {
    id: "oxygen-through-time",
    title: "Oxygen through time: the broad pattern",
    kind: "diagram",
    caption: "A qualitative sketch, not a plotted dataset. Estimates of past oxygen levels vary widely between methods, especially before about 500 million years ago.",
    textAlternative:
      "For roughly the first two billion years of Earth's history, the atmosphere contained almost no free oxygen, though some oxygen-producing microbes may already have existed and produced local 'whiffs'. Beginning around 2.4 billion years ago, during the Great Oxidation Event, oxygen rose in the atmosphere, unevenly and over a long period. Through much of the following 1.5 billion years, levels stayed low by today's standards. In the last several hundred million years, oxygen rose towards modern levels, around the time when large animals and land plants diversified. Exact values and timing are actively researched.",
    sourceIds: ["nasa-goe", "nature-2024-oxygenation"],
  },

  /* 4. Diversification */
  {
    id: "tree-not-ladder",
    title: "A tree, not a ladder",
    kind: "diagram",
    caption: "A simplified tree of a few living groups. Every tip is a living group with an equally long history; none is 'more evolved'.",
    textAlternative:
      "A branching tree with living groups at its tips: bacteria, archaea, plants, fungi, and animals including sponges, insects, fish, frogs, lizards, birds and mammals. Branch points mark common ancestors. A ladder-style picture, with simple life at the bottom and humans at the top, is shown crossed out, because every living group has been evolving for the same length of time and branches lead in many directions.",
    sourceIds: ["ue-trees-not-ladders"],
  },
  {
    id: "geologic-period-strip",
    title: "Geological periods of the last 540 million years",
    kind: "data",
    caption: "Period boundaries from the International Chronostratigraphic Chart (2024/12), rounded to the nearest million years. Bar widths are proportional to duration.",
    textAlternative:
      "Cambrian, about 539 to 485 million years ago. Ordovician, 485 to 444. Silurian, 444 to 419. Devonian, 419 to 359. Carboniferous, 359 to 299. Permian, 299 to 252. Triassic, 252 to 201. Jurassic, 201 to 145. Cretaceous, 145 to 66. Paleogene, 66 to 23. Neogene, 23 to 2.6. Quaternary, 2.6 million years ago to the present. The Paleozoic Era spans Cambrian to Permian, the Mesozoic spans Triassic to Cretaceous, and the Cenozoic spans Paleogene to the present.",
    sourceIds: ["ics-chart"],
  },

  /* 5. Age of giants */
  {
    id: "dinosaur-bird-tree",
    title: "Birds are dinosaurs",
    kind: "diagram",
    caption: "A simplified family tree. Each tip is a group, not a single species, and many branches are omitted.",
    textAlternative:
      "A tree of archosaurs. One branch leads to crocodiles and their relatives. The other leads to pterosaurs and to dinosaurs. Dinosaurs split into ornithischians, such as Triceratops and Stegosaurus, and saurischians. Saurischians include the long-necked sauropods and the theropods. Within theropods sit Tyrannosaurus, Velociraptor and birds. All branches except birds end at or before 66 million years ago. Birds continue to the present day, so birds are living dinosaurs.",
    sourceIds: ["nhm-birds-dinosaurs", "amnh-birds-dinosaurs"],
  },
  {
    id: "kpg-boundary",
    title: "Reading the boundary layer",
    kind: "diagram",
    caption: "A schematic rock section across the end-Cretaceous boundary. Layer thicknesses vary from site to site.",
    textAlternative:
      "A column of rock layers. Below: Cretaceous rocks with fossils of non-avian dinosaurs, ammonites and many plankton species. At the boundary: a thin clay layer, often just centimetres thick, enriched in iridium and containing shocked quartz and tiny glassy spherules, all signatures of a large impact. Above: Paleogene rocks in which many earlier groups are absent and new communities gradually appear. Radiometric dating places the boundary at about 66 million years ago, close to the age of the Chicxulub crater in Mexico.",
    sourceIds: ["alvarez-1980", "schulte-2010-chicxulub", "renne-2013"],
  },

  /* 6. Human story */
  {
    id: "hominin-bush",
    title: "A bush, not a march",
    kind: "diagram",
    caption: "Selected hominin groups with approximate time ranges. Relationships between many of them are uncertain, and the dates change as new fossils are found.",
    textAlternative:
      "Several branches overlap in time rather than replacing each other in a single line. Approximate ranges: Sahelanthropus about 7 to 6 million years ago, a possible early hominin. Australopithecus species, roughly 4.2 to 2 million years ago. Paranthropus, roughly 2.7 to 1.2 million years ago. Homo erectus, roughly 1.9 million to about 100,000 years ago. Neanderthals, roughly 400,000 to 40,000 years ago. Homo sapiens, from at least about 300,000 years ago to today. Several of these groups lived at the same time as each other.",
    sourceIds: ["si-intro-human-evolution", "si-sahelanthropus", "si-300k"],
    // Ranges are summarised from the Smithsonian species pages; flagged for range-by-range check in Phase 5.
  },
  {
    id: "dispersal-map",
    title: "Out of Africa, more than once",
    kind: "diagram",
    caption: "A schematic map of Homo sapiens dispersals. Routes and dates are simplified and some are debated.",
    textAlternative:
      "Homo sapiens originated in Africa, with early fossils from Morocco, Ethiopia and South Africa, suggesting a pan-African origin. Some early groups reached Southwest Asia more than 100,000 years ago. A major, widely successful dispersal from Africa took place roughly 70,000 to 50,000 years ago, after which people spread across Asia, reached Australia by at least about 50,000 years ago (some estimates are earlier), entered Europe and met Neanderthals there, and later reached the Americas, by at least about 15,000 years ago and possibly earlier. Along the way, populations interbred with Neanderthals and Denisovans.",
    sourceIds: ["nhm-homo-sapiens", "hublin-2017-irhoud", "green-2010-neandertal"],
  },

  /* 7. Civilisation */
  {
    id: "independent-origins",
    title: "Farming began in many places",
    kind: "diagram",
    caption: "Some of the regions where plants or animals were domesticated independently. Dates are approximate starting points, and each transition took centuries to millennia.",
    textAlternative:
      "Southwest Asia (the Fertile Crescent): wheat, barley, lentils, sheep and goats, from roughly 11,000 to 10,000 years ago. China: rice in the Yangtze region and millets in the north, from roughly 9,000 years ago. Mesoamerica: maize, beans and squash, with squash from about 10,000 years ago and maize from about 9,000 years ago. South America: potatoes, quinoa and llamas. Africa: sorghum, pearl millet and yams. New Guinea: taro and bananas. Eastern North America: sunflowers and other seed crops. Each began independently, using local plants and animals.",
    sourceIds: ["larson-2014-domestication", "fuller-2014-convergent", "maize-2016", "pearl-millet-2018"],
  },
  {
    id: "writing-systems",
    title: "Writing was invented more than once",
    kind: "diagram",
    caption: "Approximate earliest dates for some writing systems widely regarded as independent inventions. Scholars debate exact dates and, in some cases, independence.",
    textAlternative:
      "Mesopotamia, proto-cuneiform: around 3200 BCE, first used for administrative records. Egypt, hieroglyphs: around the same time, late 4th millennium BCE. China, oracle-bone inscriptions of the late Shang dynasty: around 1200 BCE. Mesoamerica: several scripts, with early examples from the first millennium BCE and the Maya script developing later. The Indus script, used from about 2600 BCE, has not been deciphered, and whether it represents full writing is debated.",
    sourceIds: ["met-origins-writing", "unesco-yinxu", "met-monte-alban", "bm-hieroglyphs"],
  },

  /* 8. Ideas */
  {
    id: "text-evidence-layers",
    title: "Four different questions about an ancient text",
    kind: "diagram",
    caption: "Historians separate these questions because each needs a different kind of evidence.",
    textAlternative:
      "First question: when was the text composed? This is often estimated from language, references and context, and may be debated. Second: how was it transmitted? Many texts were passed on orally or recopied many times. Third: what is the oldest surviving copy? This can be dated by materials, handwriting and sometimes radiocarbon, and it is often centuries younger than the composition. Fourth: how has it been interpreted? Readers in different times and traditions have understood it differently. None of these answers, on its own, tells us whether supernatural claims in a text are true; that is a matter of faith and philosophy rather than historical method.",
    sourceIds: ["dss-intro", "ox-bakhshali"],
  },
  {
    id: "knowledge-network",
    title: "Knowledge travelled",
    kind: "diagram",
    caption: "A few examples of ideas moving between regions. Real exchange was far denser and ran in many directions.",
    textAlternative:
      "Place-value numerals with a zero symbol developed in South Asia, passed into the Arabic-speaking world and later into Europe. Greek, Persian and Indian works were translated into Arabic in Abbasid Baghdad and elsewhere, then into Latin centuries later. Paper-making spread from China westward along trade routes. Woodblock printing in East Asia produced dated printed books centuries before movable-type printing spread in Europe. Scholars in places such as Timbuktu copied and debated manuscripts on law, astronomy and medicine.",
    sourceIds: ["ox-bakhshali", "britannica-bayt-al-hikmah", "bl-diamond-sutra", "loc-timbuktu"],
  },

  /* 9. World we built */
  {
    id: "communication-chain",
    title: "From marks on clay to global networks",
    kind: "diagram",
    caption: "A few milestones in recording and sharing information. Dates are approximate.",
    textAlternative:
      "Around 3200 BCE: early writing on clay tablets in Mesopotamia. 868 CE: the earliest complete dated printed book, the Diamond Sutra, printed from woodblocks in China. 1450s: Gutenberg's movable-type press in Mainz. 1830s to 1840s: electric telegraphs carry messages almost instantly over long distances. 1940s: early electronic computers. 1969: the first ARPANET link. 1989: Tim Berners-Lee proposes the World Wide Web at CERN. 2010s to 2020s: machine-learning systems trained on vast datasets become widely used.",
    sourceIds: ["met-origins-writing", "bl-diamond-sutra", "loc-gutenberg", "chm-timeline", "cern-web"],
    // Telegraph and ARPANET dates: flagged for a dedicated source in Phase 5.
  },
  {
    id: "how-ai-works",
    title: "How a modern AI model works, simply",
    kind: "diagram",
    caption: "A simplified outline. Real systems differ in many details.",
    textAlternative:
      "Step 1, data: a system is given very large numbers of examples, such as text, images or measurements. Step 2, training: it adjusts millions or billions of internal numbers so that its outputs better match patterns in the examples. Step 3, use: given new input, it produces an output based on those learned patterns, such as a prediction, a label or a passage of text. Limits: it reflects the data it was trained on, including gaps and biases; it can produce confident but wrong answers; and it does not by itself understand or check the truth of what it produces.",
    sourceIds: ["nist-ai-rmf"],
  },

  /* 10. You */
  {
    id: "lifetime-scale",
    title: "If all of history were one human lifetime",
    kind: "data",
    caption: "The 13.8-billion-year history of the universe compressed into 80 years. Calculated from the dates used in this exhibition; all are approximate.",
    textAlternative:
      "Scale: 80 years stands for 13.8 billion years, so each year of the lifetime stands for about 172 million real years. On that scale, Earth forms when the person is about 53 years and 8 months old. The earliest widely accepted evidence of life appears at about age 59 and 8 months. Non-avian dinosaurs die out about four and a half months before the 80th birthday. Homo sapiens appears about 15 hours before it. The earliest known writing appears about 16 minutes before it. A real 80-year human life takes up about the last 15 seconds.",
    sourceIds: ["planck-2018-params", "usgs-age-earth", "djokic-2017-hot-springs", "renne-2013", "hublin-2017-irhoud", "met-origins-writing"],
  },
];

const byId = new Map(exhibits.map((e) => [e.id, e]));

export function getExhibit(id: string): ExhibitDefinition | undefined {
  return byId.get(id);
}
