/**
 * Chapter 1, "Before Everything", as one flowing journey through time.
 *
 * There are no levels, scores or quizzes: you drift through seven moments
 * in the story of the universe, and each one unfolds around you as you
 * arrive. Everything a visitor reads lives here, in very simple words for
 * readers aged about 9 to 16. The screen shows only `when`, `name`, `feel`
 * and `fact`; the longer `details` stay folded away in the "Learn more"
 * panel. Every moment names the sources (ids in src/data/sources.ts) that
 * back its facts, and a unit test checks they exist.
 *
 * The 3D scenes are simulations made for this experience, not photographs
 * or exact models. The panel says so.
 */

export type MomentId = "bang" | "stretch" | "nuclei" | "fog" | "stars" | "forge" | "galaxies";

export type Moment = {
  id: MomentId;
  number: number;
  name: string;
  /** When this happened, in plain words. */
  when: string;
  /** One short line that tells you what you are seeing and feeling. */
  feel: string;
  /** One-sentence fact shown under it. */
  fact: string;
  /** "Learn more" panel: short paragraphs, opened only on request. */
  details: string[];
  sourceIds: string[];
  /** Bold accent colour for this moment. */
  color: string;
};

export const CHAPTER = {
  number: 1,
  title: "Before Everything",
  tagline: "Travel back 13.8 billion years and watch the universe begin.",
  next: "Chapter 2: A Planet Is Born",
} as const;

export const moments: readonly Moment[] = [
  {
    id: "bang",
    number: 1,
    name: "The Big Bang",
    when: "13.8 billion years ago",
    feel: "Everything is squeezed into one tiny, super-hot dot. Then it bursts.",
    fact: "Everything in the universe was once packed into a tiny, super-hot speck. Then space began to stretch.",
    details: [
      "Scientists think the universe is about 13.8 billion years old. They worked this out by studying very old light that still fills space.",
      "At the start, everything was squeezed together and incredibly hot. We call this the Big Bang.",
      "The name is a bit misleading. It was not like a bomb going off in empty space. Space itself started to stretch, everywhere at once.",
      "What came before the Big Bang, if anything? Nobody knows yet. It is one of the biggest open questions in science.",
    ],
    sourceIds: ["wmap-age", "planck-2018-params", "nasa-universe-overview"],
    color: "#ffb020",
  },
  {
    id: "stretch",
    number: 2,
    name: "Space Stretches",
    when: "From the start until today",
    feel: "Space itself is growing. Everything drifts apart.",
    fact: "Space is still stretching today. Far-away galaxies are moving away from us, and their light looks redder.",
    details: [
      "About 100 years ago, astronomers noticed something odd. Light from far-away galaxies looked redder than it should.",
      "This happens because space between the galaxies is stretching. The light gets stretched too, and stretched light looks redder. Scientists call this redshift.",
      "The further away a galaxy is, the redder its light. That is the clue that the whole universe is growing.",
      "Galaxies themselves do not stretch. Gravity holds them together. It is the space between them that grows.",
    ],
    sourceIds: ["nasa-hubble-redshift", "nasa-universe-overview"],
    color: "#ff3d7f",
  },
  {
    id: "nuclei",
    number: 3,
    name: "The First Building Blocks",
    when: "The first few minutes",
    feel: "Tiny bits zoom around, crash, and stick together.",
    fact: "In the first few minutes, tiny particles stuck together to make the centres of hydrogen and helium.",
    details: [
      "Right after the Big Bang it was far too hot for anything to stick together.",
      "As space stretched, it cooled. Within the first few minutes, tiny particles called protons and neutrons began to join up.",
      "They made the centres (nuclei) of the lightest atoms: hydrogen, helium and a tiny bit of lithium.",
      "Astronomers check this by measuring the oldest gas in space. The amounts match what the science predicts. Hydrogen and helium are still the most common stuff in the universe.",
    ],
    sourceIds: ["nasa-universe-overview"],
    color: "#ffe14d",
  },
  {
    id: "fog",
    number: 4,
    name: "The Fog Clears",
    when: "380,000 years after the Big Bang",
    feel: "A hot, glowing fog fills everything. Then it clears.",
    fact: "When the universe cooled enough, atoms formed, the fog cleared, and light could travel freely for the first time.",
    details: [
      "For hundreds of thousands of years, the universe was like a thick, glowing fog. Light kept bumping into tiny particles called electrons and could not get far.",
      "At about 380,000 years, the universe cooled enough for electrons to join nuclei and make whole atoms. Suddenly, light could travel freely.",
      "That ancient light is still all around us! It has been stretched into faint microwaves. Scientists call it the cosmic microwave background.",
      "Space telescopes such as NASA's WMAP and ESA's Planck have mapped it. It is like a baby photo of the universe.",
    ],
    sourceIds: ["esa-planck-cmb", "wmap-age"],
    color: "#ff7a1a",
  },
  {
    id: "stars",
    number: 5,
    name: "The First Stars",
    when: "A few hundred million years after the Big Bang",
    feel: "Dark clouds squeeze tighter and tighter, and light up.",
    fact: "After a long dark time, gravity squeezed clouds of gas so hard that they lit up. The first stars were born!",
    details: [
      "After the fog cleared, the universe went dark. There were no stars yet. Scientists call this the cosmic dark ages.",
      "But the gas was not perfectly smooth. Some spots were a little thicker. Gravity pulled in more and more gas there, helped by mysterious dark matter.",
      "When a cloud got squeezed enough, its centre became hot enough for nuclear fusion. It lit up as a star.",
      "The James Webb Space Telescope is now spotting galaxies from this early time. Some are brighter than scientists expected, so there is still a lot to learn.",
    ],
    sourceIds: ["nasa-universe-overview", "cfa-jwst-early-galaxies"],
    color: "#3ee0ff",
  },
  {
    id: "forge",
    number: 6,
    name: "Star Factory",
    when: "Inside stars, for billions of years",
    feel: "Deep inside, stars cook new stuff. Then a giant star explodes.",
    fact: "Stars cook new elements. Big stars explode and scatter them, ready to build planets, and one day, you.",
    details: [
      "The early universe had almost only hydrogen and helium. Nearly every other element was made later, inside stars.",
      "Stars shine by squeezing light atoms together into heavier ones. This is called fusion. Big stars make carbon, oxygen, and finally iron.",
      "When a giant star dies, it can blow up in a supernova and throw these elements into space. Some of the heaviest, like gold, probably come mostly from rare crashes between dead stars called neutron stars.",
      "New stars and planets formed from this star dust. The carbon in your body, the oxygen you breathe and the calcium in your bones were made in stars!",
    ],
    sourceIds: ["nasa-star-stuff", "nhm-stardust"],
    color: "#b05cff",
  },
  {
    id: "galaxies",
    number: 7,
    name: "Galaxy Builder",
    when: "The first billion years and beyond",
    feel: "Stars gather into huge swirls of light that crash and grow.",
    fact: "Stars gathered into galaxies, and galaxies crashed and merged to grow bigger. Our home galaxy is the Milky Way.",
    details: [
      "Stars are not spread out evenly. Gravity gathers them into huge groups called galaxies.",
      "The first galaxies were small. Over time they pulled on each other, crashed together and merged into bigger ones.",
      "Our home galaxy is called the Milky Way. Our Sun is one of its many, many stars.",
      "Telescopes are time machines. Light from very far galaxies took more than 13 billion years to reach us, so we see them as they were long ago.",
    ],
    sourceIds: ["nasa-universe-overview", "cfa-jwst-early-galaxies"],
    color: "#2bff88",
  },
];
