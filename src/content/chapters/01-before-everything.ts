import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("before-everything")!,
  subtitle: "The universe, from its hot, dense beginning to the first stars",
  opening: "Every atom of you has a history older than the Sun.",
  orientation: {
    when: "About 13.8 billion years ago, through roughly the first few hundred million years",
    where: "Everywhere: this is the history of space itself, not of one place within it",
    scale: "The observable universe is now about 93 billion light-years across",
  },
  intro:
    "The universe has a history, and we can read parts of it in the light that reaches us. That light tells a story of a cosmos that was once far hotter and denser, and that has been expanding and cooling ever since.",
  timeStart: 13_800_000_000,
  timeEnd: 13_000_000_000,
  sections: [
    {
      id: "a-universe-with-a-history",
      title: "A universe with a history",
      blocks: [
        {
          type: "lead",
          text: "For most of human history, people assumed the heavens were eternal and unchanging. In the twentieth century, careful measurement showed otherwise.",
        },
        {
          type: "paragraph",
          text: "Our best current measurements put the age of the universe at about 13.8 billion years. That number comes mainly from detailed maps of the [[cmb]] combined with the standard cosmological model. Independent methods, such as measuring how fast galaxies are moving apart today, broadly agree, although they currently disagree in the details by a few per cent. That tension is an active research question.",
          sourceIds: ["planck-2018-params", "wmap-age"],
        },
        {
          type: "keyFacts",
          items: [
            { value: "≈13.8 billion years", label: "Age of the universe, based on the standard cosmological model" },
            { value: "≈380,000 years", label: "When the universe became transparent and released the light we now see as the cosmic microwave background" },
            { value: "≈93 billion light-years", label: "Approximate diameter of the observable universe today", note: "Larger than 2 × 13.8 billion because space has expanded while light travelled" },
          ],
          sourceIds: ["planck-2018-params", "esa-planck-cmb", "britannica-observable-universe"],
        },
      ],
    },
    {
      id: "not-an-explosion",
      title: "Not an explosion, but an expansion",
      blocks: [
        {
          type: "paragraph",
          text: "The name \"Big Bang\" is misleading. The [[big-bang-model]] does not describe matter bursting out from a single point into empty space. It describes space itself expanding everywhere at once, from an early state in which everything was extremely hot and dense.",
          sourceIds: ["nasa-universe-overview"],
        },
        {
          type: "paragraph",
          text: "In the 1920s, astronomers found that light from distant galaxies is shifted towards longer, redder wavelengths, and that more distant galaxies show larger shifts. This [[redshift]] is what we would expect if the space between galaxies has been stretching while their light travelled towards us.",
          sourceIds: ["nasa-hubble-redshift"],
        },
        { type: "exhibit", exhibitId: "expanding-grid" },
        {
          type: "callout",
          tone: "analogy",
          title: "Where the analogy breaks down",
          text: "Pictures of dots on a stretching balloon help, but they can mislead. The universe is not the skin of a balloon expanding into a room. There is no known outside, and no centre that everything is moving away from. Galaxies themselves do not stretch, because gravity holds them together.",
        },
      ],
    },
    {
      id: "from-fog-to-light",
      title: "From fog to light",
      kicker: "The first few hundred thousand years",
      blocks: [
        {
          type: "paragraph",
          text: "As the early universe expanded, it cooled. Within roughly the first few minutes, protons and neutrons fused into the nuclei of the lightest elements: hydrogen, helium and a trace of lithium. The amounts predicted by this early [[nucleosynthesis]] closely match what astronomers measure in the oldest, least-processed gas in the universe.",
          sourceIds: ["nasa-universe-overview"],
        },
        {
          type: "paragraph",
          text: "For hundreds of thousands of years afterwards, the universe was too hot for electrons to stay attached to nuclei. Light could not travel far before bouncing off a free electron, so the universe was like a glowing fog. At about 380,000 years, it cooled enough for neutral atoms to form. The fog cleared and light travelled freely for the first time.",
          sourceIds: ["esa-planck-cmb"],
        },
        {
          type: "paragraph",
          text: "That ancient light still surrounds us. Stretched by 13.8 billion years of expansion, it now arrives as faint microwaves from every direction: the cosmic microwave background. Space telescopes such as NASA's WMAP and ESA's Planck have mapped tiny variations in it, and those variations are the seeds of all later structure.",
          sourceIds: ["esa-planck-cmb", "wmap-age"],
        },
        { type: "exhibit", exhibitId: "early-universe-timeline" },
      ],
    },
    {
      id: "the-first-stars",
      title: "Gravity builds the first stars",
      kicker: "The first few hundred million years",
      blocks: [
        {
          type: "paragraph",
          text: "After the light was released, the universe went dark. No stars yet existed. But matter was not perfectly smooth. Slightly denser regions pulled in more material through gravity, helped by [[dark-matter]], whose nature is still unknown.",
        },
        {
          type: "paragraph",
          text: "Over a few hundred million years, clouds of hydrogen and helium collapsed until their cores became hot and dense enough for nuclear fusion. The first stars switched on. Stars gathered into the first [[galaxy|galaxies]], which merged and grew. Telescopes such as the James Webb Space Telescope are now observing galaxies from this early era, and some of what they find is challenging the details of existing models.",
          sourceIds: ["nasa-universe-overview", "cfa-jwst-early-galaxies"],
        },
      ],
    },
    {
      id: "stars-make-elements",
      title: "Stars are element factories",
      blocks: [
        {
          type: "paragraph",
          text: "The early universe contained almost nothing but hydrogen and helium. Nearly every heavier element, including the carbon in your cells, the oxygen you breathe and the calcium in your bones, was made later, inside stars.",
          sourceIds: ["nasa-star-stuff"],
        },
        {
          type: "paragraph",
          text: "Stars shine by fusing light nuclei into heavier ones. As they age and die, they return much of that material to space: gently, as winds and expanding shells of gas, or violently, in supernova explosions. Some of the heaviest elements, such as gold, are thought to come largely from rare events like collisions between neutron stars. New generations of stars and planets then formed from this enriched material.",
          sourceIds: ["nasa-star-stuff", "nhm-stardust"],
        },
        { type: "exhibit", exhibitId: "element-origins" },
        {
          type: "pullquote",
          text: "The elements that would one day make rocks, oceans, cells and people were forged through cosmic history.",
        },
      ],
    },
    {
      id: "what-we-dont-know",
      title: "What the model does not tell us",
      blocks: [
        {
          type: "callout",
          tone: "uncertainty",
          title: "Open questions",
          text: "The Big Bang model describes how the universe developed from a hot, dense early state. It does not, by itself, explain what caused that state, or what, if anything, came before it. Physicists explore ideas such as cosmic inflation, but the very earliest moments lie beyond what current evidence can test directly. What dark matter and dark energy are also remains unknown.",
          sourceIds: ["nasa-universe-overview"],
        },
        {
          type: "paragraph",
          text: "People have long asked why there is something rather than nothing. Science can say a great deal about how the universe has changed. Questions about ultimate causes and meaning are also explored in philosophy and in religious traditions, which ask different kinds of questions and use different kinds of reasoning.",
        },
      ],
    },
  ],
  evidence: [
    {
      id: "galaxy-redshifts",
      title: "Galaxy redshifts",
      what: "Measurements of how much light from distant galaxies has been stretched to longer wavelengths.",
      helpsUs: "Shows that distant galaxies are receding, with more distant ones receding faster: the signature of expanding space.",
      howStudied: "Splitting galaxy light into spectra with telescopes and measuring the shift of known spectral lines.",
      limitations: "Converting redshift to distance relies on a model of the universe, and different methods currently give slightly different expansion rates.",
      status: "well-established",
      sourceIds: ["nasa-hubble-redshift"],
    },
    {
      id: "cmb-observations",
      title: "The cosmic microwave background",
      what: "Faint, nearly uniform microwave radiation coming from every direction in the sky.",
      helpsUs: "Records the universe about 380,000 years after the Big Bang; its pattern of tiny variations pins down the universe's age and contents.",
      howStudied: "Mapped by ground-based instruments and space missions such as COBE, WMAP and Planck.",
      limitations: "It shows us the universe from 380,000 years onwards; earlier events must be inferred.",
      status: "well-established",
      sourceIds: ["esa-planck-cmb", "planck-2018-params"],
    },
    {
      id: "light-elements",
      title: "Primordial light-element abundances",
      what: "The proportions of hydrogen, helium, deuterium and lithium in the oldest gas and stars.",
      helpsUs: "Matches what nuclear physics predicts for a universe that was once hot and dense enough for fusion in its first minutes.",
      howStudied: "Spectroscopy of very old stars and distant, chemically pristine gas clouds.",
      limitations: "The predicted amount of lithium is higher than observed: the 'lithium problem' is unresolved.",
      status: "strong-evidence",
      sourceIds: ["nasa-universe-overview"],
    },
  ],
  goDeeper: [
    {
      id: "independent-lines",
      title: "Why several independent lines of evidence matter",
      blocks: [
        {
          type: "paragraph",
          text: "Redshifts, the microwave background and light-element abundances are measured in completely different ways, by different instruments, often by different teams. Each could be explained away on its own. Together, they fit one consistent picture. That convergence is a large part of why the standard cosmological model is widely accepted, while scientists continue to test where it might need revising.",
          sourceIds: ["planck-2018-params", "nasa-universe-overview", "nasa-hubble-redshift"],
        },
      ],
    },
    {
      id: "looking-back",
      title: "Looking far is looking back",
      blocks: [
        {
          type: "paragraph",
          text: "Light travels at a finite speed, so we see distant objects as they were when the light left them. Sunlight is about eight minutes old when it reaches us. Light from the most distant galaxies left them more than 13 billion years ago. Telescopes are, in this sense, time machines.",
        },
      ],
    },
  ],
  transition: "The ingredients now existed. The story needed a place where they could come together.",
};
