import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("civilisation")!,
  subtitle: "Farming, cities and writing, invented again and again",
  opening: "There was no single birthplace of civilisation. There were many.",
  orientation: {
    when: "From about 12,000 years ago, after the last Ice Age, to early cities and states",
    where: "Southwest Asia, China, South Asia, Africa, the Americas, New Guinea and beyond",
    scale: "From villages of a few dozen people to cities of tens of thousands",
  },
  intro:
    "As the climate warmed at the end of the last Ice Age, people in several parts of the world began, independently, to cultivate plants and manage animals. Over thousands of years, some of those communities grew into towns, cities and states.",
  timeStart: 12_000,
  timeEnd: 2_000,
  sections: [
    {
      id: "foragers-to-farmers",
      title: "From foraging to farming",
      blocks: [
        {
          type: "paragraph",
          text: "For most of human history, people lived by foraging: gathering plants, hunting and fishing. [[domestication|Domestication]] began independently in several regions, starting around 12,000 to 10,000 years ago in some areas. In Southwest Asia, people cultivated wheat, barley and lentils and herded sheep and goats. In China, rice and millets were domesticated. In Mesoamerica, squash and maize; in the Andes, potatoes and llamas; in Africa, sorghum, pearl millet and yams; in New Guinea, taro and bananas.",
          sourceIds: ["larson-2014-domestication", "fuller-2014-convergent", "pearl-millet-2018", "maize-2016"],
        },
        { type: "exhibit", exhibitId: "independent-origins" },
        {
          type: "callout",
          tone: "misconception",
          title: "A slow, uneven change",
          text: "Farming was not a single invention that spread from one place, and it did not instantly replace foraging. Domestication often took centuries to thousands of years. Many communities combined farming, herding, foraging and fishing for a long time, and some chose not to farm at all.",
          sourceIds: ["larson-2014-domestication", "fuller-2014-convergent"],
        },
        {
          type: "paragraph",
          text: "Some of the most striking early monuments were built before farming was established. At Göbekli Tepe in southeastern Türkiye, people built large stone enclosures with carved pillars more than 11,000 years ago, while still largely living by hunting and gathering.",
          sourceIds: ["unesco-gobekli"],
        },
      ],
    },
    {
      id: "settling-down",
      title: "Settling down",
      blocks: [
        {
          type: "paragraph",
          text: "Where farming took hold, many communities became more permanent. Stored grain allowed people to survive lean seasons, and populations grew. Not everyone needed to produce food, so some people specialised as potters, builders, traders or religious leaders.",
        },
        {
          type: "paragraph",
          text: "These changes came with costs. Archaeological studies of skeletons from some early farming communities show signs of poorer nutrition and more disease than among their foraging predecessors, as diets narrowed and people lived closer together and near animals. Inequality in wealth and power also tended to grow.",
          review: "Add bioarchaeological sources on health changes with early farming.",
        },
      ],
    },
    {
      id: "cities",
      title: "The first cities",
      blocks: [
        {
          type: "paragraph",
          text: "Cities developed at different times in different regions. In southern Mesopotamia, Uruk grew into one of the world's earliest cities in the fourth millennium BCE, with monumental temples and a population that may have reached tens of thousands.",
          sourceIds: ["met-uruk"],
        },
        {
          type: "paragraph",
          text: "In the Indus Valley of present-day Pakistan and northwest India, cities such as Mohenjo-daro and Harappa flourished from around 2500 BCE, with planned street grids, standardised bricks and sophisticated drainage. In China, the late Shang capital at Yinxu was a major centre by around 1300 BCE. In Mesoamerica, Monte Albán and later Teotihuacan became large urban centres.",
          sourceIds: ["unesco-moenjodaro", "unesco-yinxu", "met-monte-alban"],
        },
        {
          type: "paragraph",
          text: "Large settlements appeared in Africa as well, including along the Nile and, later, at places such as Jenne-jeno in the Niger valley, which grew without a single obvious ruling centre. Cities did not all follow the same plan or the same route to complexity.",
          review: "Add a source for Jenne-jeno and African urbanism.",
        },
      ],
    },
    {
      id: "writing",
      title: "Writing things down",
      kicker: "From around 3100 BCE in Mesopotamia",
      blocks: [
        {
          type: "paragraph",
          text: "The earliest known writing comes from Mesopotamia, around 3100 BCE, and may have begun somewhat earlier. These first tablets were largely administrative: records of grain, livestock, labour and rations, pressed into clay. Over centuries, the system developed into [[cuneiform]], used for laws, letters, literature, science and religion.",
          sourceIds: ["met-origins-writing"],
        },
        {
          type: "paragraph",
          text: "Writing was invented independently more than once. Egyptian hieroglyphs appeared at roughly the same time as Mesopotamian writing. Chinese writing is attested on Shang dynasty oracle bones from around 1200 BCE. In Mesoamerica, several writing systems developed, including the Maya script. Many societies kept detailed records without writing as we know it, such as the knotted-cord khipu of the Andes.",
          sourceIds: ["bm-hieroglyphs", "unesco-yinxu", "met-monte-alban"],
          review: "Add sources for khipu and the Maya script.",
        },
        { type: "exhibit", exhibitId: "writing-systems" },
        {
          type: "callout",
          tone: "note",
          title: "About dates like 'BCE'",
          text: "This exhibition uses [[bce-ce|BCE and CE]] for calendar dates. It is one convention among many. The people of Uruk, Mohenjo-daro or Yinxu kept their own calendars and would not have recognised these labels.",
        },
      ],
    },
    {
      id: "trade-and-states",
      title: "Trade, law and states",
      blocks: [
        {
          type: "paragraph",
          text: "Cities depended on exchange. Long-distance trade moved materials such as copper, tin, lapis lazuli, obsidian, shells and textiles across hundreds or thousands of kilometres. Indus seals have been found in Mesopotamia, for example, evidence of contact between the two regions.",
          review: "Add an archaeological source for Indus–Mesopotamia trade.",
        },
        {
          type: "paragraph",
          text: "As societies grew, they developed new institutions: rulers and bureaucracies, armies, taxes, and written law codes. These made large-scale cooperation possible, and also made new forms of coercion, conflict and inequality possible. Historians avoid describing this as a simple story of progress.",
        },
      ],
    },
  ],
  evidence: [
    {
      id: "settlements",
      title: "Archaeological settlements and material culture",
      what: "Remains of houses, temples, walls, streets, tools, pottery and burials.",
      helpsUs: "Shows how people lived, how settlements grew and how societies were organised.",
      howStudied: "Excavation, survey, remote sensing and analysis of artefacts in their context.",
      limitations: "Sites survive unevenly, and many have been eroded, built over or looted; interpretation of social organisation is often debated.",
      status: "strong-evidence",
      sourceIds: ["unesco-moenjodaro", "met-uruk", "unesco-gobekli"],
    },
    {
      id: "domestication-evidence",
      title: "Seeds, animal remains and domestication evidence",
      what: "Charred grains, plant remains, animal bones and ancient DNA from early farming sites.",
      helpsUs: "Tracks when and where plants and animals changed under human management.",
      howStudied: "Archaeobotany, zooarchaeology, genetics and radiocarbon dating.",
      limitations: "Early domestication leaves subtle traces, so the start of cultivation is often earlier than visible genetic change.",
      status: "strong-evidence",
      sourceIds: ["larson-2014-domestication", "fuller-2014-convergent"],
    },
    {
      id: "inscriptions",
      title: "Inscriptions, tablets and manuscripts",
      what: "Written records on clay, stone, bone, papyrus and other materials.",
      helpsUs: "Gives direct evidence of administration, law, belief and literature in the words of the time.",
      howStudied: "Decipherment, translation and comparison of texts in their archaeological context.",
      limitations: "Written records often reflect the concerns of elites; some scripts, such as the Indus script, remain undeciphered.",
      status: "strong-evidence",
      sourceIds: ["met-origins-writing", "unesco-yinxu"],
    },
    {
      id: "radiocarbon",
      title: "Radiocarbon dating and stratigraphy",
      what: "Dates from charcoal, seeds and bone, combined with the order of excavated layers.",
      helpsUs: "Builds chronologies for early farming and cities.",
      howStudied: "Accelerator mass spectrometry, calibrated against tree-ring and other records.",
      limitations: "Radiocarbon dates need calibration and must come from securely associated material.",
      status: "well-established",
      sourceIds: ["oxford-c14", "nps-archaeology-dating"],
    },
  ],
  goDeeper: [
    {
      id: "why-farm",
      title: "Why did people start farming?",
      blocks: [
        {
          type: "paragraph",
          text: "There is no single accepted answer. Suggested factors include a warmer, more stable climate after the Ice Age, growing populations, social and ritual gatherings, and the gradual effects of people repeatedly harvesting and replanting wild species. The balance probably differed from region to region.",
          sourceIds: ["larson-2014-domestication"],
        },
      ],
    },
  ],
  transition: "Once people could store food, live in cities and record information, they could also preserve ideas, and argue about them across generations.",
};
