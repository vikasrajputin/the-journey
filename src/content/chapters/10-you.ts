import type { Chapter } from "@/lib/content-schema";
import { getChapterSummary } from "@/data/navigation";

export const chapter: Chapter = {
  ...getChapterSummary("you")!,
  subtitle: "From cosmic time back to a human life",
  opening: "You are not the centre of the universe. But you are a part of it that can look back, ask questions, and experience being alive.",
  orientation: {
    when: "Now",
    where: "Wherever you are reading this",
    scale: "One human lifetime, set against 13.8 billion years",
  },
  intro:
    "After billions of years of stars, planets, cells, extinctions, migrations, harvests, ideas and inventions, the story arrives at the present moment, and at you.",
  timeStart: 100,
  timeEnd: 0,
  sections: [
    {
      id: "a-brief-life",
      title: "A brief life",
      blocks: [
        {
          type: "paragraph",
          text: "A human life is extraordinarily short compared with cosmic and geological time. If the whole history of the universe were squeezed into a single 80-year lifetime, a real human life would occupy only the last few seconds.",
          sourceIds: ["planck-2018-params"],
        },
        { type: "exhibit", exhibitId: "lifetime-scale" },
        {
          type: "paragraph",
          text: "That can feel humbling. But duration is not the only measure of meaning. A piece of music is not worth less because it is short. A conversation, a kindness, a discovery or a moment of wonder matters while it happens, and often long after.",
        },
      ],
    },
    {
      id: "connected",
      title: "Connected to everything before",
      blocks: [
        {
          type: "paragraph",
          text: "Most of the atoms in your body, apart from hydrogen, were forged in stars that lived and died before the Sun existed. The water in you has cycled through oceans, clouds and other living things for billions of years.",
          sourceIds: ["nasa-star-stuff", "nhm-stardust"],
        },
        {
          type: "paragraph",
          text: "Your cells carry the legacy of microbes that learned to cooperate. Your skeleton echoes fish that pulled themselves into shallow water. You descend from an unbroken chain of ancestors stretching back through the first humans, the first mammals and the first cells. Every one of them survived long enough to pass life on.",
          sourceIds: ["ue-endosymbiosis-evidence", "ue-tetrapods"],
        },
        {
          type: "paragraph",
          text: "And you are shaped by people: those who raised you, taught you, fed you, wrote the books you read, discovered the medicines that kept you alive, and built the language you think in. Your life rests on the work and care of countless others.",
        },
      ],
    },
    {
      id: "what-science-can-say",
      title: "What science can and cannot say",
      blocks: [
        {
          type: "paragraph",
          text: "Science can describe a great deal about how you came to exist: the physics of stars, the chemistry of life, the biology of evolution, the history of human societies. It is our most reliable way of finding out how the natural world works.",
        },
        {
          type: "paragraph",
          text: "Questions of value, purpose and meaning also involve philosophy, culture, religion, relationships and personal reflection. People have answered them in many different ways. This exhibition does not tell you what to believe. It offers the story, and the evidence, and leaves the rest to you.",
        },
      ],
    },
    {
      id: "here-you-are",
      title: "And somehow, you are here",
      blocks: [
        {
          type: "pullquote",
          text: "Billions of years passed. Stars were born and died. Planets formed. Life changed, survived and diversified. Countless generations lived before you. And somehow, you are here.",
        },
        {
          type: "paragraph",
          text: "You do not have to be the centre of the universe to have a meaningful life. You are part of a story far larger than any one person, and you have the rare opportunity to experience it.",
        },
        {
          type: "paragraph",
          text: "Appreciate the people around you. Stay curious. Keep learning. Notice the ordinary moments. This extraordinary opportunity is called life.",
        },
      ],
    },
  ],
  evidence: [],
  goDeeper: [
    {
      id: "keep-exploring",
      title: "Keep exploring",
      blocks: [
        {
          type: "paragraph",
          text: "Every chapter of this exhibition links to the sources behind it. Visit the timeline to see the whole story on one scale, or the evidence guide to learn how scientists and historians know what they know, and where they are still unsure.",
        },
      ],
    },
  ],
  transition: "The journey continues with you.",
};
