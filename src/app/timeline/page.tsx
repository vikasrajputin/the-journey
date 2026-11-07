import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { TimelineExplorer, type ExplorerEvent } from "@/components/timeline/TimelineExplorer";
import { EvidenceStatusBadge } from "@/components/exhibits/EvidenceCard";
import { SourceMarker, SourcePopovers } from "@/components/content/SourceCitation";
import { timelineEvents } from "@/data/timeline";
import { getChapterSummary } from "@/data/navigation";
import { getSource } from "@/data/sources";
import { bandCompression, bands, categoryInfo, formatYears } from "@/lib/timeline-scale";

export const metadata: Metadata = {
  title: "Timeline",
  description: "The full chronology of THE JOURNEY, from about 13.8 billion years ago to the present, on a scale that keeps every era visible.",
  alternates: { canonical: "/timeline" },
};

const sorted = [...timelineEvents].sort((a, b) => b.yearsAgo - a.yearsAgo);

const explorerEvents: ExplorerEvent[] = sorted.map((e) => {
  const c = getChapterSummary(e.chapterId)!;
  return {
    id: e.id,
    title: e.title,
    yearsAgo: e.yearsAgo,
    dateLabel: e.dateLabel,
    category: e.category,
    summary: e.summary,
    status: e.status,
    chapter: { slug: c.slug, number: c.number, title: c.title },
    sources: e.sourceIds.flatMap((id) => {
      const s = getSource(id);
      return s ? [{ id: s.id, title: s.title, url: s.url, organisation: s.organisation }] : [];
    }),
  };
});

const bandOf = (yearsAgo: number) => bands.find((b) => yearsAgo <= b.older && yearsAgo >= b.younger) ?? bands.at(-1)!;

export default function TimelinePage() {
  return (
    <>
      <PageIntro eyebrow="The complete journey" title="13.8 billion years, on one scale">
        <p>
          On a straight-line scale, all of recorded human history would be thinner than a hair. This timeline
          uses a compressed scale so every era stays visible, and it tells you exactly how much each stretch
          has been compressed.
        </p>
      </PageIntro>

      <section aria-labelledby="explorer-title" className="container-wide pt-14 md:pt-20">
        <h2 id="explorer-title" className="sr-only">Interactive timeline</h2>
        <TimelineExplorer events={explorerEvents} />
      </section>

      <section aria-labelledby="scale-title" className="container-wide pt-20">
        <div className="max-w-[var(--width-reading)]">
          <p className="eyebrow text-accent">Reading the scale</p>
          <h2 id="scale-title" className="mt-2 font-display text-[length:var(--text-h2)]">How this scale works</h2>
          <p className="mt-4 text-text-light/85">
            The &ldquo;All of time&rdquo; view gives five stretches of time the same width. Inside each one, time runs
            evenly. The other views use a true scale for a shorter span, so you can see how crowded the recent
            past really is. Dates count back from the year 2000, a common convention in dating science.
          </p>
        </div>
        <div className="mt-8 overflow-x-auto" tabIndex={0} role="region" aria-label="Bands of the compressed scale (scrolls sideways on small screens)">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Bands of the compressed scale</caption>
            <thead className="text-muted">
              <tr className="border-b border-border-dark">
                <th scope="col" className="py-3 pr-4 font-medium">Band</th>
                <th scope="col" className="py-3 pr-4 font-medium">From</th>
                <th scope="col" className="py-3 pr-4 font-medium">Covers</th>
                <th scope="col" className="py-3 font-medium">Compared with a true scale</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((b) => (
                <tr key={b.id} className="border-b border-border-dark/60">
                  <th scope="row" className="py-3 pr-4 font-medium text-text-light">{b.label}</th>
                  <td className="py-3 pr-4 text-text-light/85">{formatYears(b.older)} ago</td>
                  <td className="py-3 pr-4 text-text-light/85">{formatYears(b.older - b.younger)}</td>
                  <td className="py-3 text-text-light/85">{bandCompression(b).text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="events-title" className="container-wide pt-20 pb-24">
        <div className="max-w-[var(--width-reading)]">
          <p className="eyebrow text-accent">Text version</p>
          <h2 id="events-title" className="mt-2 font-display text-[length:var(--text-h2)]">Every event, in order</h2>
          <p className="mt-4 text-text-light/85">
            The same {sorted.length} events as the interactive timeline, with their evidence status and sources.
            Dates are rounded to the precision the evidence supports.
          </p>
        </div>
        {bands.map((b) => {
          const list = sorted.filter((e) => bandOf(e.yearsAgo).id === b.id);
          if (!list.length) return null;
          return (
            <div key={b.id} className="mt-12 max-w-[var(--width-reading)]">
              <h3 className="font-display text-[length:var(--text-h3)] text-text-light">{b.label}</h3>
              <ol className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border-dark bg-border-dark">
                {list.map((e) => {
                  const c = getChapterSummary(e.chapterId)!;
                  return (
                    <li key={e.id} id={`event-${e.id}`} className="bg-night p-5">
                      <p className="text-sm text-muted">
                        <span style={{ color: categoryInfo[e.category].color }}>{e.dateLabel}</span> · {categoryInfo[e.category].label}
                      </p>
                      <p className="mt-1 font-medium text-text-light">{e.title}</p>
                      <p className="mt-2 text-sm text-text-light/80">{e.summary}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <EvidenceStatusBadge status={e.status} />
                        <Link href={`/journey/${c.slug}`} className="link-quiet text-muted hover:text-text-light">
                          Chapter {c.number}: {c.title}
                        </Link>
                        <SourceMarker ids={e.sourceIds} anchorId={`event-${e.id}`} />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
        <SourcePopovers citations={sorted.map((e) => ({ anchorId: `event-${e.id}`, ids: e.sourceIds }))} />
      </section>
    </>
  );
}
