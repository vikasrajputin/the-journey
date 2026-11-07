import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata: Metadata = {
  title: "How do we know?",
  description: "The methods behind the story: dating techniques, fossils, ice cores, ancient DNA, cosmic light and historical sources.",
};

export default function EvidencePage() {
  return (
    <PageIntro eyebrow="Evidence and methods" title="How do we know?">
      <p>
        Every date and claim in this exhibition rests on evidence that someone gathered, tested and argued
        about. This guide explains the main methods, what each one can tell us, and where each one stops.
      </p>
    </PageIntro>
  );
}
