# From the laurel grove to the reading room

Status: storyboard and three native-resolution assets prepared. The new transition and publication UI are not implemented in this pass. Existing honors and earlier choreography remain intact.

## The shot

The IOAI keepsake loosens from its ribbon. The camera pans toward it as it drops, then tracks alongside its tumbling face. It occupies roughly one-third of the viewport, leaving the surroundings visible. Leaves and shafts of sunlight stretch upward as the camera accelerates downward: the waterfall effect comes from the environment, not an oversized medal covering the lens. The gold and green streaks gradually resolve into warm vertical bookcases. The camera brakes near the wooden floor. The medal lands on its rim, makes one small bounce, and settles. We pull back and tilt upward to reveal the reading desk and research collection.

Use the fixed IOAI medal as the transition anchor regardless of the selected honors card, so the geometry and narrative remain predictable. Award selection remains interactive until departure begins. Keep a short resting scroll span to read the honors before the release; the fall itself has no artificial pause.

## Proposed scroll beats

Preserve all existing distances through p=2.14. Add approximately 450vh, then tune in-browser rather than stretching prior scenes.

| Local transition progress | Camera and object | Environment |
| --- | --- | --- |
| 0–0.16 | Pan to IOAI; ribbon flexes; medal slips from the loop. | Grove stays recognizable. |
| 0.16–0.42 | Medal accelerates downward; camera catches it on a curved path. Turn the flat painted sprite with perspective, rotation and modest foreshortening. | Foreground branches pass faster than distant hills. |
| 0.42–0.64 | Track the medal at 28–38% viewport width. Continuous downward movement. | Vertical directional blur rises, grove streaks become library-column streaks at maximum blur. No white flash or full-screen medal zoom. |
| 0.64–0.80 | Camera decelerates; floor enters from below; medal rotates toward its rim. | Library becomes sharp; the floor contact point stays fixed in world space. |
| 0.80–0.90 | One small rim bounce and damped settle, shadow tightening at contact. | A few painted-color dust motes respond; no large particle explosion. |
| 0.90–1 | Camera pulls back and tilts toward the desk; medal remains visible near a desk leg. | Desk foreground separates from shelves through parallax; publication text becomes readable. |

## Implementation order

1. Add a pure `publication-motion.ts` function with a normalized local scroll clock. Derive all position, rotation, camera, blur and reveal values from that clock so reverse scrolling retraces exactly.
2. Measure the IOAI medallion face in the current responsive layout. Align the new transparent medal to that rectangle and crossfade only during the first small tilt. Mask the old face while preserving the ribbon; do not leave a duplicate hanging medal behind. Preserve its III symbol on the flight sprite until it settles.
3. Add a fixed DOM collage scene with library background, separate desk, medal, contact shadow and dust layers. Use CSS perspective and transforms; no new Three.js models. Preload these assets near the honors arrival, not at initial page load.
4. Implement the fall and matching floor landing before adding distortion. The medal must visibly meet the ground rather than float over it.
5. Add a short, scroll-driven directional blur using an SVG filter with vertical standard deviation and restrained displacement. Apply to scenery only. Exchange backgrounds inside the maximum-blur window. Provide a simple blurred crossfade fallback if filters perform poorly on mobile.
6. Add reading controls after the shot lands. Restrained pointer parallax moves the desk and shelves at different rates. The text remains a sharp HTML layer on a mostly opaque ivory reading sheet; do not bake titles into image assets.
7. Verify exact handoff, no duplicates, floor alignment, reverse-scroll continuity and reduced-motion mode. Test desktop and portrait framing, keyboard access and low-power rendering before extending JOURNEY_END.

## Publication presentation

Heading: “Research & publications.” A small shelf-like selector presents three research records. The active record opens above the desk with exact title, one-sentence summary, venue/status, and available DOI/code links. Keep full abstract behind a deliberate expand control. Labels distinguish Published, Submitted, and Ongoing; never present all three as published papers.

- Sentinel-1 work: verify the journal version and exact title/author details before rendering a Published badge. The dossier DOI was previously blocked during verification; preserve that uncertainty in internal notes.
- Road graph study: submitted manuscript, not an accepted publication.
- Himalayan waters work: ongoing research, not a publication claim.

Use the dossier's exact verified paper titles when implementing, rather than treating the current short project names as publication titles. These three records are removed from the project journal but retained in source material.

## Asset layers

- `public/art/publications-library-v1.png`: painted opaque background, low camera and open floor for the landing.
- `public/art/publications-desk-v1.png`: separate transparent desk, blank folio, book stack and lamp. Its top is decorative; actual copy needs a legible HTML reading sheet above it.
- `public/art/publications-medal-v1.png`: independent transparent laurel medal, matched to the existing keepsake.
- Existing `honor-ribbon-v2.png` supplies the hanging ribbon before release. Streaks and shadows are procedural, not static generated overlays.

Exact prompts and provenance: publications-assets.md. Do not load unused preparation assets into the current live journey.

## Implemented library — October 24
The reading room is now part of the live route, p=2.14–2.64 with reading space through 2.78. A transparent medal separates from the IOAI ribbon, is tracked through vertically streaked scenery, lands with one bounce, and settles beside the desk. The backdrop and desk pull back independently. The original bird transition is unchanged. The old medal face is masked during the handoff, and the landing shadow follows the same floor coordinate as the sprite.

The room contains three accessible research selectors, concise summaries, expandable notes, the published paper DOI and public code/figure links, ML notebooks, and research contact. Phone and reduced-motion layouts retain the same content. No new Three.js models were added.

Publication verification succeeded through the publisher's indexed full article on October 24: https://www.tandfonline.com/doi/full/10.1080/19475705.2026.2719295 confirms the title, authors Sidant Chaturbedi / Basu Dev Ghimire / Sandesh Singh, volume 17 issue 1, and online publication on 17 August 2026. This supersedes the earlier DOI-access uncertainty. Road classification remains submitted; Himalayan research remains ongoing. Their headings are descriptive topics, not invented formal paper titles.

Files: src/publication-motion.ts, src/publications.ts, src/LibraryJourney.tsx, src/library-journey.css. Automated checks cover handoff coordinates, continuity at every phase, reverse traversal, floor contact, and publication status/link distinctions.
