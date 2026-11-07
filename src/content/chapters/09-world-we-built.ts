import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("world-we-built")!,
  subtitle: "Methods, machines, energy and networks, and what they cost",
  opening: "Our biology barely changed. What changed was what we could build on each other's work.",
  orientation: {
    when: "From roughly the 1500s CE to the present",
    where: "Worldwide, but unevenly",
    scale: "From a few million people with printed books to eight billion connected by global networks",
  },
  intro:
    "In the last few centuries, human knowledge and technology have changed faster than ever before. That acceleration was not caused by a sudden change in human brains. It grew from cumulative culture, writing, institutions, trade, energy and communication, and it brought both enormous benefits and serious harms.",
  timeStart: 500,
  timeEnd: 0,
  sections: [
    {
      id: "why-acceleration",
      title: "Why change sped up",
      blocks: [
        {
          type: "paragraph",
          text: "People 500 years ago were biologically much like us. What changed was the scale of [[cumulative-culture]]. Printing made texts cheaper and more uniform. Universities, scientific societies and journals created communities that shared, checked and built on each other's results. Expanding trade connected regions and moved goods, people and ideas. Above all, new sources of energy multiplied what human and animal muscle could do.",
          sourceIds: ["loc-gutenberg", "owid-energy-200"],
        },
        { type: "exhibit", exhibitId: "communication-chain" },
      ],
    },
    {
      id: "methods",
      title: "New ways of knowing",
      blocks: [
        {
          type: "paragraph",
          text: "In 1610, Galileo published telescope observations of the Moon and of moons orbiting Jupiter. Instruments like the telescope and microscope revealed worlds invisible to the naked eye. Over the following centuries, [[scientific-method|scientific methods]] matured: careful measurement, controlled experiments, mathematical models, publication, attempts to replicate results and open criticism by other experts, including [[peer-review]].",
          sourceIds: ["museogalileo-sidereus", "nasa-planetary-motion"],
        },
        {
          type: "paragraph",
          text: "These methods are powerful because they are designed to catch mistakes, including the investigator's own. They do not make scientists infallible, and science has often been entangled with the prejudices and politics of its time. But over time, the practice of testing ideas against evidence has corrected many errors.",
        },
      ],
    },
    {
      id: "energy-and-industry",
      title: "Energy and industry",
      kicker: "From the 1700s",
      blocks: [
        {
          type: "paragraph",
          text: "Steam engines, improved by James Watt and others in the 1700s, turned the energy stored in coal into mechanical work. [[industrialisation|Industrialisation]] began in Britain and spread, unevenly, across the world. Later came oil, electricity, the internal combustion engine and, in the twentieth century, nuclear power and modern renewables.",
          sourceIds: ["asme-watt"],
        },
        {
          type: "paragraph",
          text: "Global energy use has grown many times over in the last two centuries, mostly from fossil fuels. Estimates for earlier years are reconstructions with considerable uncertainty, but the overall pattern of steep growth is clear.",
          sourceIds: ["owid-energy-200"],
          review: "Replace this paragraph with an accessible chart of the Our World in Data series once the data is imported and checked.",
        },
      ],
    },
    {
      id: "health",
      title: "Longer, healthier lives",
      blocks: [
        {
          type: "paragraph",
          text: "Understanding that many diseases are caused by microbes led to clean water supplies, sewers, antiseptic surgery, vaccines and antibiotics. Global average life expectancy has more than doubled since 1900, largely because far fewer children now die young. Those gains have not been shared equally between or within countries.",
          sourceIds: ["owid-life-expectancy", "owid-microbes"],
        },
      ],
    },
    {
      id: "computers-and-networks",
      title: "Computers and networks",
      blocks: [
        {
          type: "paragraph",
          text: "Electronic computers emerged in the 1940s. Transistors and integrated circuits made them smaller, cheaper and vastly more powerful. Computer networks followed, and in 1989 Tim Berners-Lee, working at CERN, proposed the system that became the World Wide Web.",
          sourceIds: ["chm-timeline", "cern-web"],
        },
        {
          type: "paragraph",
          text: "Today, billions of people carry networked computers in their pockets. Information that once took months to cross an ocean now crosses it in a fraction of a second.",
        },
      ],
    },
    {
      id: "ai",
      title: "Artificial intelligence, without the hype",
      blocks: [
        {
          type: "paragraph",
          text: "Modern artificial intelligence mostly means [[machine-learning]]: systems trained on large amounts of data to perform tasks such as prediction, classification, recognising patterns in images or sound, and generating text or pictures. A [[language-model]] learns statistical patterns in text and uses them to produce new text.",
          sourceIds: ["nist-ai-rmf"],
        },
        { type: "exhibit", exhibitId: "how-ai-works" },
        {
          type: "paragraph",
          text: "Capabilities vary widely between systems and tasks. AI systems can be very useful, but they can also be wrong, biased or misused, and their effects on work, information and power are still unfolding. Governments, companies and researchers are developing standards and laws to manage these risks; how best to govern AI is an open and actively debated question.",
          sourceIds: ["nist-ai-rmf"],
        },
      ],
    },
    {
      id: "costs",
      title: "Uneven progress, real costs",
      blocks: [
        {
          type: "paragraph",
          text: "The modern world was not built evenly or innocently. Industrialisation and global trade were bound up with colonialism, slavery and the exploitation of labour and land. Technologies that improved many lives were also used in war. Access to their benefits remains deeply unequal.",
          review: "Add sources from history institutions on colonialism, slavery and industrialisation.",
        },
        {
          type: "paragraph",
          text: "Human activity now shapes the Earth system itself. According to the Intergovernmental Panel on Climate Change, human activities, principally through emissions of greenhouse gases, have unequivocally caused global warming. Land use, pollution and biodiversity loss are also reshaping ecosystems worldwide.",
          sourceIds: ["ipcc-ar6-syr-spm"],
        },
        {
          type: "pullquote",
          text: "Our tools now let us study the universe, alter the planet and extend our own abilities. That power brings responsibility.",
        },
      ],
    },
  ],
  evidence: [
    {
      id: "publications",
      title: "Scientific publications and historical documents",
      what: "Journals, letters, notebooks, government records and books.",
      helpsUs: "Documents who discovered what, when, and how ideas were debated and accepted.",
      howStudied: "Historical research in archives and libraries.",
      limitations: "Records favour those with access to print and institutions; many contributors, including technicians and colonised peoples, are under-recorded.",
      status: "strong-evidence",
      sourceIds: ["museogalileo-sidereus", "cern-web"],
    },
    {
      id: "artefacts",
      title: "Patents and technical artefacts",
      what: "Surviving machines, instruments, prototypes and patent filings.",
      helpsUs: "Shows how technologies actually worked and changed.",
      howStudied: "Museum conservation, reconstruction and technical analysis.",
      limitations: "Patents record claims, not always practical use; credit for inventions is often shared or disputed.",
      status: "strong-evidence",
      sourceIds: ["asme-watt", "chm-timeline"],
    },
    {
      id: "datasets",
      title: "Instrument records and datasets",
      what: "Long-term measurements such as temperature records, atmospheric CO₂ and energy statistics.",
      helpsUs: "Quantifies change over time.",
      howStudied: "Standardised instruments, quality control and statistical analysis.",
      limitations: "Older records are sparser and need careful adjustment; pre-modern values are reconstructions.",
      status: "well-established",
      sourceIds: ["ipcc-ar6-syr-spm", "owid-energy-200"],
    },
    {
      id: "demographic",
      title: "Environmental and demographic records",
      what: "Census data, parish records, health statistics and environmental surveys.",
      helpsUs: "Tracks population, life expectancy and environmental change.",
      howStudied: "Demography, epidemiology and environmental science.",
      limitations: "Coverage is patchy before the twentieth century and for many regions.",
      status: "strong-evidence",
      sourceIds: ["owid-life-expectancy"],
    },
  ],
  goDeeper: [
    {
      id: "not-biology",
      title: "Why it isn't about bigger brains",
      blocks: [
        {
          type: "paragraph",
          text: "People living 10,000 years ago were anatomically modern humans, and there is no evidence of a major change in human cognitive ability during recorded history. Technological acceleration is better explained by cumulative culture, larger and more connected populations, institutions that store and transmit knowledge, and access to energy.",
          review: "Add an anthropology source for this framing.",
        },
      ],
    },
  ],
  transition: "All of this, from the first light to the network in your pocket, leads to a single place and time: here, now, you.",
};
