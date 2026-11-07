import Link from "next/link";
import { chapters } from "@/data/navigation";

/** The ten chapters as an ordered list of large, readable entries. */
export function ChapterIndex({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl border border-border-dark bg-border-dark md:grid-cols-2">
      {chapters.map((c) => (
        <li key={c.id} data-theme={c.theme} className="bg-night">
          <Link
            href={`/journey/${c.slug}`}
            className="group relative flex h-full flex-col gap-3 p-6 transition-colors hover:bg-panel md:p-8"
          >
            <span className="flex items-baseline justify-between gap-4">
              <span className="font-display text-3xl tabular-nums text-chapter">
                {String(c.number).padStart(2, "0")}
              </span>
              <span className="text-right text-xs text-muted">{c.timeLabel}</span>
            </span>
            <Heading className="font-display text-[length:var(--text-h3)] text-text-light group-hover:text-chapter transition-colors">
              {c.title}
            </Heading>
            <span className="text-muted">{c.centralQuestion}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
