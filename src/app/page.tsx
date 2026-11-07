import type { Metadata } from "next";
import Link from "next/link";
import { Experience } from "@/components/experience/Experience";
import { media } from "@/lib/media";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <Experience media={media} />
      <noscript>
        <p className="container-wide py-8 text-muted">
          The immersive journey needs JavaScript for its animation and sound. Every word of the story is in the{" "}
          <Link href="/journey/">ten chapters</Link>, which work without it.
        </p>
      </noscript>
    </>
  );
}
