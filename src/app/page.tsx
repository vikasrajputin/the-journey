import type { Metadata } from "next";
import { OpeningHero } from "@/components/journey/OpeningHero";
import { ChapterIndex } from "@/components/journey/ChapterIndex";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <OpeningHero />
      <section id="journey-overview" aria-labelledby="overview-title" className="container-wide py-[var(--space-section)]">
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 id="overview-title" className="font-display text-[length:var(--text-h2)]" data-reveal>
            Ten chapters, one continuous story
          </h2>
          <p className="max-w-xl text-muted" data-reveal>
            Read from the beginning, or step into any chapter. Each one sets out what we know, how we know
            it, and where the evidence is still uncertain. Nothing is locked, timed or scored. Go at your
            own pace.
          </p>
        </div>
        <ChapterIndex />
      </section>
    </>
  );
}
