import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = {
  title: "Sources",
  description: "The references behind THE JOURNEY: research, museum, university and government sources.",
};

export default function SourcesPage() {
  return (
    <PageIntro eyebrow="Sources" title="Where the story comes from">
      <p>
        The references behind the exhibition, grouped by chapter. Claims that are still awaiting
        editorial verification are marked wherever they appear.
      </p>
    </PageIntro>
  );
}
