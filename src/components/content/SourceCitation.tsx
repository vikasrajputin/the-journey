import { getSource } from "@/data/sources";
import type { Source } from "@/lib/content-schema";

const typeLabel: Record<Source["sourceType"], string> = {
  research: "Research",
  museum: "Museum",
  university: "University",
  government: "Government agency",
  book: "Book",
  reference: "Reference",
};

export function SourceLine({ source }: { source: Source }) {
  return (
    <>
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="link-quiet font-medium text-text-light">
        {source.title}
        <span className="sr-only"> (opens in a new tab)</span>
        <svg aria-hidden="true" className="ml-1 inline-block align-[-1px]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" /></svg>
      </a>
      <span className="block text-sm text-muted">
        {source.organisation}
        {source.publicationDate ? `, ${source.publicationDate}` : ""} · {typeLabel[source.sourceType]}
      </span>
      <span className="mt-1 block text-sm text-text-light/80">Supports: {source.supports}</span>
      {source.note ? <span className="mt-1 block text-sm text-muted">Note: {source.note}</span> : null}
      {source.verification === "checked" && source.accessedDate ? (
        <span className="mt-1 block text-xs text-muted">Checked against this claim on {new Date(source.accessedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}.</span>
      ) : null}
      {source.verification === "located" ? (
        <span className="mt-1 block text-xs text-muted">Found on the publisher&rsquo;s site; claim-by-claim check pending (the site could not be read automatically).</span>
      ) : null}
    </>
  );
}

export const sourcePopoverId = (anchorId: string) => `sources-${anchorId}`;

/**
 * A small inline "Sources" marker at the end of a passage. Opens a panel
 * (native popover, rendered separately by <SourcePopovers>) listing the
 * sources for that passage without moving the reading position.
 */
export function SourceMarker({ ids, anchorId }: { ids: string[]; anchorId: string }) {
  const count = ids.filter((id) => getSource(id)).length;
  if (!count) return null;
  return (
    <button type="button" popoverTarget={sourcePopoverId(anchorId)} className="source-marker" aria-label={`Sources for this passage (${count})`}>
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h16M4 12h16M4 19h10" /></svg>
      <span aria-hidden="true">{count}</span>
    </button>
  );
}

export type Citation = { anchorId: string; ids: string[] };

/** One source panel per cited passage on the page. */
export function SourcePopovers({ citations }: { citations: Citation[] }) {
  return (
    <>
      {citations.map(({ anchorId, ids }) => {
        const list = ids.map(getSource).filter((s): s is Source => Boolean(s));
        if (!list.length) return null;
        const popId = sourcePopoverId(anchorId);
        return (
          <div key={popId} id={popId} popover="auto" role="dialog" aria-labelledby={`${popId}-title`} className="sheet-popover">
            <div className="flex items-start justify-between gap-4">
              <h2 id={`${popId}-title`} className="eyebrow text-muted">Sources for this passage</h2>
              <button type="button" popoverTarget={popId} popoverTargetAction="hide" className="-mt-2 -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:text-text-light" aria-label="Close sources">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <ol className="mt-2 grid gap-4">
              {list.map((s) => (
                <li key={s.id}>
                  <SourceLine source={s} />
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </>
  );
}
