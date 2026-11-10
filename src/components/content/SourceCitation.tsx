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
