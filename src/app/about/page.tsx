import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = {
  title: "About",
  description: "The editorial approach, authorship and limitations of THE JOURNEY.",
};

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About" title="An exhibition built on evidence">
        <p>
          THE JOURNEY tells the interconnected story of existence, from the early universe to the world you
          live in today. It is meant to be read, explored and questioned.
        </p>
      </PageIntro>
      <section className="container-reading py-16">
        <div className="prose-journey text-text-light/85">
          <h2 className="font-display text-[length:var(--text-h3)] text-text-light">Our approach</h2>
          <ul className="list-disc space-y-3 pl-5">
            <li>Evidence comes before spectacle. Pictures are there to explain, not to stand in for explanation.</li>
            <li>We say what is known, what is estimated, what is debated and what is still unknown.</li>
            <li>Dates are rounded or given as ranges where the evidence calls for it.</li>
            <li>Religious, philosophical and cultural traditions are treated with respect. We keep faith claims separate from claims that can be tested independently.</li>
            <li>Illustrations and reconstructions are always labelled. They are never presented as photographs.</li>
          </ul>
          <h2 className="font-display text-[length:var(--text-h3)] text-text-light pt-6">What this is not</h2>
          <p>
            This is not a game. There are no scores, badges, quizzes or locked chapters. You can read in any
            order, skip anything, and come back whenever you like.
          </p>
        </div>
      </section>
    </>
  );
}
