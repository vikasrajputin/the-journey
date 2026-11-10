import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { SourceLine } from "@/components/content/SourceCitation";
import { SourceFilter } from "@/components/content/SourceFilter";
import { sources } from "@/data/sources";
import { levels } from "@/components/game/levels";
import type { Source } from "@/lib/content-schema";

export const metadata: Metadata = {
  title: "Sources",
  description: "The science behind the Chapter 1 game, level by level: research, museum, university and government sources, each checked against the claim it supports.",
  alternates: { canonical: "/sources" },
};

const byId = new Map(sources.map((s) => [s.id, s]));
const groups = levels.map((l) => ({
  id: `level-${l.id}`,
  title: `Level ${l.number}: ${l.name}`,
  list: l.sourceIds
    .map((id) => byId.get(id))
    .filter((s): s is Source => Boolean(s)),
}));
const used = new Set(groups.flatMap((g) => g.list.map((s) => s.id)));
const other = sources.filter((s) => !used.has(s.id));
const checked = sources.filter((s) => s.verification === "checked").length;
const totalEntries = groups.reduce((n, g) => n + g.list.length, 0) + other.length;

function Entry({ source }: { source: Source }) {
  const search = [source.title, source.organisation, source.supports, source.sourceType, source.note ?? ""].join(" ").toLowerCase();
  return (
    <li data-source-item data-search={search} className="bg-night p-5 text-sm">
      <SourceLine source={source} />
    </li>
  );
}

export default function SourcesPage() {
  return (
    <>
      <PageIntro eyebrow="Sources" title="Where the story comes from">
        <p>
          Every fact in the Chapter 1 game comes from here, level by level. Every source was found on its
          publisher&rsquo;s own site; {checked} of {sources.length} have been re-read against the exact claim they support.
        </p>
      </PageIntro>

      <div className="container-wide pt-14 pb-24 md:pt-20">
        <div className="grid max-w-[var(--width-reading)] gap-4 text-text-light/85">
          <h2 className="font-display text-[length:var(--text-h3)] text-text-light">How sources are chosen and checked</h2>
          <p>
            We prefer peer-reviewed research, museums, universities and public scientific agencies. Each entry says
            what it is used to support, and any caveats, such as a press release or a single study.
          </p>
          <p>
            Entries marked &ldquo;claim-by-claim check pending&rdquo; are on publisher sites that could not be read
            automatically; a person still needs to confirm them.
          </p>
        </div>

        <div className="mt-10">
          <SourceFilter total={totalEntries} />
        </div>

        <nav aria-label="Source groups" className="mt-8">
          <ul className="flex flex-wrap gap-2 text-sm">
            {groups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="inline-flex min-h-10 items-center rounded-full border border-border-dark px-3 text-muted hover:border-accent hover:text-text-light">
                  {g.title.split(":")[0]}
                </a>
              </li>
            ))}
            {other.length ? (
              <li>
                <a href="#other-sources" className="inline-flex min-h-10 items-center rounded-full border border-border-dark px-3 text-muted hover:border-accent hover:text-text-light">
                  Background
                </a>
              </li>
            ) : null}
          </ul>
        </nav>

        {groups.map((g) => (
          <section key={g.id} id={g.id} data-source-group aria-labelledby={`${g.id}-title`} className="scroll-mt-28 pt-14">
            <h2 id={`${g.id}-title`} className="font-display text-[length:var(--text-h3)] text-text-light">
              {g.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{g.list.length} sources</p>
            <ul className="mt-5 grid gap-px overflow-hidden rounded-xl border border-border-dark bg-border-dark md:grid-cols-2">
              {g.list.map((s) => (
                <Entry key={s.id} source={s} />
              ))}
            </ul>
          </section>
        ))}

        {other.length ? (
          <section id="other-sources" data-source-group aria-labelledby="other-sources-title" className="scroll-mt-28 pt-14">
            <h2 id="other-sources-title" className="font-display text-[length:var(--text-h3)] text-text-light">
              Background reading
            </h2>
            <p className="mt-1 text-sm text-muted">Extra reading for curious players.</p>
            <ul className="mt-5 grid gap-px overflow-hidden rounded-xl border border-border-dark bg-border-dark md:grid-cols-2">
              {other.map((s) => (
                <Entry key={s.id} source={s} />
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
