import type { Block, CalloutTone } from "@/lib/content-schema";
import { getExhibit } from "@/content/exhibits";
import { RichText } from "@/components/content/RichText";
import { SourceMarker } from "@/components/content/SourceCitation";
import { ReviewNote } from "@/components/content/ReviewNote";
import { ExhibitShell } from "@/components/exhibits/ExhibitShell";
import { ExhibitVisual, hasExhibitVisual } from "@/components/exhibits/ExhibitVisual";

const calloutLabel: Record<CalloutTone, string> = {
  uncertainty: "What we don't know yet",
  misconception: "A common misconception",
  analogy: "About this analogy",
  note: "A note",
};

const calloutIcon: Record<CalloutTone, React.ReactNode> = {
  uncertainty: <path d="M9.1 9a3 3 0 1 1 4 2.8c-.7.3-1.1 1-1.1 1.7V14M12 17.5v.5" strokeLinecap="round" />,
  misconception: <path d="M12 8v5M12 16.5v.5M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" />,
  analogy: <path d="M4 12h6M14 12h6M10 8l4 4-4 4" strokeLinecap="round" />,
  note: <path d="M12 8v.5M12 11v5" strokeLinecap="round" />,
};

type Props = { block: Block; anchorId: string };

/** Renders one narrative block. Each block type has its own composition so sections don't look uniform. */
export function NarrativeBlock({ block, anchorId }: Props) {
  const marker = block.type !== "exhibit" && block.sourceIds?.length ? (
    <>
      {" "}
      <SourceMarker ids={block.sourceIds} anchorId={anchorId} />
    </>
  ) : null;
  const review = block.review ? <ReviewNote note={block.review} /> : null;

  switch (block.type) {
    case "lead":
      return (
        <div id={anchorId} data-reveal>
          <p className="font-display text-[length:var(--text-lead)] leading-snug text-text-light md:text-2xl">
            <RichText text={block.text} />
            {marker}
          </p>
          {review}
        </div>
      );

    case "paragraph":
      return (
        <div id={anchorId} data-reveal>
          <p className="text-text-light/88">
            <RichText text={block.text} />
            {marker}
          </p>
          {review}
        </div>
      );

    case "pullquote":
      return (
        <figure id={anchorId} className="pullquote" data-reveal>
          <blockquote>
            <p>
              <RichText text={block.text} />
            </p>
          </blockquote>
          {marker ? <figcaption className="mt-3 text-sm">{marker}</figcaption> : null}
          {review}
        </figure>
      );

    case "callout":
      return (
        <aside id={anchorId} className={`callout callout-${block.tone}`} aria-label={calloutLabel[block.tone]} data-reveal>
          <p className="eyebrow flex items-center gap-2">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {block.tone === "uncertainty" || block.tone === "note" ? <circle cx="12" cy="12" r="9" /> : null}
              {calloutIcon[block.tone]}
            </svg>
            {calloutLabel[block.tone]}
          </p>
          <h3 className="mt-2 font-display text-xl text-text-light md:text-2xl">{block.title}</h3>
          <p className="mt-2 text-text-light/85">
            <RichText text={block.text} />
            {marker}
          </p>
          {review}
        </aside>
      );

    case "keyFacts":
      return (
        <div id={anchorId} data-reveal>
          <dl className="keyfacts">
            {block.items.map((item) => (
              <div key={item.label} className="keyfact">
                <dt className="sr-only">{item.label}</dt>
                <dd className="font-display text-2xl text-chapter md:text-3xl">{item.value}</dd>
                <dd className="mt-2 text-sm text-text-light/85">{item.label}</dd>
                {item.note ? <dd className="mt-1 text-xs text-muted">{item.note}</dd> : null}
              </div>
            ))}
          </dl>
          {marker ? <p className="mt-2 text-right text-sm text-muted">Sources{marker}</p> : null}
          {review}
        </div>
      );

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <div id={anchorId} data-reveal>
          <List className={`narrative-list ${block.ordered ? "list-decimal" : ""}`}>
            {block.items.map((item, i) => (
              <li key={i}>
                <RichText text={item} />
              </li>
            ))}
          </List>
          {marker ? <p className="mt-2 text-sm text-muted">Sources{marker}</p> : null}
          {review}
        </div>
      );
    }

    case "exhibit": {
      const exhibit = getExhibit(block.exhibitId);
      if (!exhibit) return null;
      const ids = Array.from(new Set([...(block.sourceIds ?? []), ...(exhibit.sourceIds ?? [])]));
      return (
        <div id={anchorId} className="exhibit-breakout">
          <ExhibitShell exhibit={exhibit} anchorId={anchorId} sourceIds={ids}>
            {hasExhibitVisual(exhibit.id) ? <ExhibitVisual id={exhibit.id} /> : null}
          </ExhibitShell>
          {review}
        </div>
      );
    }
  }
}
