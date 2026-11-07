import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { glossary } from "@/content/glossary";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Plain-language definitions of the scientific and historical terms used in THE JOURNEY.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  const entries = [...glossary].sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
  const letters = Array.from(new Set(entries.map((e) => e.term[0].toUpperCase())));
  return (
    <>
      <PageIntro eyebrow="Glossary" title="Words worth knowing">
        <p>Plain-language definitions of the terms used across the exhibition. In the chapters, underlined terms open these definitions in place.</p>
      </PageIntro>
      <div className="container-reading py-16">
        <nav aria-label="Glossary letters" className="mb-10 flex flex-wrap gap-2">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border-dark text-sm hover:border-accent hover:text-accent">
              {l}
            </a>
          ))}
        </nav>
        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} aria-labelledby={`letter-${l}-title`} className="mb-12 scroll-mt-24">
            <h2 id={`letter-${l}-title`} className="font-display text-3xl text-accent">{l}</h2>
            <dl className="mt-4 divide-y divide-border-dark border-t border-border-dark">
              {entries
                .filter((e) => e.term[0].toUpperCase() === l)
                .map((e) => (
                  <div key={e.id} id={e.id} className="scroll-mt-24 py-5 target:bg-panel/60">
                    <dt className="font-display text-xl text-text-light">{e.term}</dt>
                    <dd className="mt-2 text-text-light/85">{e.definition}</dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
