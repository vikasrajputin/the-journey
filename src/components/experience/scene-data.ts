import type { Soundscape } from "./sound-engine";

/**
 * One moment of a scene. `sources` are ids in src/data/sources.ts that back the
 * caption. `see` says, on screen, what the visitor is looking at, and `real`
 * marks it as a real photo, film, fossil or data (true) or a simulation (false).
 */
export type Beat = { at: number; when: string; text: string; sources: string[]; real: boolean; see: string };

export type SceneDef = {
  id: string;
  number: number;
  chapter: string; // chapter slug for "Go deeper"
  title: string;
  theme: string;
  length: number; // scene height, in screen heights
  soundscape: Soundscape;
  media: string[]; // media ids credited in this scene
  /** A real recording or NASA sonification played under the scene, over the synthesised bed. */
  sound?: { media: string; label: string; sources: string[] };
  /** Real specimens scanned in 3D by the Smithsonian, loaded only when asked for. */
  artefacts?: Artefact[];
  note?: string;
  beats: Beat[];
};

export type Artefact = { id: string; title: string; text: string; page: string; embed: string; credit: string };

const si3d = (slug: string, uuid: string, rest: Omit<Artefact, "id" | "page" | "embed">): Artefact => ({
  id: uuid,
  page: `https://3d.si.edu/object/3d/${slug}:${uuid}`,
  embed: `https://3d-api.si.edu/voyager/3d_package:${uuid}`,
  ...rest,
});

/**
 * The words of the experience. Short on purpose: each line is a caption, and
 * there is no narration. Every claim here is drawn from the chapter text,
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
    sound: { media: "snd-perseus", label: "Real data as sound: pressure waves from a black hole in the Perseus galaxy cluster, measured by NASA's Chandra telescope and raised 57 to 58 octaves so we can hear them", sources: ["nasa-bh-sonification"] },
    media: ["snd-perseus", "cmb", "pillars", "hubble-zoom"],
    note: "Particle animation: an artistic impression of expansion and the first galaxies.",
    beats: [
      { at: 0, when: "13.8 billion years ago", text: "13.8 billion years ago, everything you can see, every star and every planet, was squeezed into a tiny space. It was hotter than anything on Earth today.", sources: ["wmap-age", "planck-2018-params", "nasa-universe-overview"], real: false, see: "Simulation: the hot, dense early universe" },
      { at: 0.16, when: "The first moments", text: "It was not a bang in empty space. Space itself began to stretch, like a balloon blowing up. It is still stretching today!", sources: ["nasa-hubble-redshift", "nasa-universe-overview"], real: false, see: "Simulation: space expanding" },
      { at: 0.36, when: "380,000 years after the beginning", text: "For 380,000 years, the universe was a thick, glowing fog. Then it cooled down and light could zoom free. Telescopes can still see that very old light!", sources: ["esa-planck-cmb"], real: true, see: "Real data: the oldest light, mapped by COBE, WMAP and Planck" },
      { at: 0.56, when: "A few hundred million years in", text: "Gravity pulled gas together, and the first stars switched on. Stars gathered into galaxies: giant families of stars. Touch the sky to light a star!", sources: ["nasa-universe-overview", "cfa-jwst-early-galaxies"], real: false, see: "Simulation: the first galaxies forming" },
      { at: 0.74, when: "Inside the stars", text: "Stars are like giant ovens. Inside them, new stuff was made: carbon, oxygen and iron. One day, that stuff would build planets, and you!", sources: ["nasa-star-stuff"], real: true, see: "Real photo: the Pillars of Creation, by the Webb telescope (NASA, ESA, CSA)" },
      { at: 0.88, when: "Today", text: "Point a big telescope anywhere in the sky and you find galaxies. Almost every dot of light here is a whole galaxy!", sources: ["nasa-hubble-deep-fields"], real: true, see: "Real film: the Hubble Legacy Field (NASA, ESA)" },
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
    sound: { media: "snd-rain", label: "Real recording: a thunderstorm", sources: [] },
    media: ["snd-rain", "lava", "apollo17"],
    note: "Disc and impact animation: an artistic impression based on the leading scientific model.",
    beats: [
      { at: 0, when: "4.6 billion years ago", text: "4.6 billion years ago, our Sun was a baby star. Around it spun a flat disc of gas and dust.", sources: ["nasa-solar-system-form"], real: false, see: "Simulation: the young Solar System" },
      { at: 0.2, when: "4.6 to 4.5 billion years ago", text: "Dust stuck to dust. Pebbles grew into boulders. Boulders crashed together and grew into planets.", sources: ["nasa-solar-system-form"], real: false, see: "Simulation: planets growing from dust" },
      { at: 0.4, when: "About 4.5 billion years ago", text: "Scientists think a planet as big as Mars smashed into the young Earth. The pieces that flew off probably made our Moon. Tap to make it hit!", sources: ["nasa-moon-formation", "nhm-moon"], real: false, see: "Simulation: the giant impact that likely made the Moon" },
      { at: 0.64, when: "The molten Earth", text: "Earth was covered in red-hot melted rock, like lava. Slowly it cooled, a hard skin of rock formed, and rain filled the first oceans.", sources: ["nasa-early-earth", "wilde-2001-zircon"], real: true, see: "Real film: molten lava at Kīlauea, Hawaiʻi, today" },
      { at: 0.86, when: "Today", text: "Four and a half billion years later, this is our home!", sources: ["usgs-age-earth"], real: true, see: "Real photo: Earth from Apollo 17 (NASA)" },
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
    sound: { media: "snd-bloop", label: "Real recording: NOAA underwater microphones, 1997. The sound is ice cracking, played 16 times faster", sources: ["noaa-bloop"] },
    media: ["snd-bloop", "black-smoker", "stromatolites"],
    note: "Cells are an artistic impression. The sea-floor vent and stromatolites are real photographs.",
    beats: [
      { at: 0, when: "At least 3.5 billion years ago", text: "At least 3.5 billion years ago, life began! One idea is that it started near hot springs at the bottom of the sea, like this one.", sources: ["nhm-oldest-stromatolites", "nasa-astrobio-vents"], real: true, see: "Real photo: a black smoker vent on the Atlantic sea floor (NOAA)" },
      { at: 0.24, when: "Single cells", text: "The first living things were tiny cells, far too small to see. Touch the water and watch them split in two!", sources: ["si-early-life"], real: false, see: "Simulation: single cells dividing" },
      { at: 0.5, when: "Billions of years of microbes", text: "Tiny living things called microbes built rocky mounds, layer by layer. In Shark Bay, Australia, they are still building them today!", sources: ["unesco-shark-bay", "nhm-oldest-stromatolites"], real: true, see: "Real photo: living stromatolites, Shark Bay, Australia" },
      { at: 0.74, when: "About 2.4 billion years ago", text: "Some microbes used sunlight for food, and gave out oxygen, the gas we breathe. Bit by bit, they changed the air of the whole planet.", sources: ["nasa-goe"], real: false, see: "Simulation: oxygen bubbling from microbes" },
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
    sound: { media: "snd-waves", label: "Real recording: waves on a shore", sources: [] },
    media: ["snd-waves", "marrella"],
    note: "Swimming animals are artistic impressions of Cambrian life. The fossil is a real photograph.",
    beats: [
      { at: 0, when: "About 538 million years ago", text: "About 538 million years ago, animals suddenly came in lots of amazing new shapes.", sources: ["ics-chart", "nhm-cambrian"], real: false, see: "Simulation: an artist's impression of Cambrian sea life" },
      { at: 0.22, when: "The Cambrian seas", text: "Eyes, shells, legs and jaws appeared all over the oceans. Move your light through the water to find them!", sources: ["nhm-cambrian", "rom-burgess-explosion"], real: false, see: "Simulation: an artist's impression of Cambrian sea life" },
      { at: 0.5, when: "508 million years ago", text: "How do we know? From fossils like this one! It is Marrella, a tiny sea animal turned to stone in Canada.", sources: ["rom-burgess-explosion"], real: true, see: "Real fossil: Marrella, Burgess Shale, Canada" },
      { at: 0.76, when: "From about 500 million years ago", text: "Then plants, and later animals, crawled out of the water and onto dry land.", sources: ["nhm-land-plants", "ue-tetrapods"], real: false, see: "Simulation: light from the sea surface" },
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
    artefacts: [
      si3d("tyrannosaurus-rex", "d8c62d28-4ebc-11ea-b77f-2e728ce88125", { title: "Tyrannosaurus rex and Triceratops", text: "The Smithsonian's 3D scan of its Tyrannosaurus rex and Triceratops fossils, from the National Museum of Natural History.", credit: "Smithsonian National Museum of Natural History" }),
    ],
    sound: { media: "snd-birds", label: "Real recording: birdsong. Birds are the dinosaurs that survived", sources: ["nhm-birds-dinosaurs"] },
    media: ["snd-birds", "sue"],
    note: "Dinosaur sounds are reconstructions, synthesised in your browser. Nobody knows exactly what dinosaurs sounded like. The asteroid is an artistic impression.",
    beats: [
      { at: 0, when: "252 to 66 million years ago", text: "Dinosaurs ruled for about 165 million years. They lived on every continent!", sources: ["nhm-when-dinosaurs", "ics-chart"], real: false, see: "Simulation: a Mesozoic forest" },
      { at: 0.14, when: "About 67 million years ago", text: "Meet Sue, one of the most complete T. rex skeletons ever found. She was about 12 metres long: about as long as a school bus!", sources: ["fieldmuseum-sue"], real: true, see: "Real fossil: SUE the T. rex, Field Museum, Chicago" },
      { at: 0.32, when: "A reconstruction", text: "Nobody has ever heard a dinosaur. But their cousins, birds and crocodiles, give us clues: some may have boomed with their mouths shut. Tap to hear our best guess!", sources: ["utexas-dino-calls"], real: false, see: "Reconstructed sound, based on living birds and crocodiles" },
      { at: 0.55, when: "66 million years ago", text: "Then, BOOM! A space rock 10 to 15 kilometres wide crashed into Earth, where Mexico is today.", sources: ["nhm-asteroid", "schulte-2010-chicxulub"], real: false, see: "Simulation: the Chicxulub impact" },
      { at: 0.72, when: "66 million years ago", text: "Fires, darkness and cold followed. About three out of every four kinds of animals disappeared forever.", sources: ["nhm-asteroid"], real: false, see: "Simulation: the aftermath" },
      { at: 0.88, when: "Today", text: "But not every dinosaur! Birds are dinosaurs that survived. The next pigeon you see is a dinosaur.", sources: ["nhm-birds-dinosaurs", "amnh-birds-dinosaurs"], real: false, see: "Simulation: birds at dawn" },
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
    artefacts: [
      si3d("sahelanthropus-tchadensis-cranium", "9730a62f-a649-44fb-8494-aa7c9b6eb1f8", { title: "Toumaï (Sahelanthropus tchadensis)", text: "A skull 7 to 6 million years old, found at Toros-Menalla, Chad, in 2001. One of the oldest known members of the human family tree.", credit: "Smithsonian Human Origins Program (3D scan of a cast)" }),
      si3d("homo-erectus-cranium", "0b1d7e98-3dd0-4614-93d7-a2ae3cc9b11c", { title: "Homo erectus from Dmanisi, Georgia", text: "About 1.77 million years old: one of the earliest human skulls known from outside Africa.", credit: "Smithsonian Human Origins Program (3D scan of a cast; original at the Georgian National Museum)" }),
      si3d("homo-sapiens-cranium", "09d681b2-5ae9-44a8-b444-8e31bb40305e", { title: "Cro-Magnon 1 (Homo sapiens)", text: "About 30,000 years old, from the Cro-Magnon rock shelter in France. A person of our own species.", credit: "Smithsonian Human Origins Program (3D scan of a cast; original at the Musée de l'Homme)" }),
    ],
    sound: { media: "snd-fire", label: "Real recording: a crackling campfire", sources: [] },
    media: ["snd-fire", "laetoli", "campfire", "hands"],
    note: "Walking footprints and the hand stencil you make are animations. The footprint cast, fire and cave wall are real.",
    beats: [
      { at: 0, when: "About 3.6 million years ago", text: "About 3.6 million years ago in Tanzania, early humans walked on two legs through wet volcanic ash. Their footprints are still there!", sources: ["si-laetoli"], real: true, see: "Real cast: the Laetoli footprints, with animated steps" },
      { at: 0.24, when: "Hundreds of thousands of years ago", text: "Our ancestors learned to control fire. It kept them warm, gave light, scared away animals and cooked food. Tap the flames!", sources: ["pnas-wonderwerk"], real: true, see: "Real film: a campfire, with animated sparks" },
      { at: 0.46, when: "About 300,000 years ago", text: "People like us, Homo sapiens, appeared in Africa about 300,000 years ago. From there, we spread all over the world.", sources: ["si-300k", "hublin-2017-irhoud", "nhm-homo-sapiens"], real: true, see: "Real film: a campfire" },
      { at: 0.66, when: "More than 9,000 years ago", text: "People made hand prints on cave walls by blowing paint around their hands. Press and hold the wall to leave yours!", sources: ["unesco-cueva-manos"], real: true, see: "Real photo: hand stencils, Cueva de las Manos, Argentina" },
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
      { at: 0, when: "More than 11,000 years ago", text: "More than 11,000 years ago, people at Göbekli Tepe in Türkiye carved giant stone pillars.", sources: ["unesco-gobekli"], real: true, see: "Real photo: Göbekli Tepe, Türkiye" },
      { at: 0.24, when: "About 11,500 years ago onward", text: "People started farming: planting seeds and growing their own food. Tap the ground to plant some grain!", sources: ["larson-2014-domestication"], real: false, see: "Simulation: your field of grain" },
      { at: 0.5, when: "About 5,100 years ago", text: "Villages grew into cities. In Mesopotamia, people invented writing, so ideas could last longer than a voice.", sources: ["met-origins-writing", "bm-uruk-tablet", "met-uruk"], real: false, see: "Simulation: city lights at dusk" },
      { at: 0.74, when: "About 4,500 years ago", text: "The pyramids of Giza in Egypt were built about 4,500 years ago, and they are still standing!", sources: ["met-old-kingdom", "unesco-memphis"], real: true, see: "Real photo: the pyramids of Giza, Egypt" },
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
      { at: 0, when: "1610", text: "In 1610, Galileo pointed a telescope at Jupiter and spotted moons going round it. Nobody had seen them before!", sources: ["museogalileo-sidereus"], real: false, see: "Simulation: Jupiter and its four large moons, as Galileo saw them" },
      { at: 0.22, when: "Look closer", text: "To your eyes, this patch of sky looks almost empty. Move the magnifying lens to look closer!", sources: ["nasa-hubble-deep-fields"], real: true, see: "Real image inside the lens: Hubble Ultra Deep Field (NASA, ESA)" },
      { at: 0.5, when: "2004", text: "The Hubble Space Telescope stared at it for nearly a million seconds (about 11 and a half days) and found about 10,000 galaxies!", sources: ["nasa-hubble-deep-fields"], real: true, see: "Real image: Hubble Ultra Deep Field (NASA, ESA)" },
      { at: 0.76, when: "Every day", text: "That is what science is: having an idea, then checking it against real evidence, again and again.", sources: ["museogalileo-sidereus", "nasa-hubble-deep-fields"], real: true, see: "Real image: Hubble Ultra Deep Field (NASA, ESA)" },
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
    media: ["earthrise", "city-lights", "black-marble", "chandrayaan"],
    beats: [
      { at: 0, when: "24 December 1968", text: "In 1968, the astronauts of Apollo 8 flew around the Moon and saw the Earth rise over it.", sources: ["nasa-earthrise"], real: true, see: "Real photo: Earthrise, Apollo 8 (NASA)" },
      { at: 0.3, when: "Today", text: "Today, more than 8 billion people share this planet. At night, our cities sparkle. Hold the screen to fly around faster!", sources: ["un-8-billion"], real: true, see: "Real film: city lights from the International Space Station (NASA)" },
      { at: 0.66, when: "23 August 2023", text: "And we keep exploring! In 2023, India's Chandrayaan-3 was the first mission to land near the Moon's south pole. Its little rover took this photo there.", sources: ["isro-chandrayaan3"], real: true, see: "Real photo: the Vikram lander on the Moon, taken by the Pragyan rover (ISRO)" },
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
    sound: { media: "snd-voyager", label: "Real data as sound: the gas between the stars, picked up by Voyager 1 in 2012 and 2013, beyond the edge of our Solar System", sources: ["nasa-voyager-sounds"] },
    media: ["snd-voyager", "pale-blue-dot"],
    beats: [
      { at: 0, when: "14 February 1990", text: "The Voyager 1 spacecraft took this photo about 6 billion kilometres from the Sun. See the tiny dot in the stripe of light? That is Earth!", sources: ["nasa-pale-blue-dot"], real: true, see: "Real photo: the Pale Blue Dot, Voyager 1 (NASA/JPL)" },
      { at: 0.26, when: "Everyone, ever", text: "Every person who has ever lived, lived on that tiny dot.", sources: ["nasa-pale-blue-dot"], real: true, see: "Real photo: the Pale Blue Dot, Voyager 1 (NASA/JPL)" },
      { at: 0.5, when: "Inside you", text: "The calcium in your bones and the iron in your blood were made inside stars, long before the Sun was born. You are made of star stuff!", sources: ["nasa-star-stuff", "nhm-stardust"], real: false, see: "Simulation: stardust gathering" },
      { at: 0.76, when: "Now", text: "13.8 billion years of history. And then there was you.", sources: ["wmap-age"], real: false, see: "Simulation: stardust gathering" },
    ],
  },
];
