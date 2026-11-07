import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = {
  title: "Timeline",
  description: "The full chronology of THE JOURNEY, from about 13.8 billion years ago to the present.",
};

export default function TimelinePage() {
  return (
    <PageIntro eyebrow="The complete journey" title="13.8 billion years, on one scale">
      <p>
        On a straight-line scale, all of recorded human history would be thinner than a hair. This
        timeline uses a compressed scale so every era stays visible, and it tells you exactly how much
        each stretch has been compressed.
      </p>
    </PageIntro>
  );
}
