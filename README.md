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
