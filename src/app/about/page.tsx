import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = {
  title: "About",
  description: "The editorial approach, authorship and limitations of THE JOURNEY.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About" title="An exhibition built on evidence">
        <p>
          THE JOURNEY tells the interconnected story of existence, from the early universe to the world you
          live in today. It is meant to be played, explored and questioned.
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
          <h2 className="font-display text-[length:var(--text-h3)] text-text-light pt-6">Why a game?</h2>
          <p>
            THE JOURNEY is now a game. In Chapter 1 you travel back 13.8 billion years and play through the
            history of the universe, one level at a time: the Big Bang, the first atoms, the first light, the
            first stars and the first galaxies. Each level ends with a quick quiz and up to three stars.
          </p>
          <p>
            The longer explanations are tucked into a &ldquo;Learn more&rdquo; panel in every level, with links
            to the science behind them. Any level can be skipped. The 3D scenes are simulations made for the
            game, not photographs. More chapters are coming.
          </p>
        </div>
      </section>
    </>
  );
}
