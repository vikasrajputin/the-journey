import type { ExhibitDefinition, VisualKind } from "@/lib/content-schema";
import { SourceMarker } from "@/components/content/SourceCitation";

const kindLabel: Record<VisualKind, string> = {
  photograph: "Photograph",
  illustration: "Illustration",
  diagram: "Diagram",
  reconstruction: "Scientific reconstruction",
  simulation: "Simulation",
  data: "Data",
};

type ExhibitShellProps = {
  exhibit: ExhibitDefinition;
  anchorId: string;
  /** The visual. When absent, the text alternative is shown as the exhibit itself. */
  children?: React.ReactNode;
  /** Overrides the exhibit's own source list (e.g. merged with the placing block's sources). */
  sourceIds?: string[];
};

/**
 * Common frame for all exhibits: title, kind label (so illustrations are never
 * mistaken for photographs), caption, sources, and a text alternative that is
 * always available, and is the whole exhibit when no visual is provided.
 */
export function ExhibitShell({ exhibit, anchorId, children, sourceIds }: ExhibitShellProps) {
  const titleId = `${anchorId}-title`;
  return (
    <figure className="exhibit" aria-labelledby={titleId} data-reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="eyebrow text-chapter">Exhibit · {kindLabel[exhibit.kind]}</p>
      </div>
      <h3 id={titleId} className="mt-2 font-display text-[length:var(--text-h3)] text-text-light">
        {exhibit.title}
      </h3>

      {children ? (
        <>
          <div className="mt-6">{children}</div>
          <details className="mt-6 text-sm">
            <summary className="cursor-pointer text-muted hover:text-text-light">Read this exhibit as text</summary>
            <p className="mt-3 max-w-[var(--width-reading)] text-text-light/85">{exhibit.textAlternative}</p>
          </details>
        </>
      ) : (
        <p className="mt-4 max-w-[var(--width-reading)] text-text-light/85">{exhibit.textAlternative}</p>
      )}

      <figcaption className="mt-6 border-t border-border-dark pt-4 text-sm text-muted">
        {exhibit.caption}
        {exhibit.credit ? <> Credit: {exhibit.credit}.</> : null}{" "}
        <SourceMarker ids={sourceIds ?? exhibit.sourceIds ?? []} anchorId={anchorId} />
      </figcaption>
    </figure>
  );
}
