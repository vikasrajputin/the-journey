import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { methods } from "@/content/methods";
import { getChapterSummary } from "@/data/navigation";
import { evidenceStatusInfo, EvidenceStatusBadge } from "@/components/exhibits/EvidenceCard";
import { SourceMarker, SourcePopovers } from "@/components/content/SourceCitation";
import { PRESENT_YEAR, type EvidenceStatus } from "@/lib/content-schema";

export const metadata: Metadata = {
  title: "How do we know?",
  description: "The methods behind the story: dating techniques, fossils, ice cores, ancient DNA, cosmic light and historical sources, and what each one cannot tell us.",
  alternates: { canonical: "/evidence" },
};

const statuses = Object.keys(evidenceStatusInfo) as EvidenceStatus[];

export default function EvidencePage() {
  return (
    <>
      <PageIntro eyebrow="Evidence and methods" title="How do we know?">
        <p>
          Every date and claim in this exhibition rests on evidence that someone gathered, tested and argued
          about. This guide explains the main methods, what each one can tell us, and where each one stops.
        </p>
      </PageIntro>

      <div className="container-wide pt-14 pb-24 md:pt-20 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Methods on this page" className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-height)+2rem)]">
            <p className="eyebrow text-muted">On this page</p>
            <ol className="mt-4 grid gap-1 border-l border-border-dark text-sm">
              {methods.map((m) => (
                <li key={m.id}>
                  <a href={`#${m.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-muted hover:border-accent hover:text-text-light">
                    {m.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#reading-evidence" className="-ml-px block border-l border-transparent py-1.5 pl-4 text-muted hover:border-accent hover:text-text-light">
                  Reading the labels
                </a>
              </li>
              <li>
                <a href="#uncertainty" className="-ml-px block border-l border-transparent py-1.5 pl-4 text-muted hover:border-accent hover:text-text-light">
                  Living with uncertainty
                </a>
              </li>
            </ol>
          </div>
        </nav>

        <div className="min-w-0">
          <div className="grid gap-6">
            {methods.map((m, i) => (
              <article key={m.id} id={m.id} aria-labelledby={`${m.id}-title`} className="evidence-card scroll-mt-28 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="eyebrow text-accent">
                    <span aria-hidden="true" className="tabular-nums">{String(i + 1).padStart(2, "0")} · </span>
                    {m.question}
                  </p>
                  <SourceMarker ids={m.sourceIds} anchorId={`method-${m.id}`} />
                </div>
                <h2 id={`${m.id}-title`} className="mt-3 font-display text-[length:var(--text-h3)] text-text-light">
                  {m.title}
                </h2>
                <p className="mt-2 text-sm text-muted">Typical reach: {m.range}</p>
                <dl className="mt-6 grid gap-5 text-[0.95rem] md:grid-cols-3 md:gap-8">
                  <div>
                    <dt className="eyebrow text-muted">How it works</dt>
                    <dd className="mt-2 text-text-light/85">{m.how}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-muted">What it can tell us</dt>
                    <dd className="mt-2 text-text-light/85">{m.tells}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-muted">Where it stops</dt>
                    <dd className="mt-2 text-text-light/85">{m.limits}</dd>
                  </div>
                </dl>
                <p className="mt-6 text-sm text-muted">
                  Used in:{" "}
                  {m.chapters.map((slug, ci) => {
                    const c = getChapterSummary(slug)!;
                    return (
                      <span key={slug}>
                        {ci ? ", " : ""}
                        <Link href={`/journey/${slug}#evidence`} className="link-quiet text-text-light/85">
                          Chapter {c.number}, {c.title}
                        </Link>
                      </span>
                    );
                  })}
                </p>
              </article>
            ))}
          </div>

          <section id="reading-evidence" aria-labelledby="reading-evidence-title" className="scroll-mt-28 pt-20">
            <div className="max-w-[var(--width-reading)]">
              <p className="eyebrow text-accent">Labels used across the exhibition</p>
              <h2 id="reading-evidence-title" className="mt-2 font-display text-[length:var(--text-h2)]">Reading the evidence labels</h2>
              <p className="mt-4 text-text-light/85">
                Evidence cards and timeline events carry a label saying how settled the question is. The label always
                appears as words and a symbol, never as colour alone.
              </p>
            </div>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border-dark bg-border-dark sm:grid-cols-2">
              {statuses.map((s) => (
                <div key={s} className="bg-night p-5">
                  <dt><EvidenceStatusBadge status={s} /></dt>
                  <dd className="mt-3 text-sm text-text-light/85">{evidenceStatusInfo[s].explanation}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 grid max-w-[var(--width-reading)] gap-4 text-text-light/85">
              <h3 className="font-display text-[length:var(--text-h3)] text-text-light">Sources and editorial notes</h3>
              <p>
                Every source in the <Link href="/sources" className="link-quiet text-accent">source directory</Link> was found on
                its publisher&rsquo;s own site. Sources marked <strong className="text-text-light">checked</strong> have been
                re-read against the exact claim they support. Sources marked as awaiting a check sit on sites that could not be
                read automatically, and still need a person to confirm them.
              </p>
              <p>
                Passages marked <span className="review-note inline">Awaiting editorial review</span> are complete and written
                from the cited sources, but still need a specialist to confirm a figure or add a more specific source.
              </p>
            </div>
          </section>

          <section id="uncertainty" aria-labelledby="uncertainty-title" className="scroll-mt-28 pt-20">
            <div className="max-w-[var(--width-reading)] text-text-light/85">
              <p className="eyebrow text-accent">A note on numbers</p>
              <h2 id="uncertainty-title" className="mt-2 font-display text-[length:var(--text-h2)] text-text-light">Living with uncertainty</h2>
              <p className="mt-4">
                Dates in this exhibition are rounded to the precision the evidence supports. &ldquo;About 66 million years
                ago&rdquo; is a precise measurement with a small margin of error; &ldquo;roughly 12,000 to
                10,000 years ago&rdquo; for the start of farming in Southwest Asia is a range, because the change happened over
                a long span, not in a moment. Words like <em>about</em>, <em>roughly</em> and{" "}
                <em>at least</em> are there on purpose.
              </p>
              <p className="mt-4">
                &ldquo;Years ago&rdquo; on the timeline counts back from the year {PRESENT_YEAR}. Radiocarbon laboratories count
                &ldquo;before present&rdquo; from 1950 instead. At the scale of millions of years the difference does not matter; for the last few
                centuries, calendar years are given as well.
              </p>
              <p className="mt-4">
                When new evidence changes a date or an interpretation, that is the method working. Many of the ideas in this
                exhibition were revised in living memory, and some will be revised again.
              </p>
            </div>
          </section>
        </div>
      </div>
      <SourcePopovers citations={methods.map((m) => ({ anchorId: `method-${m.id}`, ids: m.sourceIds }))} />
    </>
  );
}
