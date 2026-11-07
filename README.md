# THE JOURNEY

**The story of everything, and then there was you.** An immersive educational website and digital museum that tells 13.8 billion years of cosmic, geological, evolutionary and human history in ten chapters, built on cited evidence and ending with the visitor.

No accounts, no trackers, no database, no game mechanics. Every chapter is readable without JavaScript.

## Running it

Requires Node.js 20 or later.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static production build
npm start            # serve the build
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the public origin before deploying. It is the only setting.

## Checks

```bash
npm run check        # lint + typecheck + unit tests (Vitest)
npm run build && npm run test:e2e   # browser tests (Playwright, desktop and mobile, with axe)
```

`npm run build` also validates all content (`assertContentValid()`): unknown sources, glossary terms or exhibits, missing text alternatives and placeholder text fail the build.

## What is where

| Path | Purpose |
| --- | --- |
| `src/content/chapters/` | The ten chapters as typed data: sections, blocks, evidence, "go deeper" |
| `src/content/exhibits/` | Exhibit definitions with full text alternatives |
| `src/content/glossary/`, `src/content/methods/` | Glossary terms and the "How do we know?" methods |
| `src/data/sources.ts` | Source registry: every citation, with what it supports and whether it was checked |
| `src/data/timeline.ts`, `src/data/geologic-periods.ts` | Timeline events and period boundaries |
| `src/components/exhibits/visuals/` | SVG and HTML visuals (maps, charts, diagrams), drawn from each exhibit's text |
| `src/components/timeline/` | The interactive timeline |
| `src/lib/` | Content schema, validation, inline markup, timeline scale, search |
| `tests/unit`, `tests/e2e` | Vitest and Playwright suites |

Content is separate from presentation: editors change files in `src/content` and `src/data`, never components. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

## Pages

`/` opening · `/journey` and `/journey/[chapter]` the ten chapters · `/timeline` interactive timeline with text list · `/evidence` how we know · `/sources` source directory · `/glossary` · `/search` · `/about`

## Stack

Next.js 15 (App Router, fully static), React 19, TypeScript, Tailwind CSS 4, next/font. Maps are rendered at build time from Natural Earth outlines (`world-atlas`, `d3-geo`); there are no map tiles or other runtime requests to third parties.

## Further reading

- [CONTENT_GUIDE.md](CONTENT_GUIDE.md): writing and editing content
- [SOURCES.md](SOURCES.md): sourcing policy, verification status and open editorial items
- [ACCESSIBILITY.md](ACCESSIBILITY.md): accessibility approach, testing and known limitations

## The immersive journey (home page)

The home page is a full-screen, scroll-driven experience: ten scenes, one per chapter, under `src/components/experience/`.

- **Scenes** (`scenes/*.tsx`) draw on canvas and react to scroll, taps, drags and holds. Each scene is a tall section with a sticky stage, so the page scrolls normally and is never hijacked.
- **Words** live in `scene-data.ts`: short on-screen captions (no spoken narration). Every claim comes from the chapter text, which carries the sources.
- **Sound** (`sound-engine.ts`) is synthesised live with the Web Audio API: there are no audio files. The dinosaur call is a labelled reconstruction. Sound starts only after the visitor taps "Enter with sound".
- **Photos and films** (`src/lib/media.ts`) are real files on Wikimedia Commons (NASA, ESA, NOAA and others), loaded straight from Wikimedia, with credits in each scene and at the end. If a file can't load, the scene's own artwork shows instead.
- Motion respects `prefers-reduced-motion` and the site's "Reduce motion" toggle. Without JavaScript the home page shows the scene titles and first captions, and links to the chapters.
- **Proof**: every caption carries `sources` (ids in `src/data/sources.ts`) and a `see` label saying whether the visitor is looking at a real photo, film, fossil or data, or at a simulation. The label shows on screen, and "See the proof" opens each scene's claims with their references. A unit test fails if any caption has no registered source.
