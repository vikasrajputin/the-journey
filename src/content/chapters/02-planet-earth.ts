import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("planet-earth")!,
  subtitle: "How a cloud of dust became a living, restless world",
  opening: "Earth was not made for life. It became a place where life was possible.",
  orientation: {
    when: "About 4.6 to 4 billion years ago, with changes continuing to the present",
    where: "A spiral arm of the Milky Way, about two-thirds of the way out from its centre",
    scale: "Earth is about 12,700 kilometres across, and about 150 million kilometres from the Sun",
  },
  intro:
    "More than nine billion years after the Big Bang, in an unremarkable part of an ordinary galaxy, a cloud of gas and dust began to collapse. From it came the Sun, the planets, and the only world where we know life exists.",
  timeStart: 4_600_000_000,
  timeEnd: 4_000_000_000,
  sections: [
    {
      id: "a-collapsing-cloud",
      title: "A collapsing cloud",
      kicker: "About 4.6 billion years ago",
      blocks: [
        {
          type: "paragraph",
          text: "The Solar System formed from a rotating cloud of gas and dust about 4.6 billion years ago. As the cloud collapsed under its own gravity, it spun faster and flattened into a disc. Most of the material fell to the centre, where it became hot and dense enough for fusion: the Sun was born.",
          sourceIds: ["nasa-solar-system-form"],
        },
        {
          type: "paragraph",
          text: "That cloud already contained elements made by earlier generations of stars. Without them, there would be no rock, no metal and no water to build planets from.",
          sourceIds: ["nasa-star-stuff"],
        },
        { type: "exhibit", exhibitId: "solar-nebula-sequence" },
      ],
    },
    {
      id: "building-a-planet",
      title: "Building a planet by collision",
      blocks: [
        {
          type: "paragraph",
          text: "In the disc around the young Sun, dust grains stuck together and grew. Through [[accretion]], pebbles became boulders, boulders became bodies kilometres across, and those collided and merged into planets. Earth reached roughly its present size within tens of millions of years.",
          sourceIds: ["nasa-solar-system-form"],
        },
        {
          type: "paragraph",
          text: "We can date this remarkably well. Using [[radiometric-dating]] of meteorites, which are leftover fragments from the Solar System's formation, together with the oldest Earth and Moon rocks, scientists estimate that Earth is about 4.54 billion years old, give or take about 50 million years.",
          sourceIds: ["usgs-age-earth", "ncse-age-earth"],
        },
        {
          type: "keyFacts",
          items: [
            { value: "≈4.6 billion years", label: "Age of the Solar System" },
            { value: "≈4.54 billion years", label: "Age of Earth, ±1%" },
            { value: "≈4.4 billion years", label: "Age of the oldest known mineral grains from Earth: zircons from Western Australia" },
          ],
          sourceIds: ["nasa-solar-system-form", "usgs-age-earth", "wilde-2001-zircon"],
        },
      ],
    },
    {
      id: "a-world-of-fire",
      title: "A world of fire, and the birth of the Moon",
      blocks: [
        {
          type: "paragraph",
          text: "Young Earth was hot. Heat from collisions and from radioactive elements melted much of the planet. The early surface may have been, at times, an ocean of molten rock.",
          sourceIds: ["nasa-early-earth"],
        },
        {
          type: "paragraph",
          text: "The leading explanation for the Moon's origin is a giant impact. In this model, a body roughly the size of Mars collided with the young Earth, and debris thrown into orbit gathered to form the Moon. It explains much of what we know: the Moon's relatively small iron core, its chemical similarity to Earth's mantle, and the large spin of the Earth–Moon system.",
          sourceIds: ["nasa-moon-formation", "nhm-moon"],
        },
        {
          type: "callout",
          tone: "uncertainty",
          title: "A model, not an observation",
          text: "Nobody saw the Moon form. The giant-impact model is our best explanation of the evidence, and it is supported by rock samples brought back by the Apollo missions and by computer simulations. Details remain debated, including the size of the impactor and why Earth and Moon rocks are so chemically alike.",
          sourceIds: ["nasa-moon-formation", "nhm-moon"],
        },
      ],
    },
    {
      id: "layers",
      title: "Sorting into layers",
      blocks: [
        {
          type: "paragraph",
          text: "While Earth was largely molten, heavy iron and nickel sank towards the centre to form the core, and lighter rock rose to form the mantle and crust. This [[differentiation]] gave Earth the layered structure it has today, including a molten outer core whose motion generates the magnetic field that helps shield the surface from charged particles from the Sun.",
          sourceIds: ["usgs-interior"],
        },
        { type: "exhibit", exhibitId: "earth-cutaway" },
      ],
    },
    {
      id: "oceans-and-air",
      title: "Oceans and air",
      blocks: [
        {
          type: "paragraph",
          text: "As the surface cooled, water vapour released from inside the planet and delivered by impacts could condense. Tiny [[zircon]] crystals about 4.4 billion years old carry chemical hints that liquid water may have existed at the surface very early, though this interpretation is still discussed.",
          sourceIds: ["wilde-2001-zircon"],
        },
        {
          type: "paragraph",
          text: "The early atmosphere was very different from today's. It contained little or no free oxygen, and was probably dominated by gases such as carbon dioxide, nitrogen and water vapour. How much water came from Earth's own rocks and how much from asteroids or comets, and exactly when the first lasting oceans formed, are still active research questions.",
          sourceIds: ["nasa-early-earth"],
          review: "Composition of the early atmosphere: confirm wording against a dedicated research review.",
        },
      ],
    },
    {
      id: "a-restless-surface",
      title: "A restless surface",
      blocks: [
        {
          type: "paragraph",
          text: "Earth's outer shell is broken into large plates that move a few centimetres a year, about as fast as fingernails grow. Through [[plate-tectonics]], new crust forms at ocean ridges, old crust sinks back into the mantle, and continents drift, collide and split apart. Over hundreds of millions of years, the surface is recycled again and again.",
          sourceIds: ["usgs-dynamic-earth"],
        },
        {
          type: "paragraph",
          text: "This recycling is one reason why very old rocks are rare. It also matters for life: over long timescales, tectonics and volcanism help cycle carbon between rocks, oceans and air, which influences climate. When plate tectonics in its modern form began is debated.",
          sourceIds: ["usgs-dynamic-earth"],
          review: "Add a source on carbon cycling and the onset of plate tectonics.",
        },
      ],
    },
    {
      id: "a-habitable-world",
      title: "Habitable, but not destined",
      blocks: [
        {
          type: "paragraph",
          text: "By around four billion years ago, Earth probably had liquid water, sources of chemical energy and a range of environments, from shallow seas to hot springs. That made it [[habitability|habitable]]: capable of supporting life as we know it.",
        },
        {
          type: "callout",
          tone: "misconception",
          title: "Habitable does not mean inevitable",
          text: "It is tempting to see early Earth as a world set up for life. Scientists avoid that framing. Conditions made life possible; they did not make it certain. Whether life arises easily wherever conditions allow is one of the biggest open questions in science.",
        },
      ],
    },
  ],
  evidence: [
    {
      id: "meteorite-dating",
      title: "Radiometric dating of meteorites and minerals",
      what: "Ages measured from the decay of radioactive elements, such as uranium to lead, in meteorites and ancient minerals.",
      helpsUs: "Gives Earth's age (about 4.54 billion years) and dates the Solar System's oldest solids.",
      howStudied: "Mass spectrometers measure parent and daughter isotopes in carefully selected samples.",
      limitations: "Works only when a sample has stayed chemically closed since it formed; geologists test for this, and dates are given with uncertainty ranges.",
      status: "well-established",
      sourceIds: ["usgs-age-earth", "usgs-radiometric"],
    },
    {
      id: "zircons",
      title: "Ancient zircon crystals",
      what: "Tiny, tough mineral grains up to about 4.4 billion years old, found in younger rocks in Western Australia.",
      helpsUs: "Provides the oldest direct material from Earth, with chemical clues about early crust and possibly water.",
      howStudied: "Uranium–lead dating and oxygen-isotope analysis of individual crystals.",
      limitations: "Each grain is a tiny fragment, removed from its original rock; what it says about the wider early Earth is debated.",
      status: "active-research",
      sourceIds: ["wilde-2001-zircon"],
    },
    {
      id: "lunar-samples",
      title: "Moon rocks and planetary science",
      what: "Rock samples returned from the Moon, plus observations of other planets and young star systems.",
      helpsUs: "Supports the giant-impact model of the Moon's origin and helps reconstruct how planets form.",
      howStudied: "Chemical and isotopic analysis of samples, spacecraft observations and computer simulations.",
      limitations: "Simulations depend on assumptions, and some chemical similarities between Earth and Moon are not yet fully explained.",
      status: "strong-evidence",
      sourceIds: ["nasa-moon-formation", "nhm-moon"],
    },
    {
      id: "seismic-structure",
      title: "Earthquake waves and geological structures",
      what: "The way seismic waves bend, slow and reflect inside Earth, plus rocks, faults and ocean-floor patterns at the surface.",
      helpsUs: "Reveals Earth's layers and the movement of tectonic plates.",
      howStudied: "Global networks of seismometers, rock dating and mapping of the sea floor.",
      limitations: "Deep structure is inferred indirectly; no one has drilled beyond the crust.",
      status: "well-established",
      sourceIds: ["usgs-interior", "usgs-dynamic-earth"],
    },
  ],
  goDeeper: [
    {
      id: "why-meteorites",
      title: "Why date Earth using meteorites?",
      blocks: [
        {
          type: "paragraph",
          text: "Earth's own earliest rocks were melted, eroded or recycled by plate tectonics long ago. Many meteorites, by contrast, are fragments that have barely changed since the Solar System formed. Because Earth and meteorites formed from the same disc at about the same time, their ages, combined with lead-isotope measurements on Earth, give a consistent age of about 4.54 billion years.",
          sourceIds: ["usgs-age-earth"],
        },
      ],
    },
  ],
  transition: "Earth had water, energy and chemistry. Somewhere in that mix, matter began to copy itself.",
};
