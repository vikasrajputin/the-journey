import { createHash } from "node:crypto";

/**
 * Photos and videos used by the immersive experience. Every item is a real file
 * on Wikimedia Commons, served straight from Wikimedia. Titles were confirmed by
 * search on 2026-11-07. NASA, ESA/Hubble, USGS and NOAA items are public domain
 * or freely licensed. For the rest, the licence and author are on the linked
 * file page. Server-only: hashes are computed at build time.
 */
export type MediaItem = {
  id: string;
  kind: "image" | "video";
  file: string; // Commons file title, without "File:"
  alt: string;
  credit: string;
};

export type ResolvedMedia = MediaItem & {
  page: string;
  src: string; // image: ~1920px thumbnail; video: poster frame
  srcSmall: string; // ~960px for phones
  sources?: { src: string; type: string }[];
};

const items: MediaItem[] = [
  { id: "hubble-zoom", kind: "video", file: "NASA-HubbleLegacyFieldZoomOut-20190502.webm", alt: "Hubble Legacy Field: zooming out through thousands of galaxies", credit: "NASA, ESA, G. Illingworth & D. Magee" },
  { id: "sun", kind: "video", file: "NASA's Solar Dynamics Observatory- Year 7 Ultra HD (4k).webm", alt: "The Sun seen in ultraviolet light by NASA's Solar Dynamics Observatory", credit: "NASA / SDO" },
  { id: "hudf", kind: "image", file: "Hubble ultra deep field.jpg", alt: "Hubble Ultra Deep Field: almost every speck of light is a galaxy", credit: "NASA, ESA, S. Beckwith (STScI) and the HUDF Team" },
  { id: "pillars", kind: "image", file: "Pillars of Creation (NIRCam Image).jpg", alt: "The Pillars of Creation, columns of gas and dust where stars are forming, seen by the Webb telescope", credit: "NASA, ESA, CSA, STScI" },
  { id: "cmb", kind: "image", file: "PIA16874-CobeWmapPlanckComparison-20130321.jpg", alt: "The oldest light in the universe, mapped by COBE, WMAP and Planck", credit: "NASA / JPL-Caltech / ESA" },
  { id: "lava", kind: "video", file: "Flowing Lava at Kilauea, Hawaii.webm", alt: "Molten lava flowing at Kīlauea, Hawaiʻi", credit: "Wikimedia Commons (see file page)" },
  { id: "apollo17", kind: "image", file: "The Earth seen from Apollo 17.jpg", alt: "The whole Earth photographed by the Apollo 17 crew in 1972", credit: "NASA / Apollo 17 crew" },
  { id: "black-smoker", kind: "image", file: "Blacksmoker in Atlantic Ocean.jpg", alt: "A black smoker: a deep-sea hydrothermal vent pouring out hot, mineral-rich water", credit: "NOAA / P. Rona" },
  { id: "stromatolites", kind: "image", file: "Stromatolites in Sharkbay.jpg", alt: "Living stromatolites in Shark Bay, Western Australia, built by microbes layer by layer", credit: "Wikimedia Commons (see file page)" },
  { id: "marrella", kind: "image", file: "Marrella from Burgess Shale Fossils.jpg", alt: "A fossil of Marrella, a small arthropod from the 508-million-year-old Burgess Shale", credit: "Wikimedia Commons (see file page)" },
  { id: "sue", kind: "image", file: "Sue the T. Rex at the Field Museum.jpg", alt: "The real skeleton of Sue, a Tyrannosaurus rex, at the Field Museum in Chicago", credit: "Wikimedia Commons (see file page)" },
  { id: "laetoli", kind: "image", file: "Laetoli footprints replica.jpg", alt: "Cast of the Laetoli footprints, left about 3.66 million years ago by upright-walking hominins", credit: "Wikimedia Commons (see file page)" },
  { id: "campfire", kind: "video", file: "Campfire.webm", alt: "A campfire burning at night", credit: "Wikimedia Commons (see file page)" },
  { id: "hands", kind: "image", file: "SantaCruz-CuevaManos-P2210651b.jpg", alt: "Hand stencils at the Cueva de las Manos, Argentina, made about 9,000 years ago", credit: "Mariano / Wikimedia Commons (see file page)" },
  { id: "lascaux", kind: "image", file: "Lascaux painting.jpg", alt: "Painted animals on the cave wall at Lascaux, France, about 17,000 years old", credit: "Public domain / Wikimedia Commons" },
  { id: "gobekli", kind: "image", file: "Göbekli Tepe, Urfa.jpg", alt: "Carved stone pillars at Göbekli Tepe, Türkiye, more than 11,000 years old", credit: "Wikimedia Commons (see file page)" },
  { id: "pyramids", kind: "image", file: "All Gizah Pyramids.jpg", alt: "The pyramids of Giza, Egypt, built about 4,500 years ago", credit: "Ricardo Liberato / Wikimedia Commons (see file page)" },
  { id: "earthrise", kind: "image", file: "NASA-Apollo8-Dec24-Earthrise.jpg", alt: "Earthrise: Earth rising over the Moon, photographed from Apollo 8 in 1968", credit: "NASA / Bill Anders" },
  { id: "iss-earth", kind: "video", file: "View of the Earth from the ISS (8K).webm", alt: "Earth turning beneath the International Space Station", credit: "NASA" },
  { id: "city-lights", kind: "video", file: "Ocean Moon Glint and City Night Lights in 4K.webm", alt: "City lights and moonlight on the ocean, filmed from the International Space Station", credit: "NASA" },
  { id: "chandrayaan", kind: "image", file: "Chandrayaan-3 – Image of Vikram lander on lunar surface taken by Pragyan rover navcam at 1104 IST, 30 August 2023 from 15 meters away (without text).webp", alt: "India's Vikram lander on the Moon near its south pole, photographed by the Pragyan rover on 30 August 2023", credit: "ISRO" },
  { id: "black-marble", kind: "image", file: "BlackMarble20161km.jpg", alt: "Earth at night: city lights across every continent", credit: "NASA Earth Observatory" },
  { id: "pale-blue-dot", kind: "image", file: "Pale Blue Dot from Voyager 1 - PIA23645.png", alt: "The Pale Blue Dot: Earth as a single pixel in a sunbeam, photographed by Voyager 1 from about 6 billion km away", credit: "NASA / JPL-Caltech" },
];

const UP = "https://upload.wikimedia.org/wikipedia/commons";

function paths(file: string) {
  const name = file.replace(/ /g, "_");
  const h = createHash("md5").update(name, "utf8").digest("hex");
  const dir = `${h[0]}/${h.slice(0, 2)}`;
  return { name, enc: encodeURIComponent(name), dir };
}

/** Special:FilePath scales on Wikimedia's side and never upscales past the original. */
const filePath = (enc: string, width: number) => `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}?width=${width}`;

function resolve(item: MediaItem): ResolvedMedia {
  const { enc, dir } = paths(item.file);
  const page = `https://commons.wikimedia.org/wiki/File:${enc}`;
  if (item.kind === "image") {
    return { ...item, page, src: filePath(enc, 1920), srcSmall: filePath(enc, 960) };
  }
  const t = `${UP}/transcoded/${dir}/${enc}/${enc}`;
  return {
    ...item,
    page,
    src: filePath(enc, 1280),
    srcSmall: filePath(enc, 960),
    sources: [
      { src: `${t}.720p.vp9.webm`, type: "video/webm" },
      { src: `${t}.480p.vp9.webm`, type: "video/webm" },
      { src: `${t}.720p.webm`, type: "video/webm" },
      { src: `${t}.480p.webm`, type: "video/webm" },
    ],
  };
}

export const media: Record<string, ResolvedMedia> = Object.fromEntries(items.map((i) => [i.id, resolve(i)]));
export const mediaList = Object.values(media);
