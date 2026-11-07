import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("human-story")!,
  subtitle: "A branching family history, and a species that spread across the world",
  opening: "Humanity did not appear all at once. We are the last surviving branch of a crowded family tree.",
  orientation: {
    when: "From about 7 million years ago to the spread of Homo sapiens across the world",
    where: "Beginning in Africa, then across Asia, Europe, Australia and the Americas",
    scale: "Hundreds of thousands of generations",
  },
  intro:
    "Humans are primates, part of the great ape family. Our story is not a march from ape to human, but a bush of related species, most of which died out. One of them, ours, eventually spread across the globe.",
  timeStart: 7_000_000,
  timeEnd: 12_000,
  sections: [
    {
      id: "our-place",
      title: "Our place among the apes",
      blocks: [
        {
          type: "paragraph",
          text: "Humans are [[primate|primates]]. Among living animals, our closest relatives are chimpanzees and bonobos, followed by gorillas and orangutans. DNA comparisons and anatomy both show this.",
          sourceIds: ["si-intro-human-evolution"],
        },
        {
          type: "callout",
          tone: "misconception",
          title: "Humans did not evolve from chimpanzees",
          text: "Humans and chimpanzees share a common ancestor that lived several million years ago. Since then, both lineages have kept evolving. Chimpanzees are our cousins, not our ancestors.",
          sourceIds: ["si-faq"],
        },
      ],
    },
    {
      id: "a-crowded-tree",
      title: "A crowded family tree",
      blocks: [
        {
          type: "paragraph",
          text: "[[hominin|Hominins]] are humans and the extinct species more closely related to us than to chimpanzees. Some of the oldest proposed hominin fossils are around 6 to 7 million years old, such as *Sahelanthropus* from Chad. Whether these earliest species are truly on the human side of the tree is debated, because the fossils are few and fragmentary.",
          sourceIds: ["si-sahelanthropus"],
        },
        {
          type: "paragraph",
          text: "Later came the australopiths, including the famous 'Lucy' skeleton, who walked upright on two legs but still had small brains and arms suited to climbing. Over time, the record shows many species, often living at the same time, sometimes in the same regions. Most of these branches ended without descendants.",
          sourceIds: ["si-intro-human-evolution"],
        },
        { type: "exhibit", exhibitId: "hominin-bush" },
        {
          type: "callout",
          tone: "misconception",
          title: "Not a march of progress",
          text: "The familiar image of a line of figures walking from a crouching ape to an upright modern human is misleading. There was no single line, no goal, and no 'missing link'. Instead there were many experiments in being a hominin, overlapping in time.",
          sourceIds: ["si-intro-human-evolution", "ue-trees-not-ladders"],
        },
      ],
    },
    {
      id: "tools",
      title: "Stone tools",
      kicker: "At least about 3.3 million years ago",
      blocks: [
        {
          type: "paragraph",
          text: "The oldest known stone tools, found at Lomekwi in Kenya, are about 3.3 million years old. They predate the earliest known fossils of our own genus, *Homo*, which suggests that tool-making began among earlier hominins.",
          sourceIds: ["harmand-2015-lomekwi"],
        },
        {
          type: "paragraph",
          text: "Later traditions changed slowly. Simple sharp flakes were followed, from about 1.7 million years ago, by carefully shaped hand axes, and much later by tools made in planned sequences of steps. Each tradition lasted for hundreds of thousands of years, a reminder of how gradual early technological change was.",
          sourceIds: ["si-intro-human-evolution"],
          review: "Add a source for the timing of Acheulean hand axes and later stone-tool traditions.",
        },
      ],
    },
    {
      id: "fire-and-sharing",
      title: "Fire, food and each other",
      blocks: [
        {
          type: "paragraph",
          text: "Controlling fire changed hominin life: warmth, protection, light after dark and cooked food that is easier to digest. Evidence of fire around a million years ago comes from Wonderwerk Cave in South Africa, but when fire use became habitual and widespread is still debated.",
          sourceIds: ["pnas-wonderwerk", "pnas-fire-europe"],
        },
        {
          type: "paragraph",
          text: "Archaeologists also see signs of cooperation: shared butchery of large animals, care for injured individuals, and transport of materials over long distances. These are inferred from the evidence that survives, so they give only a partial view of how early humans lived together.",
          review: "Add specific archaeological sources for food sharing and care for the injured.",
        },
      ],
    },
    {
      id: "our-species",
      title: "Our species appears",
      kicker: "At least about 300,000 years ago",
      blocks: [
        {
          type: "paragraph",
          text: "Based on current fossil evidence, *Homo sapiens* emerged in Africa around 300,000 years ago. Fossils from Jebel Irhoud in Morocco, dated to about that time, show faces much like ours with braincases that were still longer and lower. Together with other African fossils, they suggest our species took shape across the continent rather than in a single place.",
          sourceIds: ["hublin-2017-irhoud", "si-300k", "nhm-homo-sapiens"],
        },
        {
          type: "paragraph",
          text: "Modern human anatomy, and the full range of modern behaviour, appear to have developed gradually over a long period. Comparing the minds of ancient people with our own is difficult: thoughts do not fossilise, so researchers infer them cautiously from objects and their contexts.",
          sourceIds: ["nhm-homo-sapiens"],
        },
      ],
    },
    {
      id: "spreading",
      title: "Spreading across the world",
      blocks: [
        {
          type: "paragraph",
          text: "Groups of *Homo sapiens* moved out of Africa more than once. Some early dispersals left few lasting descendants. A later expansion, within roughly the last 60,000 years, gave rise to most of the ancestry of people living outside Africa today. People reached Australia by around 42,000 years ago, and possibly as early as 65,000. They reached the Americas by about 15,000 years ago, and footprints in North America suggest people were there 23,000 to 21,000 years ago. Both dates are active research areas.",
          sourceIds: ["nhm-spread-out-of-africa", "nhm-homo-sapiens"],
        },
        { type: "exhibit", exhibitId: "dispersal-map" },
        {
          type: "paragraph",
          text: "Our ancestors were not alone. They met other humans, including [[neanderthal|Neanderthals]] and [[denisovan|Denisovans]], and sometimes had children with them. Many people living today carry a small percentage of Neanderthal DNA, and some populations, especially in Oceania, also carry Denisovan DNA.",
          sourceIds: ["green-2010-neandertal", "nobel-2022", "denisovan-review-2023", "si-ancient-dna"],
        },
      ],
    },
    {
      id: "symbols-and-language",
      title: "Symbols, art and language",
      blocks: [
        {
          type: "paragraph",
          text: "Over tens of thousands of years, the archaeological record shows growing signs of symbolic behaviour: pigments, shell beads, engraved patterns, burials and, later, cave paintings and carved figurines. Some of these predate the spread of our species out of Africa, and some were made by Neanderthals.",
          sourceIds: ["nhm-homo-sapiens"],
          review: "Add sources for specific early symbolic artefacts (e.g. Blombos Cave) and Neanderthal art.",
        },
        {
          type: "callout",
          tone: "uncertainty",
          title: "When did language begin?",
          text: "There is no single, agreed date for the origin of language. Spoken words leave no fossils. Researchers combine anatomy, genetics, archaeology and studies of living languages, and their estimates range widely. Language may have developed gradually rather than appearing at one moment.",
        },
        {
          type: "paragraph",
          text: "Perhaps the most powerful human trait is [[cumulative-culture]]. Each generation learns from the last, adds a little, and passes it on. Over many generations, that adds up to knowledge and skills no single person could invent alone.",
        },
      ],
    },
  ],
  evidence: [
    {
      id: "hominin-fossils",
      title: "Fossils and comparative anatomy",
      what: "Skulls, teeth, skeletons and footprints of hominins, compared with living apes and humans.",
      helpsUs: "Shows when features like upright walking and larger brains appeared, and how species were related.",
      howStudied: "Excavation, measurement, CT scanning and statistical comparison.",
      limitations: "The record is sparse; a whole species may be known from a few fragments, and classification is often debated.",
      status: "strong-evidence",
      sourceIds: ["si-intro-human-evolution", "si-sahelanthropus"],
    },
    {
      id: "archaeology",
      title: "Archaeological sites and artefacts",
      what: "Stone tools, hearths, butchered bones, ornaments, art and burials.",
      helpsUs: "Reveals behaviour: technology, diet, use of fire, symbolism and movement across landscapes.",
      howStudied: "Careful excavation, recording of layers and context, and laboratory analysis.",
      limitations: "Perishable materials such as wood, fibre and skin rarely survive, so the record is biased towards stone and bone.",
      status: "strong-evidence",
      sourceIds: ["harmand-2015-lomekwi", "pnas-wonderwerk"],
    },
    {
      id: "ancient-dna",
      title: "Ancient DNA and population genetics",
      what: "DNA recovered from fossils and sediments, and genetic variation in living people.",
      helpsUs: "Revealed interbreeding with Neanderthals, identified Denisovans, and traces population movements.",
      howStudied: "Sequencing degraded DNA in clean laboratories and comparing genomes statistically.",
      limitations: "DNA rarely survives beyond a few hundred thousand years, and degrades faster in warm climates such as much of Africa.",
      status: "strong-evidence",
      sourceIds: ["green-2010-neandertal", "nobel-2022", "si-ancient-dna"],
    },
    {
      id: "archaeological-dating",
      title: "Dating methods",
      what: "Techniques such as argon–argon, uranium-series, luminescence and radiocarbon dating.",
      helpsUs: "Places fossils and artefacts in time, each method suited to a different age range.",
      howStudied: "Laboratory measurement of samples from the same layers as finds.",
      limitations: "Each method has an age range and assumptions; results are reported with uncertainty and cross-checked where possible.",
      status: "well-established",
      sourceIds: ["si-dating"],
    },
  ],
  goDeeper: [
    {
      id: "what-dna-can-tell",
      title: "What DNA can and can't tell us",
      blocks: [
        {
          type: "paragraph",
          text: "Comparing genomes can reveal who is related to whom, when populations split or mixed, and how large ancestral populations were. It cannot, on its own, tell us how people lived, what they believed or what languages they spoke. Genetic ancestry is also not the same as cultural or ethnic identity.",
          sourceIds: ["nobel-2022"],
        },
      ],
    },
  ],
  transition: "By the end of the last Ice Age, humans lived on every continent except Antarctica. In several places, people began to stay put.",
};
