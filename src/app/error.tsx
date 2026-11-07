"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-reading flex min-h-[60vh] flex-col justify-center py-24" role="alert">
      <p className="eyebrow text-accent">Something went wrong</p>
      <h1 className="mt-4 font-display text-[length:var(--text-h2)]">This page didn&rsquo;t load properly</h1>
      <p className="mt-6 text-muted">Please try again. If the problem continues, the chapter list still works.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-medium text-night">
          Try again
        </button>
        <Link href="/journey" className="inline-flex min-h-12 items-center rounded-full border border-border-dark px-6">
          See all chapters
        </Link>
      </div>
    </section>
  );
}
