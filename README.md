# THE JOURNEY

**The story of everything, and then there was you.** An educational game for school students (about ages 9 to 16) that teaches the history of the universe and of humankind, one level at a time.

Right now the site is **Chapter 1: Before Everything**, a 3D game in seven levels. More chapters will be added the same way.

## Running it

Requires Node.js 20 or later.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static production build
npm start            # serve the build
npm run build:pages  # static export for GitHub Pages (out/)
```

## Checks

```bash
npm run check                       # lint + typecheck + unit tests (Vitest)
npm run build && npm run test:e2e   # browser tests (Playwright, desktop and mobile, with axe)
```

## Chapter 1, the game

| Level | What happens | What you do |
| --- | --- | --- |
| 1. The Big Bang | A tiny hot speck bursts and space starts to stretch | Press and hold |
| 2. Space Stretches | Galaxies drift apart and their light turns red (redshift) | Drag to stretch space |
| 3. The First Building Blocks | Protons and neutrons fuse into helium in the first minutes | Tap the glowing groups |
| 4. The Fog Clears | At 380,000 years atoms form and light breaks free (the CMB) | Swipe away the fog |
| 5. The First Stars | Gravity squeezes gas clouds until they light up | Hold a cloud |
| 6. Star Factory | Stars cook hydrogen up to iron, then explode as a supernova | Tap to squeeze the star |
| 7. Galaxy Builder | Small galaxies merge into a big spiral | Drag (or tap) star groups to the middle |

Each level ends with a "level complete" card: up to three stars (finish, speed, quiz), one short fact and a one-question quiz. Longer explanations and the sources sit in a **Learn more** panel, so the main screen has no paragraphs. Levels unlock in order and any level can be skipped. Progress is saved in the browser only.

### Where things are

| Path | Purpose |
| --- | --- |
| `src/components/game/levels.ts` | Every word the player reads: goals, facts, quiz, "Learn more" text, sources |
| `src/components/game/levels/*.tsx` | One React Three Fiber scene per level |
| `src/components/game/Game.tsx` | Screens (title, level map, warp, play, level complete, chapter complete) and HUD |
| `src/components/game/Stage.tsx` | The single WebGL canvas, title and warp scenes, bloom |
| `src/components/game/DetailsPanel.tsx` | The "Learn more" panel |
| `src/components/game/FlatScene.tsx` | Simple 2D mode for devices without WebGL |
| `src/components/game/sound-engine.ts` | Sound effects and space ambience, synthesised live with Web Audio (no audio files) |
| `src/data/sources.ts` | Source registry; a unit test checks every level's sources exist |
| `src/styles/game.css` | Game UI styles |

### Stack

Next.js 15 (static), React 19, TypeScript, Tailwind 4, **React Three Fiber + drei** for 3D, **@react-three/postprocessing** for bloom, **GSAP** for screen and card animation, Lenis for smooth scrolling on the text pages.

### Phones and slow devices

- Phones, tablets and weaker machines start in **Lite** graphics: canvas DPR at most 1.25, no post-processing, about 40% of the particles. Desktops get **Full**. Players can switch on the title screen, and the game drops to Lite by itself if the frame rate falls (drei `PerformanceMonitor`).
- Without WebGL the game runs in a simple 2D mode with the same goals, quiz, stars and "Learn more".
- Without JavaScript the page shows a plain list of the seven levels and their facts.
- Every level can be played with the keyboard (press or hold Space) and skipped. Reduced-motion turns off flashes and screen shake.

## Rules for content

Science only. Every fact must come from a source in `src/data/sources.ts` (NASA, ESA, museums, universities, peer-reviewed papers). The 3D scenes are simulations made for the game and the "Learn more" panel says so. Use very simple words: short sentences, explain hard words. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) and [SOURCES.md](SOURCES.md).
