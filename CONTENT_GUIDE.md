# Content guide

All words, dates and citations live in typed TypeScript files under `src/content` and `src/data`. Components never contain content. The build validates everything, so a broken reference is caught before it can ship.

## Golden rules

1. **Never invent.** No fact, date, quote, citation, image or data point goes in without a source that was found on its publisher's site. If you can't find one, leave the claim out or mark it for review.
2. **Say how sure we are.** Use *about*, *roughly*, *at least* and ranges where the evidence gives them. Give debated topics more than one view.
3. **Never present a reconstruction as a photograph.** Every visual is labelled by kind (photograph, illustration, diagram, reconstruction, simulation, data).
4. **Write for a curious 14-year-old and a sceptical scientist at once.** Short sentences, plain words, technical terms linked to the glossary.
5. **No game mechanics.** No points, badges, quizzes or locked chapters.

## Chapters

Each chapter is one file in `src/content/chapters/`, exporting a `Chapter` (see `src/lib/content-schema.ts`):

- **Summary fields** (title, number, theme, time label, central question) come from `src/data/navigation.ts` and are shared with menus.
- **Opening:** `subtitle`, `opening` (one cinematic line), `orientation` (when, where, scale), `intro`.
- **`sections`:** at least three, each with an `id` (used as its anchor), `title`, optional `kicker` and a list of `blocks`.
- **`evidence`:** evidence cards (what, how it helps, how it is studied, limitations, `status`, `sourceIds`). Required for every chapter except the last.
- **`goDeeper`:** optional collapsible deep dives.
- **`transition`:** one sentence leading into the next chapter.

### Blocks

| `type` | Use for |
| --- | --- |
| `lead` | The first, larger paragraph of a section |
| `paragraph` | Body text |
| `pullquote` | One striking line (not a quotation from a person unless it is sourced) |
| `callout` | `tone`: `uncertainty`, `misconception`, `analogy` or `note`, with a `title` |
| `keyFacts` | Two to four `{ value, label, note? }` figures |
| `list` | Short parallel items, `ordered` if sequence matters |
| `exhibit` | Places an exhibit by `exhibitId` |

Any block can carry `sourceIds` (shown as a numbered "Sources" button) and `review` (shown to readers as "Awaiting editorial review" until removed).

### Inline markup

- `[[term-id]]` links a glossary term and opens its definition in place. `[[term-id|other words]]` shows different words.
- `*text*` is italic, for species names and titles.

## Exhibits

Defined in `src/content/exhibits/index.ts`. Every exhibit needs a `title`, `kind`, `caption`, `sourceIds` and a `textAlternative` of at least 80 characters that carries the full content of the visual. Write the text first; a visual in `src/components/exhibits/visuals/` is then drawn from it and registered in `ExhibitVisual.tsx`. A visual must never show a fact that its text alternative doesn't contain. Unregistered exhibits show their text alternative, which is a complete exhibit in itself.

## Glossary, timeline and methods

- **Glossary** (`src/content/glossary/index.ts`): `id`, `term`, one- or two-sentence `definition`, optional `sourceIds`.
- **Timeline** (`src/data/timeline.ts`): `yearsAgo` counts back from 2000 CE (use `yearToYearsAgo(year)` for calendar years, which handles the missing year zero). Add a `range` when the evidence gives one, a human `dateLabel`, the `chapterId`, an evidence `status` and `sourceIds`.
- **Methods** (`src/content/methods/index.ts`): the "How do we know?" page.
- **Geological periods** (`src/data/geologic-periods.ts`): boundaries from the ICS chart. If the chart changes, update this file, the exhibit text, chapter text and timeline together. The unit tests check that they agree.

## Evidence status labels

`well-established`, `strong-evidence`, `active-research`, `debated`, `hypothesis`, `unknown`. Their reader-facing meanings are in `evidenceStatusInfo` (`src/components/exhibits/EvidenceCard.tsx`) and on `/evidence#reading-evidence`.

## Before you commit

```bash
npm run check
npm run build
```

The build fails on unknown source, glossary or exhibit ids, duplicate ids, non-HTTPS sources, chapters with fewer than three sections, missing evidence or exhibits, short text alternatives, and placeholder text such as "lorem ipsum", "TODO" or "TBD".
