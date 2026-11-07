import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ChapterIndex } from "@/components/journey/ChapterIndex";

export const metadata: Metadata = {
  title: "The journey",
  description: "All ten chapters of THE JOURNEY, from the early universe to you.",
};

export default function JourneyPage() {
  return (
    <>
      <PageIntro eyebrow="The journey" title="From the first light to this moment">
        <p>
          Ten chapters trace about 13.8 billion years of change. They are written to be read in order, but
          every chapter stands on its own.
        </p>
      </PageIntro>
      <section aria-label="Chapters" className="container-wide py-16">
        <ChapterIndex />
      </section>
    </>
  );
}
