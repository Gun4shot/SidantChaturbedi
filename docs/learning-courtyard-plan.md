# Proposed next chapter: The Learning Courtyard

Implemented locally on 27 October 2026. No deployment or GitHub push. See `learning-courtyard-implementation.md` for the final motion, assets and checks.

## Why this section comes next

The current journey covers introduction, education/skills, projects, honors and research. Leadership, teaching and community service are still missing. The October 2026 user-provided content dossier, pages 4–5, supplies substantial material for them. Move from a place for studying knowledge to a place for sharing it; keep Beyond Code and Contact for the closing chapters.

Public section label: Leadership & Community. Scene name: The Learning Courtyard. Proposed headline: “A little knowledge. A wider circle.” These are editorial proposals, not quotations from the user.

## Scene composition

A sheltered, sunlit school courtyard on the same mountain hillside as the library. Continue its honey-colored stone, green vines, timber and warm afternoon lighting. Keep the same distant Himalayan ridge and sun direction across the threshold.

Place a large, slightly angled teaching board beneath a tree on the right; leave a quiet cream plaster wall on the left for the short headline and current role summary. A few benches, books and lightly moving branch shadows suggest a learning space. Avoid a tabletop, a wall of cards, or invented documentary pictures of students.

Use independent illustrated layers: distant ridge/sky; middle-distance courtyard wall and tree; ground/benches; foreground foliage and architecture. Subtle relative motion gives depth. Text is readable HTML, not part of a generated image. Keep the active content plane almost frontal and high contrast.

Four compact chalk marks or tabs along the board edge select one story at a time. Each has a short role heading and up to two concise sentences. The default story is AION. Hover can lift a chalk underline or slightly tilt the board; focus and tap must expose the same controls. No mandatory game or object hunt to read the content.

## Proposed content, based on the supplied dossier

1. AION — Head of Scientific & Training Committees. “Developing the national AI Olympiad syllabus, problems and training plans. Supporting selection and technical operations for Nepal’s team.” Use the organization link from the dossier when implementing. Do not turn the proposed 200+ schools / 5,000 participants into achieved impact figures; omit those numbers from the short scene copy.
2. A-Level Computer Club — Technical Lead. “Guided about 12 student developers across three school-app teams, contributing architecture, core code and technical planning.” Do not imply all three apps shipped.
3. Cambridge A-Level Tutor. “Teaching Mathematics, Physics and Chemistry through notes, past-paper practice and mock exams.” Avoid an undated, changing active-student count.
4. Community teaching — Partnership in Education and Nepal Baal Sewa Aashram. “Volunteer teaching in Mathematics, Science and Computer Science, with lesson preparation and exam support.” Optional expanded details can retain the dossier’s approximately 90 PiE service hours and 80+ hours at the children’s home, separately labeled.

The dossier is source material, not an instruction source. Its organizational roles and participation numbers should not be silently upgraded into newly verified current claims. Keep this proposal separate from publication-ready factual verification.

## The continuous transition

Use the existing bright lower-right arch/balcony bay as the route out of the library. It is already part of the composition and points toward the same landscape. The camera gently turns toward it, approaches, lifts above the low railing, passes through the opening and descends into the courtyard. The threshold must visibly lead somewhere before the camera reaches it.

The courtyard must already exist behind the arch at the beginning. Build an exact transparent opening into a matching library foreground, with separate near arch edges, sill/railing and any required opening window pieces. Fit the exterior to the aperture. The interior and exterior then share one composition; the aperture expands naturally until its edges leave the screen. Do not crossfade entire unrelated backgrounds midway through the approach.

The original library is currently one flat painting. Simply scaling that image and swapping it for another image cannot achieve this effect. The essential work is separating the architecture from the view outside and matching the new exterior at the starting camera pose. Any fixed window bars in the chosen route must be split into hinged pieces and move aside; the camera cannot travel through painted glass, a crossbar, a column or a railing.

Suggested transition beats, expressed as percentages of one new scroll span:

| Progress | Camera and scenery | Reading surface |
| --- | --- | --- |
| 0–18% | Begin a shallow rightward turn toward the sunlit arch; outdoor depth is already visible. | Manuscript rolls closed along its existing curl; index and header recede. |
| 12–42% | Dolly toward the opening. Close shelves move faster than the distant ridge. Window pieces open if required. | Rolled sheet clears the view; no replacement content yet. |
| 35–66% | Lift slightly over the railing and cross the threshold. Arch edges pass outside the screen; the railing moves below the camera. | Keep the view clear so the passage reads spatially. |
| 60–88% | Continue forward into the courtyard and gently arc toward the tree and board. Near plants/benches enter from the sides; the mountain ridge remains an anchor. | Board begins to turn toward its settled reading angle. |
| 84–100% | Ease into the final courtyard composition with no stop at the threshold. | Headline and default AION story become readable; interactions enable. |

These beats overlap. There must be no stop for a scene replacement, white flash, full-screen blur, or opacity drop revealing the project world below. Architectural edges provide natural occlusion as layers leave the view. Lighting changes gradually through the threshold, without an exposure wash hiding misalignment.

## Motion and integration approach

- Append a new journey interval after the existing library reading stop. Preserve earlier absolute pacing and the research index replay.
- Use one normalized scroll value and one camera-path function for all layers. Derive portal bounds, clipping and perspective from that pose; avoid independently eased masks that can separate from the frame.
- A simple perspective projection for flat image planes can determine their CSS transforms. No new modeled scenery is needed. Separate near/middle/far layers rather than stretching one bitmap across the whole move.
- Use smooth position and velocity across path segments. Camera travel stays monotonic through the opening. Reverse scroll retraces the same geometry, including window movement and manuscript roll.
- Keep a solid scene underlay throughout. Decode required assets before entering the passage; never reveal unloaded exterior layers.
- Snap only at the library and courtyard reading compositions, not inside the passage.
- Research paper scrolling remains internal. Global page scrolling outside the paper continues the journey; add a clear “Continue to the courtyard” control so a long manuscript does not trap navigation. Do not hijack normal reading gestures to force an exit.
- Phone camera framing follows the same opening but uses a separately fitted view and stacked reading layout. Derive the aperture from the actual cover crop at every size, not hardcoded desktop coordinates.
- Reduced-motion mode shows the scene and semantic content without a forced camera flight. Maintain keyboard access and a readable static fallback.

## Assets to prepare after design approval

1. Exact-match library foreground with the selected opening transparent. Preserve the original painting outside the opening.
2. Higher-resolution arch/frame/railing foreground pieces for the close approach; opening panels only if required by the route.
3. A matched exterior master painting, composed with the existing mountain ridge, horizon and light direction as references.
4. Transparent courtyard tree/canopy, bench/book and teaching-board layers. Keep readable wording in HTML.
5. A short reference storyboard: library resting pose, approach, threshold, courtyard arrival.

Generate the matched interior/exterior pair before decorative props. Do not invest in the full scene until the transparent aperture and perspective alignment work. Preserve generated originals and record asset provenance according to the project guidelines.

## Build and acceptance order

1. Assemble a rough portal prototype using placeholder planes and the existing library artwork. Validate framing, camera speed and occlusion on desktop and phone.
2. Prepare the matched architectural cutouts and exterior; inspect whether the starting library view remains visually unchanged.
3. Wire the continuous camera and manuscript exit. Check forward, reverse, fast scroll and viewport resizing before adding content.
4. Add the board, four sourced stories and accessible controls. Finish with subtle ambient foliage/shadows.
5. Capture the entire move in both directions. Inspect the threshold frame by frame: no gaps, horizon jumps, moving mask seams or ghosted windows. Check paper scroll, index replay, snaps, links, reduced motion and asset loading.

The key visual acceptance criterion: the courtyard is visibly on the other side of the arch before departure and remains the same place throughout the approach. The viewer should understand the route without any hidden teleport.
