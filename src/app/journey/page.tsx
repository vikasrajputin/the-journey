import type { Metadata } from "next";
import { SplitWords } from "@/components/motion/SplitWords";
import { ChapterShowcase } from "@/components/journey/ChapterShowcase";

export const metadata: Metadata = {
  title: "The journey",
  description: "All ten chapters of THE JOURNEY, from the early universe to you.",
  alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
  return (
    <>
      <header className="show-head container-wide">
        <p className="eyebrow text-accent">The journey</p>
        <div className="show-head-row">
          <h1 id="page-title" className="show-h1">
            <SplitWords text="Pick a chapter" className="split-load" />
          </h1>
          <p className="show-side">
            10 chapters. 13.8 billion years. Start at the very beginning, or jump straight to the part you love.
          </p>
        </div>
      </header>
      <section aria-label="Chapters" className="container-wide pb-24">
        <ChapterShowcase />
      </section>
    </>
  );
}
