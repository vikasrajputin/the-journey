import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { SourceLine } from "@/components/content/SourceCitation";
import { SourceFilter } from "@/components/content/SourceFilter";
import { sources } from "@/data/sources";
import { allChapters } from "@/content/chapters";
import { chapterSourceIds } from "@/lib/chapter-refs";
import type { Source } from "@/lib/content-schema";

export const metadata: Metadata = {
  title: "Sources",
  description: "The references behind THE JOURNEY, grouped by chapter: research, museum, university and government sources, each checked against the claim it supports.",
  alternates: { canonical: "/sources" },
};

const byId = new Map(sources.map((s) => [s.id, s]));
const groups = allChapters.map((c) => ({
  id: `chapter-${c.slug}`,
  title: `Chapter ${c.number}: ${c.title}`,
  href: `/journey/${c.slug}`,
  list: chapterSourceIds(c)
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
          The references behind the exhibition, grouped by chapter. Every source was found on its publisher&rsquo;s own
          site; {checked} of {sources.length} have been re-read against the exact claim they support.
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
            automatically; a person still needs to confirm them. Read more about{" "}
            <Link href="/evidence#reading-evidence" className="link-quiet text-accent">how evidence is labelled</Link>.
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
                  Methods and timeline
                </a>
              </li>
            ) : null}
          </ul>
        </nav>

        {groups.map((g) => (
          <section key={g.id} id={g.id} data-source-group aria-labelledby={`${g.id}-title`} className="scroll-mt-28 pt-14">
            <h2 id={`${g.id}-title`} className="font-display text-[length:var(--text-h3)] text-text-light">
              <Link href={g.href} className="link-quiet">{g.title}</Link>
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
              Methods, timeline and background
            </h2>
            <p className="mt-1 text-sm text-muted">Used on the timeline and the &ldquo;How do we know?&rdquo; page, or as background reading.</p>
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
