import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("diversification")!,
  subtitle: "A branching history of oceans, land, loss and recovery",
  opening: "Life's history is not a ladder. It is a tree, still growing in every direction.",
  orientation: {
    when: "Roughly 1 billion to 250 million years ago, focusing on the last 540 million years",
    where: "First in the oceans, then along shorelines, rivers and continents",
    scale: "From single cells to forests tens of metres tall",
  },
  intro:
    "Over hundreds of millions of years, life branched into an astonishing variety of forms. Some lineages flourished, many vanished, and survivors repeatedly filled the empty spaces left behind.",
  timeStart: 1_000_000_000,
  timeEnd: 252_000_000,
  sections: [
    {
      id: "how-change-happens",
      title: "How life changes",
      blocks: [
        {
          type: "lead",
          text: "Evolution is not a plan. It is what happens when living things reproduce with variation in a changing world.",
        },
        {
          type: "list",
          items: [
            "Variation: individuals differ, partly because of differences in their genes.",
            "Inheritance: many of those differences are passed to offspring.",
            "[[mutation|Mutation]]: copying errors and other changes add new variation in every generation.",
            "[[natural-selection|Natural selection]]: variants that help survival and reproduction in a given environment tend to become more common.",
            "[[genetic-drift|Genetic drift]]: chance alone also changes which variants spread, especially in small populations.",
            "Extinction: lineages that cannot persist disappear, which reshapes the tree.",
          ],
          sourceIds: ["ue-misconceptions"],
        },
        {
          type: "paragraph",
          text: "Over many generations, populations that become separated can change in different directions until they form separate species. Trace any two living species back far enough and you reach a [[common-ancestor]]. All known life is connected in one family tree.",
          sourceIds: ["ue-trees-not-ladders"],
        },
        { type: "exhibit", exhibitId: "tree-not-ladder" },
        {
          type: "callout",
          tone: "misconception",
          title: "No organism is 'more evolved'",
          text: "A bacterium living today has an ancestry exactly as long as yours. Evolution does not aim at humans or at complexity. Many lineages became simpler over time, and the most numerous organisms on Earth are still microbes.",
          sourceIds: ["ue-trees-not-ladders", "ue-misconceptions"],
        },
      ],
    },
    {
      id: "many-cells",
      title: "Many cells working together",
      blocks: [
        {
          type: "paragraph",
          text: "[[multicellularity|Multicellular life]] evolved more than once, in separate lineages including animals, plants, fungi and several groups of algae. Cells that stayed together could divide up work: some for feeding, some for protection, some for reproduction.",
          review: "Add a source for multiple independent origins of multicellularity.",
        },
        {
          type: "paragraph",
          text: "The first large, complex organisms in the fossil record appear in the Ediacaran Period, roughly 575 to 539 million years ago. Many of them were soft-bodied forms so unlike anything alive today that scientists still debate how they relate to later animals.",
          sourceIds: ["rom-burgess-explosion"],
        },
      ],
    },
    {
      id: "cambrian",
      title: "The Cambrian diversification",
      kicker: "About 539 to 487 million years ago",
      blocks: [
        {
          type: "paragraph",
          text: "In the Cambrian Period, the fossil record fills with animals: creatures with shells, legs, eyes and guts, including early relatives of insects, crabs, worms, molluscs and our own vertebrate ancestors. Exceptionally preserved sites, such as the Burgess Shale in Canada, even capture soft bodies.",
          sourceIds: ["nhm-cambrian", "rom-burgess-explosion"],
        },
        {
          type: "callout",
          tone: "misconception",
          title: "Not 'out of nowhere'",
          text: "The so-called Cambrian explosion unfolded over tens of millions of years and built on earlier animal life. Part of its suddenness is about preservation: hard shells and skeletons fossilise far more easily than soft bodies, so animals became much more visible in the rocks once they evolved hard parts.",
          sourceIds: ["rom-burgess-explosion"],
        },
      ],
    },
    {
      id: "onto-land",
      title: "Life moves onto land",
      blocks: [
        {
          type: "paragraph",
          text: "Moving from water to land was not one event but many, spread over more than 100 million years. Microbes and probably simple plants and fungi came first. Land plants gradually evolved waxy coatings, spores, internal plumbing and eventually roots, wood and seeds. By the Devonian Period, about 420 to 359 million years ago, the first forests had appeared.",
          sourceIds: ["nhm-trees", "ics-chart"],
        },
        {
          type: "paragraph",
          text: "Arthropods, the group that includes insects, spiders and millipedes, were among the earliest animals on land. Vertebrates followed. Fossils such as *Tiktaalik*, a Devonian fish with sturdy, limb-like fins, a flexible neck and lungs as well as gills, capture stages in the evolution of [[tetrapod|tetrapods]]: four-limbed animals.",
          sourceIds: ["ue-tetrapods", "nature-tiktaalik-news"],
        },
        {
          type: "paragraph",
          text: "From early tetrapods came amphibians, and from them the first animals to lay eggs with protective membranes, which freed them from returning to water to breed. Those early amniotes gave rise to the lineages that became reptiles, birds and mammals.",
          sourceIds: ["ue-tetrapods"],
        },
        { type: "exhibit", exhibitId: "geologic-period-strip" },
      ],
    },
    {
      id: "extinctions",
      title: "Loss and recovery",
      blocks: [
        {
          type: "paragraph",
          text: "Most species that have ever lived are now extinct. Extinction is a normal part of life's history, but five times in the last half-billion years it has been catastrophic. In a [[mass-extinction]], a large share of species disappear in a geologically short time, often linked to rapid changes in climate and ocean chemistry.",
          sourceIds: ["nhm-mass-extinction", "si-extinction-over-time"],
        },
        {
          type: "paragraph",
          text: "The largest, at the end of the Permian Period about 252 million years ago, wiped out the great majority of marine species. Massive volcanic eruptions in what is now Siberia are widely thought to have played a central role.",
          sourceIds: ["nhm-mass-extinction", "si-extinction-over-time"],
        },
        {
          type: "pullquote",
          text: "Each mass extinction closed some branches of the tree for ever, and opened space for others to grow.",
        },
      ],
    },
  ],
  evidence: [
    {
      id: "fossil-succession",
      title: "Fossil succession and transitional fossils",
      what: "Fossils found in a consistent order through rock layers worldwide, including forms with mixtures of older and newer features.",
      helpsUs: "Shows the sequence in which groups appeared and records intermediate stages, such as fish with limb-like fins.",
      howStudied: "Excavation, comparative description and placement within dated rock sequences.",
      limitations: "Fossilisation is rare and biased towards hard parts and certain environments; most species left no fossils.",
      status: "well-established",
      sourceIds: ["ue-chronology", "ue-tetrapods"],
    },
    {
      id: "comparative-anatomy",
      title: "Comparative anatomy",
      what: "Shared underlying structures in different organisms, such as the same arrangement of bones in a human arm, a bat wing and a whale flipper.",
      helpsUs: "Reveals common ancestry beneath very different ways of life.",
      howStudied: "Dissection, imaging and comparison of living and fossil organisms.",
      limitations: "Similar features can also evolve independently in unrelated groups, so anatomy is combined with other evidence.",
      status: "well-established",
      sourceIds: ["ue-trees-not-ladders"],
    },
    {
      id: "molecular-phylogenetics",
      title: "DNA and molecular phylogenetics",
      what: "Comparisons of DNA and protein sequences between species.",
      helpsUs: "Builds family trees independently of fossils, and these largely agree with anatomy and the fossil record.",
      howStudied: "Sequencing genomes and building statistical trees.",
      limitations: "Dating branch points uses molecular clocks that need fossil calibration and can carry large uncertainties.",
      status: "well-established",
      sourceIds: ["scitable-molecular-clock"],
    },
    {
      id: "stratigraphy-dating",
      title: "Stratigraphy and radiometric dating",
      what: "The ordering of rock layers combined with radiometric ages from volcanic layers within them.",
      helpsUs: "Places fossils and events on a numeric timeline, such as the start of the Cambrian about 539 million years ago.",
      howStudied: "Field mapping, correlating layers between regions, and dating volcanic ash beds.",
      limitations: "Not every layer can be dated directly; ages between dated layers are interpolated.",
      status: "well-established",
      sourceIds: ["ics-chart", "nps-relative-dating"],
    },
  ],
  goDeeper: [
    {
      id: "transitional-fossils",
      title: "What a transitional fossil is, and isn't",
      blocks: [
        {
          type: "paragraph",
          text: "A [[transitional-fossil]] shows a combination of features from an earlier and a later group. *Tiktaalik* is not necessarily the direct ancestor of four-legged animals; it is better seen as a close relative of that ancestor, showing what animals at that stage of the branching tree looked like.",
          sourceIds: ["ue-tetrapods"],
        },
      ],
    },
  ],
  transition: "After the greatest extinction of all, the survivors inherited a changed world. One group would come to dominate it.",
};
