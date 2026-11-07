import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { SiteSearch } from "@/components/search/SiteSearch";
import { buildSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the chapters, timeline, glossary and evidence guide of THE JOURNEY.",
  alternates: { canonical: "/search" },
};

const records = buildSearchIndex();

export default function SearchPage() {
  return (
    <>
      <PageIntro eyebrow="Search" title="Find anything in the journey" />
      <div className="container-reading pt-12 pb-24">
        <SiteSearch records={records} />
        <div className="search-nojs grid gap-3 text-text-light/85">
          <p>Search needs JavaScript, which seems to be turned off. Everything is still reachable from these pages:</p>
          <ul className="narrative-list">
            <li><Link href="/journey" className="link-quiet text-accent">All ten chapters</Link></li>
            <li><Link href="/timeline" className="link-quiet text-accent">The full timeline, as a text list</Link></li>
            <li><Link href="/glossary" className="link-quiet text-accent">The glossary, A to Z</Link></li>
            <li><Link href="/evidence" className="link-quiet text-accent">How do we know?</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}
