/**
 * Chapter 1, "Before Everything", as seven game levels.
 *
 * Everything a player reads lives here, in very simple words for readers
 * aged about 9 to 16. The main screen only shows the short `goal`, `when`
 * and `fact`; the longer `details` stay folded away in the "Learn more"
 * panel. Every level names the sources (ids in src/data/sources.ts) that
 * back its facts, and a unit test checks they exist.
 *
 * The 3D scenes are simulations made for the game, not photographs or
 * exact models. The panel says so.
 */

export type LevelId = "bang" | "stretch" | "nuclei" | "fog" | "stars" | "forge" | "galaxies";

export type Quiz = {
  question: string;
  answers: [string, string, string];
  /** Index of the right answer. */
  correct: 0 | 1 | 2;
  /** Shown after answering, right or wrong. */
  why: string;
};

export type Level = {
  id: LevelId;
  number: number;
  name: string;
  /** When this happened, in plain words. */
  when: string;
  /** The one-line instruction shown while playing. */
  goal: string;
  /** Shorter instruction for small screens, where it must fit one line. */
  goalShort: string;
  /** Big headline on the "level complete" card. */
  win: string;
  /** One-sentence fact on the "level complete" card. */
  fact: string;
  /** "Learn more" panel: short paragraphs, opened only on request. */
  details: string[];
  sourceIds: string[];
  quiz: Quiz;
  /** Seconds. Finishing faster than this earns the speed star. */
  par: number;
  /** Bold accent colour for this level's UI. */
  color: string;
};

export const CHAPTER = {
  number: 1,
  title: "Before Everything",
  tagline: "Travel back 13.8 billion years and build the universe, one level at a time.",
  next: "Chapter 2: A Planet Is Born",
} as const;

export const levels: readonly Level[] = [
  {
    id: "bang",
    number: 1,
    name: "The Big Bang",
    when: "13.8 billion years ago",
    goal: "Press and hold the tiny dot until it bursts!",
    goalShort: "Press and hold the dot!",
    win: "Space is born!",
    fact: "Everything in the universe was once packed into a tiny, super-hot speck. Then space began to stretch.",
    details: [
      "Scientists think the universe is about 13.8 billion years old. They worked this out by studying very old light that still fills space.",
      "At the start, everything was squeezed together and incredibly hot. We call this the Big Bang.",
      "The name is a bit misleading. It was not like a bomb going off in empty space. Space itself started to stretch, everywhere at once.",
      "What came before the Big Bang, if anything? Nobody knows yet. It is one of the biggest open questions in science.",
    ],
    sourceIds: ["wmap-age", "planck-2018-params", "nasa-universe-overview"],
    quiz: {
      question: "How old is the universe?",
      answers: ["About 6,000 years", "About 13.8 billion years", "It has always existed"],
      correct: 1,
      why: "About 13.8 billion years. Space telescopes worked this out from the oldest light in the universe.",
    },
    par: 12,
    color: "#ffb020",
  },
  {
    id: "stretch",
    number: 2,
    name: "Space Stretches",
    when: "From the start until today",
    goal: "Drag across the screen to stretch space. Watch the galaxies drift apart!",
    goalShort: "Drag to stretch space!",
    win: "The universe is growing!",
    fact: "Space is still stretching today. Far-away galaxies are moving away from us, and their light looks redder.",
    details: [
      "About 100 years ago, astronomers noticed something odd. Light from far-away galaxies looked redder than it should.",
      "This happens because space between the galaxies is stretching. The light gets stretched too, and stretched light looks redder. Scientists call this redshift.",
      "The further away a galaxy is, the redder its light. That is the clue that the whole universe is growing.",
      "Galaxies themselves do not stretch. Gravity holds them together. It is the space between them that grows.",
    ],
    sourceIds: ["nasa-hubble-redshift", "nasa-universe-overview"],
    quiz: {
      question: "Why does light from far-away galaxies look redder?",
      answers: ["The galaxies are on fire", "Space stretches the light", "Red stars are bigger"],
      correct: 1,
      why: "As space stretches, the light travelling through it gets stretched too. Stretched light looks redder.",
    },
    par: 15,
    color: "#ff3d7f",
  },
  {
    id: "nuclei",
    number: 3,
    name: "The First Building Blocks",
    when: "The first few minutes",
    goal: "Tap the glowing groups to stick them together and make helium!",
    goalShort: "Tap the glowing groups!",
    win: "You made the first atoms' hearts!",
    fact: "In the first few minutes, tiny particles stuck together to make the centres of hydrogen and helium.",
    details: [
      "Right after the Big Bang it was far too hot for anything to stick together.",
      "As space stretched, it cooled. Within the first few minutes, tiny particles called protons and neutrons began to join up.",
      "They made the centres (nuclei) of the lightest atoms: hydrogen, helium and a tiny bit of lithium.",
      "Astronomers check this by measuring the oldest gas in space. The amounts match what the science predicts. Hydrogen and helium are still the most common stuff in the universe.",
    ],
    sourceIds: ["nasa-universe-overview"],
    quiz: {
      question: "Which were the first atoms in the universe?",
      answers: ["Gold and silver", "Hydrogen and helium", "Carbon and oxygen"],
      correct: 1,
      why: "Hydrogen and helium, plus a tiny bit of lithium. Heavier atoms came much later, made inside stars.",
    },
    par: 20,
    color: "#ffe14d",
  },
  {
    id: "fog",
    number: 4,
    name: "The Fog Clears",
    when: "380,000 years after the Big Bang",
    goal: "Swipe across the glowing fog to clear it and let the light shine through!",
    goalShort: "Swipe to clear the fog!",
    win: "Let there be light!",
    fact: "When the universe cooled enough, atoms formed, the fog cleared, and light could travel freely for the first time.",
    details: [
      "For hundreds of thousands of years, the universe was like a thick, glowing fog. Light kept bumping into tiny particles called electrons and could not get far.",
      "At about 380,000 years, the universe cooled enough for electrons to join nuclei and make whole atoms. Suddenly, light could travel freely.",
      "That ancient light is still all around us! It has been stretched into faint microwaves. Scientists call it the cosmic microwave background.",
      "Space telescopes such as NASA's WMAP and ESA's Planck have mapped it. It is like a baby photo of the universe.",
    ],
    sourceIds: ["esa-planck-cmb", "wmap-age"],
    quiz: {
      question: "What is the cosmic microwave background?",
      answers: ["Light left over from the early universe", "Signals from aliens", "Heat from the Sun"],
      correct: 0,
      why: "It is the oldest light we can see, released about 380,000 years after the Big Bang.",
    },
    par: 18,
    color: "#ff7a1a",
  },
  {
    id: "stars",
    number: 5,
    name: "The First Stars",
    when: "A few hundred million years after the Big Bang",
    goal: "Press and hold on a gas cloud. Let gravity squeeze it until a star lights up!",
    goalShort: "Hold a cloud to make a star!",
    win: "The lights are on!",
    fact: "After a long dark time, gravity squeezed clouds of gas so hard that they lit up. The first stars were born!",
    details: [
      "After the fog cleared, the universe went dark. There were no stars yet. Scientists call this the cosmic dark ages.",
      "But the gas was not perfectly smooth. Some spots were a little thicker. Gravity pulled in more and more gas there, helped by mysterious dark matter.",
      "When a cloud got squeezed enough, its centre became hot enough for nuclear fusion. It lit up as a star.",
      "The James Webb Space Telescope is now spotting galaxies from this early time. Some are brighter than scientists expected, so there is still a lot to learn.",
    ],
    sourceIds: ["nasa-universe-overview", "cfa-jwst-early-galaxies"],
    quiz: {
      question: "What squeezed gas clouds to make the first stars?",
      answers: ["Wind", "Magnets", "Gravity"],
      correct: 2,
      why: "Gravity. It pulled gas together until the centre got hot enough to start shining.",
    },
    par: 20,
    color: "#3ee0ff",
  },
  {
    id: "forge",
    number: 6,
    name: "Star Factory",
    when: "Inside stars, for billions of years",
    goal: "Tap the star to squeeze its core and cook new elements. Make iron, then stand back!",
    goalShort: "Tap the star to cook elements!",
    win: "Supernova!",
    fact: "Stars cook new elements. Big stars explode and scatter them, ready to build planets, and one day, you.",
    details: [
      "The early universe had almost only hydrogen and helium. Nearly every other element was made later, inside stars.",
      "Stars shine by squeezing light atoms together into heavier ones. This is called fusion. Big stars make carbon, oxygen, and finally iron.",
      "When a giant star dies, it can blow up in a supernova and throw these elements into space. Some of the heaviest, like gold, probably come mostly from rare crashes between dead stars called neutron stars.",
      "New stars and planets formed from this star dust. The carbon in your body, the oxygen you breathe and the calcium in your bones were made in stars!",
    ],
    sourceIds: ["nasa-star-stuff", "nhm-stardust"],
    quiz: {
      question: "Where was the carbon in your body made?",
      answers: ["In the Big Bang", "Inside stars", "In the ocean"],
      correct: 1,
      why: "Inside stars. You really are made of star stuff!",
    },
    par: 15,
    color: "#b05cff",
  },
  {
    id: "galaxies",
    number: 7,
    name: "Galaxy Builder",
    when: "The first billion years and beyond",
    goal: "Drag the small star groups into the big one. Merge them all to build a galaxy!",
    goalShort: "Drag star groups to the middle!",
    win: "You built a galaxy!",
    fact: "Stars gathered into galaxies, and galaxies crashed and merged to grow bigger. Our home galaxy is the Milky Way.",
    details: [
      "Stars are not spread out evenly. Gravity gathers them into huge groups called galaxies.",
      "The first galaxies were small. Over time they pulled on each other, crashed together and merged into bigger ones.",
      "Our home galaxy is called the Milky Way. Our Sun is one of its many, many stars.",
      "Telescopes are time machines. Light from very far galaxies took more than 13 billion years to reach us, so we see them as they were long ago.",
    ],
    sourceIds: ["nasa-universe-overview", "cfa-jwst-early-galaxies"],
    quiz: {
      question: "How did galaxies grow bigger?",
      answers: ["They merged with other galaxies", "They were blown up like balloons", "They stayed the same"],
      correct: 0,
      why: "Gravity pulled galaxies together, and they merged into bigger ones.",
    },
    par: 25,
    color: "#2bff88",
  },
];

export const levelById = (id: LevelId) => levels.find((l) => l.id === id)!;
