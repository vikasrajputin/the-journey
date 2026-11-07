/**
 * Chapter index: the stable identity of each chapter.
 *
 * Long-form chapter content lives in `src/content/chapters`. This file holds
 * only what navigation, the progress rail and the timeline need, so those
 * components never have to load full chapter bodies.
 */

export type ChapterTheme =
  | "cosmos"
  | "earth"
  | "life"
  | "diversity"
  | "giants"
  | "human"
  | "civilisation"
  | "ideas"
  | "built"
  | "you";

export type ChapterSummary = {
  id: string;
  slug: string;
  number: number;
  title: string;
  /** Short label for compact navigation. */
  shortTitle: string;
  /** Plain-language time period. */
  timeLabel: string;
  centralQuestion: string;
  theme: ChapterTheme;
};

export const chapters: readonly ChapterSummary[] = [
  {
    id: "before-everything",
    slug: "before-everything",
    number: 1,
    title: "Before Everything",
    shortTitle: "The universe",
    timeLabel: "About 13.8 billion years ago to the first stars and galaxies",
    centralQuestion: "How did everything begin?",
    theme: "cosmos",
  },
  {
    id: "planet-earth",
    slug: "planet-earth",
    number: 2,
    title: "A Planet Is Born",
    shortTitle: "Earth",
    timeLabel: "About 4.54 billion years ago to the early development of Earth",
    centralQuestion: "How did our home come into existence?",
    theme: "earth",
  },
  {
    id: "first-life",
    slug: "first-life",
    number: 3,
    title: "The First Breath of Life",
    shortTitle: "First life",
    timeLabel: "Early Earth to the emergence of complex cells",
    centralQuestion: "How did lifeless chemistry give rise to living systems?",
    theme: "life",
  },
  {
    id: "diversification",
    slug: "diversification",
    number: 4,
    title: "When Life Diversified",
    shortTitle: "Diversity",
    timeLabel: "Complex life through the spread of plants and animals onto land",
    centralQuestion: "How did life become so diverse?",
    theme: "diversity",
  },
  {
    id: "age-of-giants",
    slug: "age-of-giants",
    number: 5,
    title: "The Age of Giants",
    shortTitle: "Giants",
    timeLabel: "The Mesozoic Era, about 252 to 66 million years ago",
    centralQuestion: "What did Earth look like before humanity?",
    theme: "giants",
  },
  {
    id: "human-story",
    slug: "human-story",
    number: 6,
    title: "The Human Story Begins",
    shortTitle: "Humans",
    timeLabel: "Millions of years ago to the spread of Homo sapiens",
    centralQuestion: "How did we become human?",
    theme: "human",
  },
  {
    id: "civilisation",
    slug: "civilisation",
    number: 7,
    title: "The Birth of Civilisation",
    shortTitle: "Civilisation",
    timeLabel: "From the end of the last Ice Age to early cities and beyond",
    centralQuestion: "How did human societies develop?",
    theme: "civilisation",
  },
  {
    id: "age-of-ideas",
    slug: "age-of-ideas",
    number: 8,
    title: "The Age of Ideas",
    shortTitle: "Ideas",
    timeLabel: "Ancient and classical eras through global intellectual traditions",
    centralQuestion: "How did humans begin understanding their world?",
    theme: "ideas",
  },
  {
    id: "world-we-built",
    slug: "world-we-built",
    number: 9,
    title: "The World We Built",
    shortTitle: "Our world",
    timeLabel: "The Scientific Revolution to the present",
    centralQuestion: "How did we get from early tools to artificial intelligence?",
    theme: "built",
  },
  {
    id: "you",
    slug: "you",
    number: 10,
    title: "And Then There Was You",
    shortTitle: "You",
    timeLabel: "The present, seen against the whole history of existence",
    centralQuestion: "Now that you know the story, how will you experience your life?",
    theme: "you",
  },
] as const;

export function getChapterSummary(slug: string): ChapterSummary | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getAdjacentChapters(slug: string): {
  previous?: ChapterSummary;
  next?: ChapterSummary;
} {
  const index = chapters.findIndex((c) => c.slug === slug);
  if (index === -1) return {};
  return { previous: chapters[index - 1], next: chapters[index + 1] };
}

export const primaryNav = [
  { href: "/journey", label: "Chapters" },
  { href: "/timeline", label: "Timeline" },
  { href: "/evidence", label: "Evidence" },
  { href: "/sources", label: "Sources" },
] as const;
