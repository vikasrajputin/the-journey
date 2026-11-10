# Content guide

Everything a player reads in Chapter 1 lives in one file: `src/components/game/levels.ts`. Scene components never contain facts.

## Golden rules

1. **Never invent.** No fact, date or citation goes in without a source in `src/data/sources.ts` that was found on its publisher's site. If you can't find one, leave the claim out.
2. **Say how sure we are.** Use *about*, *roughly* and ranges where the evidence gives them. Say when scientists don't know yet.
3. **Simulations are labelled.** The 3D scenes show ideas; the "Learn more" panel says they are not photos or exact models.
4. **Write for a 9 to 16 year old.** Short sentences, everyday words, explain every hard word the first time.
5. **Game first, reading second.** The main screen shows only the goal, the time and one short fact. Longer text goes in `details`, behind "Learn more".

## A level

| Field | What it is | Limit |
| --- | --- | --- |
| `name`, `when` | Level title and plain-language time | short |
| `goal`, `goalShort` | What to do; the short one shows on phones | `goalShort` ≤ 34 characters |
| `win`, `fact` | Headline and one fact on the "level complete" card | `fact` ≤ 30 words |
| `details` | "Learn more" paragraphs | each ≤ 50 words |
| `sourceIds` | Ids from `src/data/sources.ts` | at least one |
| `quiz` | One question, three answers, the right one and why | |
| `par` | Seconds for the speed star | |
| `color` | The level's bold accent colour | |

The unit test in `tests/unit/levels.test.ts` checks these limits and that every source exists and is used.
