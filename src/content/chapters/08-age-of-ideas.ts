import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("age-of-ideas")!,
  subtitle: "A global conversation about numbers, stars, bodies, minds and meaning",
  opening: "Knowledge became a conversation across generations, and across the world.",
  orientation: {
    when: "From the first millennium BCE through roughly the 1500s CE, with roots much older",
    where: "South Asia, East Asia, Africa, the Mediterranean, the Middle East, the Americas and beyond",
    scale: "Ideas carried by individuals, schools, libraries, trade routes and empires",
  },
  intro:
    "People in many societies watched the sky, counted, healed, built and asked what a good life is. Their ideas were written, memorised, translated, argued over and carried along trade routes, so that knowledge from one place often shaped thinking in another.",
  timeStart: 3_000,
  timeEnd: 500,
  sections: [
    {
      id: "many-traditions",
      title: "Many traditions, not one",
      blocks: [
        {
          type: "lead",
          text: "There is no single starting point for human thought. Intellectual traditions arose in many places, often independently, and then influenced one another.",
        },
        {
          type: "paragraph",
          text: "Babylonian scribes recorded astronomical observations and solved mathematical problems on clay tablets; one famous tablet, Plimpton 322, lists numbers related to right triangles more than a thousand years before Pythagoras, though historians still debate its purpose. Thinkers in ancient India, China and Greece built schools of philosophy, logic and ethics. In Mesoamerica, Maya scholars developed sophisticated calendars and tracked the movements of Venus.",
          sourceIds: ["maa-plimpton", "loc-maya-heavens"],
        },
        {
          type: "paragraph",
          text: "Mathematicians in South Asia developed a decimal place-value system with a symbol for zero. The Bakhshali manuscript, held at Oxford's Bodleian Library, contains one of the earliest known written uses of a dot as a zero placeholder; radiocarbon dating of its birch-bark pages gave a range of dates, and how to interpret them is still discussed by scholars.",
          sourceIds: ["ox-bakhshali"],
        },
      ],
    },
    {
      id: "knowledge-travels",
      title: "Knowledge travels",
      blocks: [
        {
          type: "paragraph",
          text: "Ideas moved through translation, trade, conquest, migration, pilgrimage and scholarly exchange. In Abbasid Baghdad, from the late eighth century CE, scholars translated works of Greek, Persian and Indian science and philosophy into Arabic, and added substantial original work of their own in mathematics, astronomy, optics and medicine.",
          sourceIds: ["britannica-bayt-al-hikmah"],
        },
        {
          type: "paragraph",
          text: "Centuries later, many of these Arabic works were translated into Latin and shaped learning in medieval Europe. The numerals used in much of the world today are often called 'Hindu–Arabic' because of this journey. Paper-making spread west from China, and woodblock printing in East Asia produced books such as the Diamond Sutra, dated 868 CE, centuries before printing with movable metal type spread in Europe.",
          sourceIds: ["bl-diamond-sutra", "britannica-bayt-al-hikmah"],
          review: "Add a source for the westward spread of paper-making.",
        },
        { type: "exhibit", exhibitId: "knowledge-network" },
        {
          type: "paragraph",
          text: "In West Africa, cities such as Timbuktu became centres of Islamic scholarship, where manuscripts on law, theology, astronomy, medicine and mathematics were copied, studied and preserved in family libraries, some of which survive today.",
          sourceIds: ["loc-timbuktu"],
        },
      ],
    },
    {
      id: "religions",
      title: "Religions and philosophies",
      blocks: [
        {
          type: "paragraph",
          text: "Religious traditions are among the most important parts of human cultural and intellectual history. Hinduism, Buddhism, Jainism, Judaism, Zoroastrianism, Confucianism, Daoism, Christianity, Islam, Sikhism and many Indigenous traditions developed rich systems of ethics, law, ritual, art, philosophy and community, and continue to shape the lives of billions of people.",
        },
        {
          type: "callout",
          tone: "note",
          title: "How this exhibition treats belief",
          text: "We describe religious traditions with respect and attribute their teachings to the traditions themselves. Historians can study when and how texts were written, transmitted and interpreted. Whether a tradition's theological claims are true is a matter of faith and philosophy, not something historical or scientific evidence can settle either way.",
        },
      ],
    },
    {
      id: "how-texts-survive",
      title: "How ancient texts reach us",
      blocks: [
        {
          type: "paragraph",
          text: "When we read an ancient text, we are usually reading the end of a long chain. A work may have been composed by one or many people, passed on by [[oral-transmission]] for generations, written down, and recopied by hand many times. The oldest surviving [[manuscript]] is often centuries younger than the original composition.",
        },
        { type: "exhibit", exhibitId: "text-evidence-layers" },
        {
          type: "paragraph",
          text: "The Dead Sea Scrolls are a striking example. Discovered from 1947 in caves near the Dead Sea, they include copies of Hebrew Bible texts roughly a thousand years older than the previously oldest known complete manuscripts. Comparing them through [[textual-criticism]] shows both remarkable continuity and real variation between versions.",
          sourceIds: ["dss-intro"],
        },
        {
          type: "callout",
          tone: "uncertainty",
          title: "Dates and authors are often debated",
          text: "For many ancient texts, including epics and scriptures, scholars disagree about when they were composed and by whom. Traditional accounts, historical context, manuscript evidence and later interpretation are different kinds of evidence. This exhibition avoids giving a single date or author where scholarship is divided.",
        },
      ],
    },
    {
      id: "observation",
      title: "Watching, measuring, recording",
      blocks: [
        {
          type: "paragraph",
          text: "Across cultures, careful observation built up over generations. Astronomers in Babylon, China, India, the Islamic world and Mesoamerica kept long records of the sky, which made it possible to predict eclipses and refine calendars. Physicians recorded symptoms and treatments. Engineers developed methods for irrigation, construction and surveying.",
          sourceIds: ["loc-maya-heavens"],
          review: "Add sources for Chinese and Islamic astronomical records.",
        },
        {
          type: "paragraph",
          text: "What made knowledge cumulative was not genius alone but institutions: schools, libraries, observatories, translation centres and networks of correspondence that preserved records, trained new scholars and allowed ideas to be checked and challenged.",
        },
      ],
    },
  ],
  evidence: [
    {
      id: "manuscripts",
      title: "Manuscripts, inscriptions and material culture",
      what: "Handwritten books, inscriptions on stone and metal, tablets, and the objects and buildings around them.",
      helpsUs: "Preserves the words of past thinkers and shows how ideas were used and shared.",
      howStudied: "Palaeography (study of handwriting), materials analysis, radiocarbon dating and archaeological context.",
      limitations: "Only a fraction of what was written survives, and surviving copies may be far younger than the originals.",
      status: "strong-evidence",
      sourceIds: ["dss-intro", "ox-bakhshali", "loc-timbuktu"],
    },
    {
      id: "textual-criticism",
      title: "Textual criticism and manuscript comparison",
      what: "Systematic comparison of different copies of the same text.",
      helpsUs: "Shows how texts changed over time and helps reconstruct earlier versions.",
      howStudied: "Collating variants, studying scribal habits and building family trees of manuscripts.",
      limitations: "Reconstructions are probabilities, not certainties, and depend on which copies happen to survive.",
      status: "well-established",
      sourceIds: ["dss-intro"],
    },
    {
      id: "corroboration",
      title: "Independent corroboration",
      what: "Agreement between different, independent kinds of evidence, such as a text, an inscription and an excavated site.",
      helpsUs: "Strengthens confidence that an event or person existed as described.",
      howStudied: "Comparing sources that did not depend on each other.",
      limitations: "Many events are recorded by only one source, or by sources with a shared viewpoint.",
      status: "well-established",
      sourceIds: ["nps-archaeology-dating"],
    },
    {
      id: "history-vs-faith",
      title: "Historical evidence and faith-based interpretation",
      what: "The distinction between what can be investigated historically and what is held as a matter of belief.",
      helpsUs: "Allows respectful discussion of religious texts without confusing different kinds of claims.",
      howStudied: "Historians apply the same methods to all texts; theologians and believers interpret them within their traditions.",
      limitations: "Historical methods cannot confirm or refute supernatural claims.",
      status: "well-established",
      sourceIds: [],
    },
  ],
  goDeeper: [
    {
      id: "zero",
      title: "The story of zero",
      blocks: [
        {
          type: "paragraph",
          text: "Several cultures used a placeholder to mark an empty position in a number, including Babylonian scribes and Maya calendar-makers. The idea of zero as a number in its own right, which can be added, subtracted and multiplied, was developed by Indian mathematicians, notably Brahmagupta in the seventh century CE.",
          sourceIds: ["ox-bakhshali"],
          review: "Add a source on Brahmagupta and the Babylonian and Maya placeholders.",
        },
      ],
    },
  ],
  transition: "Ideas were now preserved, challenged and passed on. Soon, new methods and new tools would accelerate the conversation dramatically.",
};
