import type { EvidenceItem, EvidenceStatus } from "@/lib/content-schema";
import { SourceMarker } from "@/components/content/SourceCitation";

export const evidenceStatusInfo: Record<EvidenceStatus, { label: string; explanation: string; glyph: string }> = {
  "well-established": {
    label: "Well established",
    explanation: "Supported by many independent lines of evidence; not seriously disputed among specialists.",
    glyph: "●●●",
  },
  "strong-evidence": {
    label: "Strong evidence",
    explanation: "Well supported, though details or interpretations are still being refined.",
    glyph: "●●○",
  },
  "active-research": {
    label: "Active research",
    explanation: "Evidence exists, but new findings are changing the picture.",
    glyph: "●○○",
  },
  debated: {
    label: "Debated",
    explanation: "Specialists disagree about how to interpret the evidence.",
    glyph: "◐",
  },
  hypothesis: {
    label: "Hypothesis",
    explanation: "A proposed explanation that has not yet been well tested.",
    glyph: "○",
  },
  unknown: {
    label: "Unknown",
    explanation: "There is not yet enough evidence to say.",
    glyph: "?",
  },
};

/** Status shown as text plus a glyph, never by colour alone. */
export function EvidenceStatusBadge({ status }: { status: EvidenceStatus }) {
  const info = evidenceStatusInfo[status];
  return (
    <span className={`status-badge status-${status}`}>
      <span aria-hidden="true" className="tracking-[0.1em]">{info.glyph}</span>
      {info.label}
    </span>
  );
}

export function EvidenceCard({ item, headingLevel = 3 }: { item: EvidenceItem; headingLevel?: 3 | 4 }) {
  const H = headingLevel === 3 ? "h3" : "h4";
  const anchorId = `evidence-${item.id}`;
  return (
    <article id={anchorId} className="evidence-card" data-reveal>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <EvidenceStatusBadge status={item.status} />
        <SourceMarker ids={item.sourceIds} anchorId={anchorId} />
      </div>
      <H className="mt-4 font-display text-2xl text-text-light">{item.title}</H>
      <dl className="mt-4 grid gap-4 text-sm">
        <div>
          <dt className="eyebrow text-muted">What it is</dt>
          <dd className="mt-1 text-text-light/88">{item.what}</dd>
        </div>
        <div>
          <dt className="eyebrow text-muted">What it helps us understand</dt>
          <dd className="mt-1 text-text-light/88">{item.helpsUs}</dd>
        </div>
        <div>
          <dt className="eyebrow text-muted">How it is studied</dt>
          <dd className="mt-1 text-text-light/88">{item.howStudied}</dd>
        </div>
        <div>
          <dt className="eyebrow text-muted">What it cannot tell us</dt>
          <dd className="mt-1 text-text-light/88">{item.limitations}</dd>
        </div>
      </dl>
    </article>
  );
}
