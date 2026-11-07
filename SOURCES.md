# Sources

THE JOURNEY makes claims about 13.8 billion years of history. Every claim has to be traceable to evidence a reader can check.

## Policy

- **Preferred sources:** peer-reviewed research, museums, universities, public scientific agencies, UNESCO, and established reference works. Popular articles are used only as plain-language companions to primary work.
- **Found, not remembered.** Every entry in `src/data/sources.ts` was found on its publisher's own site, and its title and URL are recorded as published. Nothing is added from memory.
- **Each entry says what it supports** (`supports`) and any caveats (`note`), for example "press release" or "single study".
- **Two verification states:**
  - `located`: found on the publisher's site.
  - `checked`: the page was re-read against the exact claim it supports. Readers see the date it was checked.
- **When a source doesn't support a claim, the claim changes.** The source is never stretched to fit.

## Verification status (7 November 2026)

**103 sources: 81 checked, 22 located.**

The 22 located sources are on sites that refuse automated reading (nature.com, science.org, pnas.org, nobelprize.org, the British Library's IDP, acs.org, evolution.berkeley.edu for one page) or show only an abstract. Each needs a person to open it and confirm the claim, then set `verification: "checked"`:

- `planck-2018-params`: Planck 2018 results. VI. Cosmological parameters (Planck Collaboration, Astronomy & Astrophysics) <https://www.aanda.org/articles/aa/abs/2020/09/aa33910-18/aa33910-18.html>
- `djokic-2017-hot-springs`: Earliest signs of life on land preserved in ca. 3.5 Ga hot spring deposits (Nature Communications) <https://www.nature.com/articles/ncomms15263>
- `nutman-2016-isua`: Rapid emergence of life shown by discovery of 3,700-million-year-old microbial structures (Nature) <https://www.nature.com/articles/nature19355>
- `nature-2024-oxygenation`: Onset of coupled atmosphere–ocean oxygenation 2.3 billion years ago (Nature) <https://www.nature.com/articles/s41586-024-07551-5>
- `ue-trees-not-ladders`: Trees, not ladders (Understanding Evolution, University of California Museum of Paleontology) <https://evolution.berkeley.edu/evolution-101/the-history-of-life-looking-at-the-patterns/trees-not-ladders/>
- `schulte-2010-chicxulub`: The Chicxulub Asteroid Impact and Mass Extinction at the Cretaceous-Paleogene Boundary (Science) <https://www.science.org/doi/10.1126/science.1177265>
- `alvarez-1980`: Extraterrestrial Cause for the Cretaceous-Tertiary Extinction (Science) <https://www.science.org/doi/10.1126/science.208.4448.1095>
- `renne-2013`: Time Scales of Critical Events Around the Cretaceous-Paleogene Boundary (Science) <https://www.science.org/doi/10.1126/science.1230492>
- `deccan-2019`: The eruptive tempo of Deccan volcanism in relation to the Cretaceous-Paleogene boundary (Science) <https://www.science.org/doi/full/10.1126/science.aav1446>
- `harmand-2015-lomekwi`: 3.3-million-year-old stone tools from Lomekwi 3, West Turkana, Kenya (Nature) <https://www.nature.com/articles/nature14464>
- `hublin-2017-irhoud`: New fossils from Jebel Irhoud, Morocco and the pan-African origin of Homo sapiens (Nature) <https://www.nature.com/articles/nature22336>
- `green-2010-neandertal`: A Draft Sequence of the Neandertal Genome (Science) <https://www.science.org/doi/10.1126/science.1188021>
- `nobel-2022`: Press release: The Nobel Prize in Physiology or Medicine 2022 (The Nobel Assembly at Karolinska Institutet) <https://www.nobelprize.org/prizes/medicine/2022/press-release/>
- `denisovan-review-2023`: More than a decade of genetic research on the Denisovans (Nature Reviews Genetics) <https://www.nature.com/articles/s41576-023-00643-4>
- `pnas-fire-europe`: On the earliest evidence for habitual use of fire in Europe (Proceedings of the National Academy of Sciences) <https://www.pnas.org/doi/10.1073/pnas.1018116108>
- `pnas-wonderwerk`: Microstratigraphic evidence of in situ fire in the Acheulean strata of Wonderwerk Cave, Northern Cape province, South Africa (Proceedings of the National Academy of Sciences) <https://www.pnas.org/doi/10.1073/pnas.1117620109>
- `fuller-2014-convergent`: Convergent evolution and parallelism in plant domestication revealed by an expanding archaeological record (Proceedings of the National Academy of Sciences) <https://www.pnas.org/doi/10.1073/pnas.1308937110>
- `maize-2016`: The earliest maize from San Marcos Tehuacán is a partial domesticate with genomic evidence of inbreeding (Proceedings of the National Academy of Sciences) <https://www.pnas.org/doi/10.1073/pnas.1609701113>
- `pearl-millet-2018`: A western Sahara centre of domestication inferred from pearl millet genomes (Nature Ecology & Evolution) <https://www.nature.com/articles/s41559-018-0643-y>
- `bl-diamond-sutra`: Buddhist texts: The Diamond Sutra (International Dunhuang Programme, British Library) <https://idp.bl.uk/discover/learning/buddhism-on-the-silk-roads/articles/buddhism-on-the-ground/buddhist-texts-the-diamond-sutra/>
- `acs-libby`: Willard Libby and Radiocarbon Dating (American Chemical Society) <https://www.acs.org/education/whatischemistry/landmarks/radiocarbon-dating.html>
- `scitable-molecular-clock`: The Molecular Clock and Estimating Species Divergence (Nature Education, Scitable) <https://www.nature.com/scitable/topicpage/the-molecular-clock-and-estimating-species-divergence-41971/>

### Corrections made during the check

- **Geological period boundaries** were updated to the ICS chart v2024/12 (for example Cretaceous base 143.1 Ma, Ordovician 486.85 Ma).
- **Earliest writing** is dated around 3100 BCE (Met, British Museum). **Indus cities** date from about 2500 BCE (UNESCO).
- **Dispersal from Africa** is now within roughly the last 60,000 years. **Australia** is by around 42,000 years ago, possibly 65,000. **Americas** is by about 15,000 years ago, possibly 23,000. All of these follow the Natural History Museum.
- **First dinosaurs:** about 230 Ma (Herrerasaurus), with the possibility of an earlier origin noted.
- **Galileo:** a claim about mountains on the Moon was removed because the cited source does not state it.
- **Dead links:** dead WMAP pages were replaced with the current NASA mission page.

## Open editorial items

These passages are complete and cited, and readers see them marked "Awaiting editorial review". Each needs a specialist check or a more specific source:

- **A Planet Is Born**, Oceans and air: Composition of the early atmosphere: confirm wording against a dedicated research review.
- **A Planet Is Born**, A restless surface: Add a source on carbon cycling and the onset of plate tectonics.
- **The First Breath of Life**, The origin: an open question: Add a peer-reviewed review article on origin-of-life hypotheses.
- **The First Breath of Life**, The origin: an open question: Add a source for the last universal common ancestor (LUCA).
- **The First Breath of Life**, The earliest evidence: Add a source for living stromatolites at Shark Bay.
- **The First Breath of Life**, The air changes: Add a source on the timing of ozone-layer formation.
- **The First Breath of Life**, A partnership inside a cell: The timing of the first eukaryotes is uncertain; confirm the 'around two billion years' wording against a dated source.
- **The First Breath of Life**, Why did complex life take so long?: Needs a review-article source before launch.
- **When Life Diversified**, Many cells working together: Add a source for multiple independent origins of multicellularity.
- **The Age of Giants**, Not just dinosaurs: Add a dedicated source on Mesozoic mammal diversity.
- **The Human Story Begins**, Stone tools: Add a source for the timing of Acheulean hand axes and later stone-tool traditions.
- **The Human Story Begins**, Fire, food and each other: Add specific archaeological sources for food sharing and care for the injured.
- **The Human Story Begins**, Symbols, art and language: Add sources for specific early symbolic artefacts (e.g. Blombos Cave) and Neanderthal art.
- **The Birth of Civilisation**, Settling down: Add bioarchaeological sources on health changes with early farming.
- **The Birth of Civilisation**, The first cities: Add a source for Jenne-jeno and African urbanism.
- **The Birth of Civilisation**, Writing things down: Add sources for khipu and the Maya script.
- **The Birth of Civilisation**, Trade, law and states: Add an archaeological source for Indus–Mesopotamia trade.
- **The Age of Ideas**, Knowledge travels: Add a source for the westward spread of paper-making.
- **The Age of Ideas**, Watching, measuring, recording: Add sources for Chinese and Islamic astronomical records.
- **The Age of Ideas**, The story of zero: Add a source on Brahmagupta and the Babylonian and Maya placeholders.
- **The World We Built**, Energy and industry: Replace this paragraph with an accessible chart of the Our World in Data series once the data is imported and checked.
- **The World We Built**, Uneven progress, real costs: Add sources from history institutions on colonialism, slavery and industrialisation.
- **The World We Built**, Why it isn't about bigger brains: Add an anthropology source for this framing.

## Map and data credits

- Map outlines: [Natural Earth](https://www.naturalearthdata.com/), public domain, via the `world-atlas` package.
- Geological periods: [International Chronostratigraphic Chart v2024/12](https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf), International Commission on Stratigraphy.

## Adding a source

1. Find the page on the publisher's own site and open it.
2. Add an entry to `src/data/sources.ts` with `id`, `title` (as published), `organisation`, `url`, `sourceType`, `supports` and, where useful, `publicationDate` and `note`.
3. Set `verification: "checked"` only after re-reading the page against the exact claim.
4. Reference it by id in `sourceIds`. The build fails on unknown ids.
