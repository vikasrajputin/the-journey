/**
 * Typed content model for THE JOURNEY.
 *
 * Content (chapters, sources, glossary, timeline) lives in plain TypeScript
 * data files so editors can change wording without touching components.
 * `validateContent()` in `content-validate.ts` checks cross-references at
 * build time, and the build fails if anything is broken.
 *
 * Inline text conventions (see CONTENT_GUIDE.md):
 *   [[term-id]]            glossary term, displayed using the glossary's term
 *   [[term-id|shown text]] glossary term with custom display text
 *   *emphasis*             italic
 */

import type { ChapterSummary } from "@/data/navigation";

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

export type SourceType = "research" | "museum" | "university" | "government" | "book" | "reference";

/**
 * - "located": found through a search; title, publisher and URL recorded as published,
 *   but the page has not yet been re-read against the specific claim.
 * - "checked": the page was opened and confirmed to support the claim it is attached to.
 */
export type SourceVerification = "located" | "checked";

export type Source = {
  id: string;
  title: string;
  organisation: string;
  authors?: string[];
  /** ISO date or year, only when stated by the source. */
  publicationDate?: string;
  url: string;
  sourceType: SourceType;
  /** ISO date the source was last accessed by the editors. */
  accessedDate?: string;
  verification: SourceVerification;
  /** What this source is used to support. */
  supports: string;
  /** Caveats: e.g. "museum summary", "press release", "single study". */
  note?: string;
};

/* ------------------------------------------------------------------ */
/* Evidence                                                            */
/* ------------------------------------------------------------------ */

export type EvidenceStatus =
  | "well-established"
  | "strong-evidence"
  | "active-research"
  | "debated"
  | "hypothesis"
  | "unknown";

export type EvidenceItem = {
  id: string;
  title: string;
  /** What the evidence is. */
  what: string;
  /** What it helps us understand. */
  helpsUs: string;
  /** How it is studied. */
  howStudied: string;
  /** What it cannot tell us. */
  limitations: string;
  status: EvidenceStatus;
  sourceIds: string[];
};

/* ------------------------------------------------------------------ */
/* Narrative blocks                                                    */
/* ------------------------------------------------------------------ */

type BlockBase = {
  /** Sources that support the factual claims in this block. */
  sourceIds?: string[];
  /** If set, the block shows a visible "awaiting editorial review" note with this explanation. */
  review?: string;
};

export type ParagraphBlock = BlockBase & { type: "paragraph"; text: string };
export type LeadBlock = BlockBase & { type: "lead"; text: string };
export type PullQuoteBlock = BlockBase & { type: "pullquote"; text: string };

export type CalloutTone = "uncertainty" | "misconception" | "analogy" | "note";
export type CalloutBlock = BlockBase & {
  type: "callout";
  tone: CalloutTone;
  title: string;
  text: string;
};

export type KeyFact = { value: string; label: string; note?: string };
export type KeyFactsBlock = BlockBase & { type: "keyFacts"; items: KeyFact[] };

export type ListBlock = BlockBase & { type: "list"; ordered?: boolean; items: string[] };

/** Places a visual exhibit (diagram, timeline segment, comparison) inline. */
export type ExhibitBlock = BlockBase & { type: "exhibit"; exhibitId: string };

export type Block =
  | ParagraphBlock
  | LeadBlock
  | PullQuoteBlock
  | CalloutBlock
  | KeyFactsBlock
  | ListBlock
  | ExhibitBlock;

export type Section = {
  id: string;
  title: string;
  /** Optional short time label shown beside the heading, e.g. "About 380,000 years after". */
  kicker?: string;
  blocks: Block[];
};

export type DeepDive = {
  id: string;
  title: string;
  blocks: Block[];
};

/* ------------------------------------------------------------------ */
/* Exhibits                                                            */
/* ------------------------------------------------------------------ */

/** How a visual relates to reality. Always shown in captions. */
export type VisualKind = "photograph" | "illustration" | "diagram" | "reconstruction" | "simulation" | "data";

export type ExhibitDefinition = {
  id: string;
  title: string;
  kind: VisualKind;
  /** Plain-language caption shown under the exhibit. */
  caption: string;
  /** Full text alternative: everything the visual communicates, in words. */
  textAlternative: string;
  sourceIds?: string[];
  credit?: string;
};

/* ------------------------------------------------------------------ */
/* Chapters                                                            */
/* ------------------------------------------------------------------ */

export type Orientation = {
  when: string;
  where: string;
  scale: string;
};

export type Chapter = ChapterSummary & {
  subtitle: string;
  /** Cinematic opening statement. */
  opening: string;
  orientation: Orientation;
  /** Short introduction under the chapter header. */
  intro: string;
  /** Timeline span in years before present (see `TIME_CONVENTION`). */
  timeStart?: number;
  timeEnd?: number;
  sections: Section[];
  evidence: EvidenceItem[];
  goDeeper: DeepDive[];
  /** Concise transition into the next chapter. */
  transition: string;
};

/* ------------------------------------------------------------------ */
/* Glossary                                                            */
/* ------------------------------------------------------------------ */

export type GlossaryEntry = {
  id: string;
  term: string;
  definition: string;
  sourceIds?: string[];
  related?: string[];
};

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

/**
 * TIME_CONVENTION: all deep-time values are "years before present", where
 * present = 2000 CE. Calendar dates are stored separately as signed years
 * (negative = BCE) and converted with `yearToYearsAgo`. Nothing in the
 * content mixes the two without conversion.
 */
export const PRESENT_YEAR = 2000;

export type TimelineCategory = "cosmic" | "earth" | "life" | "human-evolution" | "civilisation" | "science-technology";

export type TimelineEvent = {
  id: string;
  title: string;
  /** Years before present (present = 2000 CE). */
  yearsAgo: number;
  /** Optional range for estimates. */
  range?: [number, number];
  /** Calendar year for historical events (negative = BCE). */
  calendarYear?: number;
  /** Human label for the date, e.g. "About 3.5 billion years ago". */
  dateLabel: string;
  category: TimelineCategory;
  summary: string;
  chapterId: string;
  status: EvidenceStatus;
  sourceIds: string[];
};
