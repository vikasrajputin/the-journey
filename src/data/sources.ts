import type { Source } from "@/lib/content-schema";

/**
 * Source registry. Every entry was found on the publisher's own site, and its
 * title and URL are recorded as published. Entries move from "located" to
 * "checked" once the page has been re-read against the exact claim it
 * supports. On 2026-11-07 every reachable page was checked this way; entries
 * still marked "located" are on publisher sites that block automated reading. Do not add an entry from memory.
 */
const ACCESSED = "2026-11-07";

const raw: Omit<Source, "accessedDate">[] = [
  {
    id: "planck-2018-params",
    title: "Planck 2018 results. VI. Cosmological parameters",
    organisation: "Planck Collaboration, Astronomy & Astrophysics",
    publicationDate: "2020",
    url: "https://www.aanda.org/articles/aa/abs/2020/09/aa33910-18/aa33910-18.html",
    sourceType: "research",
    verification: "located",
    supports: "Age of the universe (about 13.8 billion years) and the parameters of the standard cosmological model.",
    note: "Primary research paper. The publisher page shows the abstract only; the age figure is in the full paper.",
  },

  {
    id: "wmap-age",
    title: "WMAP Overview",
    organisation: "NASA Science, Wilkinson Microwave Anisotropy Probe mission",
    url: "https://science.nasa.gov/mission/wmap/wmap-overview/",
    sourceType: "government",
    verification: "checked",
    supports: "Age of the universe of 13.77 billion years, to about half a percent, from maps of the cosmic microwave background.",
    note: "Replaces the mission's former Universe 101 pages, which now redirect here.",
  },

  {
    id: "esa-planck-cmb",
    title: "Planck and the cosmic microwave background",
    organisation: "European Space Agency",
    url: "https://www.esa.int/Science_Exploration/Space_Science/Planck/Planck_and_the_cosmic_microwave_background",
    sourceType: "government",
    verification: "checked",
    supports: "The CMB as light released about 380,000 years after the Big Bang, when the universe became transparent.",
  },

  {
    id: "nasa-hubble-redshift",
    title: "Cosmological Redshift",
    organisation: "NASA Science, Hubble Space Telescope",
    url: "https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-cosmological-redshift",
    sourceType: "government",
    verification: "checked",
    supports: "Redshift of distant galaxies as evidence that space is expanding.",
  },

  {
    id: "nasa-star-stuff",
    title: "Are we really made of star stuff?",
    organisation: "NASA Science, Astrobiology",
    url: "https://science.nasa.gov/astrobiology/learning-resources/alp/are-we-really-made-of-star-stuff/",
    sourceType: "government",
    verification: "checked",
    supports: "Formation of elements in stars and stellar explosions, and the cosmic origin of the atoms in living things.",
  },

  {
    id: "nhm-stardust",
    title: "Are we made of stardust?",
    organisation: "Natural History Museum, London",
    url: "https://www.nhm.ac.uk/discover/are-we-really-made-of-stardust.html",
    sourceType: "museum",
    verification: "checked",
    supports: "Origin of the elements in the human body.",
    note: "Museum explainer.",
  },

  {
    id: "nasa-universe-overview",
    title: "Universe: Overview",
    organisation: "NASA Science",
    url: "https://science.nasa.gov/universe/overview/",
    sourceType: "government",
    verification: "checked",
    supports: "General overview of the Big Bang model and cosmic history.",
  },


  {
    id: "cfa-jwst-early-galaxies",
    title: "JWST Draws Back Curtain on Universe's Early Galaxies",
    organisation: "Center for Astrophysics | Harvard & Smithsonian",
    publicationDate: "2022-11-17",
    url: "https://cfa.harvard.edu/index.php/news/jwst-draws-back-curtain-universes-early-galaxies",
    sourceType: "university",
    verification: "checked",
    supports: "Webb observations of unexpectedly bright galaxies a few hundred million years after the Big Bang, challenging models of galaxy formation.",
    note: "News release about specific early results; later studies continue to refine them.",
  },
];


export const sources: readonly Source[] = raw.map((s) => ({ ...s, accessedDate: ACCESSED }));

const byId = new Map(sources.map((s) => [s.id, s]));

export function getSource(id: string): Source | undefined {
  return byId.get(id);
}
