import type { Soundscape } from "./sound-engine";

export type Beat = { at: number; when: string; text: string };

export type SceneDef = {
  id: string;
  number: number;
  chapter: string; // chapter slug for "Go deeper"
  title: string;
  theme: string;
  length: number; // scene height, in screen heights
  soundscape: Soundscape;
  media: string[]; // media ids credited in this scene
  note?: string;
  beats: Beat[];
};

/**
 * The words of the experience. Short on purpose: each line is a caption, and
 * the narrator reads it aloud. Every claim here is drawn from the chapter text,
 * which carries the sources.
 */
export const scenes: SceneDef[] = [
  {
    id: "beginning",
    number: 1,
    chapter: "before-everything",
    title: "Before Everything",
    theme: "cosmos",
    length: 5,
    soundscape: "cosmos",
    media: ["cmb", "pillars", "hubble-zoom"],
    note: "Particle animation: an artistic impression of expansion and the first galaxies.",
    beats: [
      { at: 0, when: "13.8 billion years ago", text: "13.8 billion years ago, everything we can see was packed into a space hotter and denser than anything on Earth today." },
      { at: 0.16, when: "The first moments", text: "It was not an explosion into space. Space itself began to stretch, and it is stretching still." },
      { at: 0.36, when: "380,000 years after the beginning", text: "For 380,000 years the universe was a glowing fog. Then it cooled, and light could travel freely. We can still detect that light today." },
      { at: 0.56, when: "A few hundred million years in", text: "Gravity pulled gas together into the first stars and galaxies. Touch the sky to light a star." },
      { at: 0.74, when: "Inside the stars", text: "Stars are furnaces. They forged the carbon, oxygen and iron that would one day make planets, and people." },
      { at: 0.88, when: "Today", text: "Look in any direction with a big enough telescope, and you see galaxies. Almost every speck of light here is one." },
    ],
  },
  {
    id: "planet",
    number: 2,
    chapter: "planet-earth",
    title: "A Planet Is Born",
    theme: "earth",
    length: 4.5,
    soundscape: "forge",
    media: ["lava", "apollo17"],
    note: "Disc and impact animation: an artistic impression based on the leading scientific model.",
    beats: [
      { at: 0, when: "4.6 billion years ago", text: "4.6 billion years ago, a young Sun was circled by a disc of gas and dust." },
      { at: 0.2, when: "4.6 to 4.5 billion years ago", text: "Dust stuck to dust. Pebbles became boulders, and boulders became planets." },
      { at: 0.4, when: "About 4.5 billion years ago", text: "A Mars-sized world probably struck the young Earth. The debris most likely became our Moon. Tap to strike." },
      { at: 0.64, when: "The molten Earth", text: "The surface was an ocean of molten rock. As it cooled, a crust formed, and rain filled the first oceans." },
      { at: 0.86, when: "Today", text: "Four and a half billion years later, this is what it became." },
    ],
  },
  {
    id: "life",
    number: 3,
    chapter: "first-life",
    title: "The First Breath of Life",
    theme: "life",
    length: 4,
    soundscape: "deep",
    media: ["black-smoker", "stromatolites"],
    note: "Cells are an artistic impression. The sea-floor vent and stromatolites are real photographs.",
    beats: [
      { at: 0, when: "At least 3.5 billion years ago", text: "At least 3.5 billion years ago, life began. One idea is that it started near hot vents on the deep sea floor, like this one." },
      { at: 0.24, when: "Single cells", text: "The first living things were single cells. Touch the water, and watch them divide." },
      { at: 0.5, when: "Billions of years of microbes", text: "Microbes built layered mounds called stromatolites. In Shark Bay, Australia, they are still being built today." },
      { at: 0.74, when: "About 2.4 billion years ago", text: "Microbes that lived on sunlight released oxygen. Slowly, they changed the air of the whole planet." },
    ],
  },
  {
    id: "explosion",
    number: 4,
    chapter: "diversification",
    title: "When Life Diversified",
    theme: "diversity",
    length: 4,
    soundscape: "ocean",
    media: ["marrella"],
    note: "Swimming animals are artistic impressions of Cambrian life. The fossil is a real photograph.",
    beats: [
      { at: 0, when: "About 538 million years ago", text: "About 538 million years ago, animal life burst into new shapes." },
      { at: 0.22, when: "The Cambrian seas", text: "Eyes, shells, legs and jaws spread through the oceans. Move your light through the water." },
      { at: 0.5, when: "508 million years ago", text: "We know these animals from fossils like this one: Marrella, from the Burgess Shale in Canada." },
      { at: 0.76, when: "About 470 million years ago onward", text: "Plants, and then animals, moved out of the water and onto land." },
    ],
  },
  {
    id: "giants",
    number: 5,
    chapter: "age-of-giants",
    title: "The Age of Giants",
    theme: "giants",
    length: 5.5,
    soundscape: "mesozoic",
    media: ["sue"],
    note: "Dinosaur sounds are reconstructions, synthesised in your browser. Nobody knows exactly what dinosaurs sounded like. The asteroid is an artistic impression.",
    beats: [
      { at: 0, when: "252 to 66 million years ago", text: "For about 165 million years, dinosaurs lived on every continent." },
      { at: 0.14, when: "About 67 million years ago", text: "This is Sue, one of the most complete Tyrannosaurus rex skeletons ever found. She was about 12 metres long." },
      { at: 0.32, when: "A reconstruction", text: "Nobody has ever heard a dinosaur. Their closest relatives, birds and crocodiles, suggest some boomed with closed mouths. Tap to hear a reconstruction." },
      { at: 0.55, when: "66 million years ago", text: "Then an asteroid about 10 kilometres wide struck what is now Mexico." },
      { at: 0.72, when: "66 million years ago", text: "Fire, darkness and cold followed. About three in every four species died out." },
      { at: 0.88, when: "Today", text: "But not every dinosaur. Birds are the dinosaurs that survived." },
    ],
  },
  {
    id: "humans",
    number: 6,
    chapter: "human-story",
    title: "The Human Story Begins",
    theme: "human",
    length: 5.5,
    soundscape: "fire",
    media: ["laetoli", "campfire", "hands"],
    note: "Walking footprints and the hand stencil you make are animations. The footprint cast, fire and cave wall are real.",
    beats: [
      { at: 0, when: "About 3.66 million years ago", text: "About 3.66 million years ago in Tanzania, early humans walking upright left these footprints in wet volcanic ash." },
      { at: 0.24, when: "Hundreds of thousands of years ago", text: "Our ancestors learned to control fire. It gave warmth, light, safety and cooked food. Tap the flames." },
      { at: 0.46, when: "About 300,000 years ago", text: "Our own species, Homo sapiens, appears in Africa about 300,000 years ago. From there, people spread across the world." },
      { at: 0.66, when: "About 9,000 years ago", text: "People left their hands on cave walls, blowing pigment around them. Press and hold the wall to leave yours." },
    ],
  },
  {
    id: "civilisation",
    number: 7,
    chapter: "civilisation",
    title: "The Birth of Civilisation",
    theme: "civilisation",
    length: 4.5,
    soundscape: "settle",
    media: ["gobekli", "pyramids"],
    beats: [
      { at: 0, when: "More than 11,000 years ago", text: "More than 11,000 years ago, people at Göbekli Tepe raised giant carved stone pillars." },
      { at: 0.24, when: "About 11,500 years ago onward", text: "People began to farm. Tap the ground to sow grain." },
      { at: 0.5, when: "About 5,200 years ago", text: "Villages grew into cities. In Mesopotamia, people began to write." },
      { at: 0.74, when: "About 4,500 years ago", text: "The pyramids of Giza were built about 4,500 years ago, and they still stand." },
    ],
  },
  {
    id: "ideas",
    number: 8,
    chapter: "age-of-ideas",
    title: "The Age of Ideas",
    theme: "ideas",
    length: 4,
    soundscape: "ideas",
    media: ["hudf"],
    beats: [
      { at: 0, when: "1610", text: "In 1610, Galileo pointed a telescope at Jupiter and saw moons circling it." },
      { at: 0.22, when: "Look closer", text: "To the eye, this patch of sky looks almost empty. Move the lens to look closer." },
      { at: 0.5, when: "2004", text: "The Hubble Space Telescope stared at it for nearly a million seconds, and found about 10,000 galaxies." },
      { at: 0.76, when: "Every day", text: "Science is the habit of checking ideas against evidence, again and again." },
    ],
  },
  {
    id: "world",
    number: 9,
    chapter: "world-we-built",
    title: "The World We Built",
    theme: "built",
    length: 4,
    soundscape: "modern",
    media: ["earthrise", "city-lights", "black-marble"],
    beats: [
      { at: 0, when: "24 December 1968", text: "In 1968, the crew of Apollo 8 watched the Earth rise over the Moon." },
      { at: 0.3, when: "Today", text: "Today more than 8 billion people share this planet. At night, our cities glow. Hold the screen to orbit faster." },
      { at: 0.66, when: "Today", text: "From space there are no borders, just one thin layer of air wrapped around one world." },
    ],
  },
  {
    id: "you",
    number: 10,
    chapter: "you",
    title: "And Then There Was You",
    theme: "you",
    length: 4,
    soundscape: "heart",
    media: ["pale-blue-dot"],
    beats: [
      { at: 0, when: "14 February 1990", text: "Voyager 1 took this photograph from about 6 billion kilometres away. That tiny dot in the sunbeam is Earth." },
      { at: 0.26, when: "Everyone, ever", text: "Every person who has ever lived, lived there." },
      { at: 0.5, when: "Inside you", text: "The calcium in your bones and the iron in your blood were made inside stars that died long before the Sun was born." },
      { at: 0.76, when: "Now", text: "13.8 billion years. And then there was you." },
    ],
  },
];
