# Accessibility

Target: **WCAG 2.2 level AA**. The exhibition is for everyone, including people who use a keyboard, a screen reader, magnification or reduced motion, or who have JavaScript turned off.

## What the site does

**Structure and navigation**
- One `h1` per page with a logical heading order, landmark regions, and a "Skip to content" link.
- `lang="en-GB"` is set on every page.
- Chapters have a sticky progress bar that is 40px tall, so it never covers more than a line, and a journey map with a 24px target for each step.
- On wide screens, an "In this chapter" rail marks the section being read with `aria-current`.
- The mobile menu is a native `<dialog>`: focus stays inside while it is open, and Escape closes it.

**Works without JavaScript**
- All chapter text, evidence, sources and exhibit text alternatives are in the server-rendered HTML.
- Reveal animations hide nothing unless JavaScript has loaded.
- The interactive timeline is replaced by a full text list of every event with its sources.
- Search points to the browsable lists instead.

**Motion**
- The site follows `prefers-reduced-motion`. There is also a "Reduce motion" switch in the header, and the setting is remembered on the device.
- There is no scroll hijacking, parallax-driven layout or autoplaying media.
- The reading progress bar uses a transform, so it causes no layout shift.

**Pop-ups and controls**
- Glossary definitions and source lists use the native Popover API. They open in place without moving the page, Escape closes them, and they work without JavaScript.
- Every control is a real `<button>` or `<a>`. Toggle buttons expose `aria-pressed`, and links that open new tabs say so.

**Interactive timeline**
- Arrow keys move between events, and Home and End jump to the ends. Only the selected event is in the tab order (roving tabindex).
- Changes are announced in a polite live region.
- "Earlier event" and "Later event" buttons cover touch and switch users.
- Event markers are 24px targets.
- The compressed scale is explained in words and in a table, not only drawn.

**Exhibits and images**
- Every exhibit has a full text alternative ("Read this exhibit as text"), and the visual is drawn from it.
- Maps and charts carry a short `aria-label` and a list or table with the same information.
- Each visual is labelled by kind, so a diagram or reconstruction is never mistaken for a photograph.
- Decorative backgrounds are `aria-hidden`.

**Colour and text**
- The dark palette meets AA contrast, which axe checks on every page.
- Evidence status is shown as words plus a symbol, never by colour alone. Timeline categories are named in a legend and in each event's label.
- Text uses relative units. Layouts were checked from 360px to 1920px with no sideways page scrolling, which covers 200% browser zoom on common desktop widths.

## How it is tested

- **Automated:** `npm run test:e2e` runs Playwright on desktop Chrome and an emulated Pixel 7. axe-core checks WCAG 2.0, 2.1 and 2.2 A and AA rules on every route, including all ten chapters.
- **Behaviour tests** cover:
  - the skip link and the mobile menu (including Escape)
  - glossary and source pop-ups (they open without moving the page and close with Escape)
  - timeline keyboard navigation and announcements
  - the motion preference
  - every page with JavaScript disabled
  - no horizontal scrolling at 360, 768, 1024 and 1920px

## Known limitations

- **No screen-reader testing yet.** Testing so far is automated plus scripted keyboard checks. A pass with NVDA, JAWS, VoiceOver (macOS and iOS) and TalkBack is still needed before launch.
- **Timeline scrolls sideways on small screens.** It scrolls inside its own region, and the text list below holds the same content.
- **Glossary terms inside dense paragraphs** are inline buttons, so their target size depends on the text size. The WCAG 2.2 inline exception applies.
- **Manual contrast checks** are still needed for the category colours on the maps, which axe does not inspect inside SVG.

Report accessibility problems through the repository's issue tracker.
