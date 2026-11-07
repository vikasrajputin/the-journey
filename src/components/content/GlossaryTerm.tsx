import Link from "next/link";
import { getGlossaryEntry } from "@/content/glossary";

export const glossaryPopoverId = (id: string) => `glossary-${id}`;

/**
 * An inline glossary term. Uses the native Popover API, so it opens and
 * closes (including Escape and click-outside) without any JavaScript, and
 * never moves the reader's scroll position. Each term's definition panel
 * is rendered once per page by <GlossaryPopovers>.
 */
export function GlossaryTerm({ id, label }: { id: string; label: string }) {
  return (
    <button
      type="button"
      popoverTarget={glossaryPopoverId(id)}
      className="glossary-term"
      aria-label={`${label}: show definition`}
    >
      {label}
    </button>
  );
}

/** Renders one definition panel for each glossary id used on the page. */
export function GlossaryPopovers({ ids }: { ids: Iterable<string> }) {
  return (
    <>
      {Array.from(new Set(ids)).map((id) => {
        const entry = getGlossaryEntry(id);
        if (!entry) return null;
        const popId = glossaryPopoverId(id);
        return (
          <div key={id} id={popId} popover="auto" role="dialog" aria-labelledby={`${popId}-title`} className="sheet-popover">
            <div className="flex items-start justify-between gap-4">
              <p className="eyebrow text-muted">Glossary</p>
              <button type="button" popoverTarget={popId} popoverTargetAction="hide" className="-mt-2 -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:text-text-light" aria-label="Close definition">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <h2 id={`${popId}-title`} className="font-display text-2xl">{entry.term}</h2>
            <p className="mt-3 text-text-light/90">{entry.definition}</p>
            <Link href={`/glossary#${entry.id}`} className="link-quiet mt-4 inline-block text-sm text-accent">
              Open the full glossary
            </Link>
          </div>
        );
      })}
    </>
  );
}
