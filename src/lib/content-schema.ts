/**
 * Shared content types for THE JOURNEY.
 *
 * Sources live in `src/data/sources.ts`; the Chapter 1 game levels in
 * `src/components/game/levels.ts` point at them by id.
 */

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
