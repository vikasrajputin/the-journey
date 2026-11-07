import Link from "next/link";
import { siteConfig } from "@/lib/site";

/**
 * The opening moment. The cosmic backdrop is pure CSS (no media download),
 * drifts very slowly, and stops entirely under reduced motion. Text sits on
 * a darkened scrim so it stays readable over every frame.
 */
export function OpeningHero() {
  return (
    <section
      aria-labelledby="opening-title"
      className="relative isolate flex min-h-[calc(100dvh-var(--header-height))] items-center overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="hero-nebula absolute inset-[-20%]" />
        <div className="starfield hero-stars absolute inset-0 opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-night)_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" />
      </div>

      <div className="container-wide py-14 md:py-24">
        <p className="eyebrow text-accent">An exhibition in ten chapters</p>
        <h1 id="opening-title" className="mt-6 font-display text-[length:var(--text-display)] leading-[0.95] tracking-[0.04em]">
          THE JOURNEY
        </h1>
        <p className="mt-6 max-w-3xl font-display text-xl italic text-text-light/90 sm:text-2xl md:text-3xl">
          {siteConfig.taglineDisplay}
        </p>

        <div className="mt-8 md:mt-10 max-w-xl space-y-1 text-[length:var(--text-lead)] leading-relaxed text-text-light/85">
          <p>Before you, there was a universe.</p>
          <p>Before the universe as we know it, there were questions.</p>
          <p className="pt-3 text-muted">
            Follow the evidence through 13.8 billion years of change, from the early cosmos to the world,
            and the moment, you inhabit now.
          </p>
        </div>

        <div className="mt-10 md:mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/journey/before-everything"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 font-medium text-night transition-colors hover:bg-paper"
          >
            Begin the journey
          </Link>
          <Link
            href="/timeline"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border-dark px-7 text-text-light transition-colors hover:border-accent hover:text-accent"
          >
            Explore the timeline
          </Link>
        </div>

        <a
          href="#journey-overview"
          className="mt-16 inline-flex items-center gap-3 text-sm text-muted hover:text-text-light"
        >
          <span aria-hidden="true" className="hero-cue inline-block h-8 w-px bg-gradient-to-b from-accent to-transparent" />
          Or scroll to see the ten chapters
        </a>
      </div>
    </section>
  );
}
