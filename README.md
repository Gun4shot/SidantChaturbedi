# Siddhant — A Painted Journey

A scroll-driven portfolio: sky, meadow, apple tree, education, Newton, and a sunlit clearing with an interactive physical project journal.

## Run

Node.js 22.6+ is required; Node 24 is recommended.

```sh
npm install
npm run dev
npm test
npm run build
```

Open http://127.0.0.1:5173/. Scroll through the story and the book automatically lifts and opens. Use the page buttons, left/right arrow keys, or a horizontal swipe to turn pages. One additional arrow press during a turn is queued; held keys do not race through the book. **All projects** opens a searchable illustrated index; Escape closes that index. Scrolling beyond the book follows a paper crane into the interactive laurel grove. `/?view=still` provides an ordinary-scrolling, reduced-motion version.

## Current motion

The original opening, tree approach, education fall, stem release, and Newton contact are preserved. The tree pan remains shortened without shortening the education fall.

After the impact, the apple rebounds. During its descending arc the camera approaches it, slowing the bounce before ground contact. The upper 80% of its square cutout remains visible, with the bottom 20% cropped. Its physical size stays constant. The two environments exchange their backgrounds only while defocused at 90px; their apple projections match exactly. The text “Let’s look at my projects” introduces the new clearing. Further scrolling pulls back to reveal the meadow and journal. There is no red screen, cave, or edge-on book substitution.

Flowers and butterflies are transparent generated artwork in a separate render pass with a fixed camera. They do not change size during the apple pullback or book approach. Flowers sway from their base; butterfly wings flap while their flight paths stay at the outer edges, behind the journal. The meadow backdrop is fixed as well.

The Three.js book has beveled cloth covers, inset lining, a spine, paper blocks, fine page edges, and gently curved resting pages. It follows a reversible cubic lift, banks gently, opens its cover after the initial rise, and settles into an equal-sized spread. The camera gives the turning cover extra clearance. Golden particles accompany the opening. Turning paper uses an 80×28 deformable mesh with a diagonal corner lead, pinned spine, front/back artwork, and a traveling shadow. The moving sheet stays above the support surface throughout the curl, so upcoming artwork is revealed by the fold instead of leaking through it. Separate front/back textures also keep index jumps correct. Printed textures are 2160×2400, with no mip-level blending; the book renderer supersamples even on a 1x display. Paper is neutral ivory with dark forest ink and restrained gutter shading. The camera frames both pages on desktop and the project page on narrow screens.

## Content and art

- `src/profile.ts`: the user's supplied Grade 10 and A-Level education; university enrollment is still ahead.
- `src/projects.ts` and `public/projects/`: 32 real journal entries: all 30 public GitHub repositories and two PDF research projects. Repository links and verified live-site links are clickable.
- `src/journey-path.ts`, `src/apple-motion.ts`, `src/AppleJourney.tsx`: original landscape choreography and apple cutouts.
- `src/book-motion.ts`, `src/meadow-camera.ts`: defocused transition, exact camera handoff, and paper deformation.
- `src/project-meadow.ts`: book geometry, painted scenery planes, generated page textures, and interactions.
- `src/BookJourney.tsx`, `src/book-journey.css`: accessible controls and static fallback.
- `docs/meadow-book-v2-art.md`: exact prompts and verified native dimensions for the four new assets. Originals are retained under `assets/source/`; the flowers and butterfly keep their native alpha.

No portrait of Siddhant is included because none has been supplied. Newton is a generated historical illustration. The old flat journal and underground implementations are no longer referenced by the runtime. Existing unused art is retained rather than deleting unrelated work.

## Verification

Twenty automated tests cover the original desktop/phone route, terrain clearance, impact alignment, unchanged education timing, attached tree wind, stem release, continuous camera handoff, 80/20 apple framing, defocus timing, reverse scrolling, and paper geometry. TypeScript and production builds are checked. Browser checks cover desktop and emulated phone layouts, scroll-driven opening, keyboard forward/backward page turns, and reduced-motion content. Browser emulation is not a physical-device performance test.

The full journey is 2206.25svh including the viewport. The original apple fall retains 270vh of travel. There is no video playback or autoplay-dependent handoff. Ambient motion shares the landscape's clock; user-triggered book interactions use elapsed time and pause naturally when the tab is hidden.

## October 2026 content and scene update

Personal details and four honors come from the supplied dossier. The journal includes every public repository in the recorded GitHub inventory, with forks labeled and two additional research entries. The printed project page links to a live site where verified, otherwise its GitHub repository. The searchable index also provides direct links.

The former observatory has been replaced by a painted laurel grove. A paper crane lifts from the journal's upper-left edge, banks left, then flies right through the lens without a pause. Its wing hides the environment change before it shrinks into the distance. Transparent, full-resolution painted branches and circular medal keepsakes provide depth and interaction. The original scene scroll distances are preserved.

See `docs/paper-crane-plan.md` for the storyboard and checks, `docs/paper-crane-art.md` for asset provenance, and `docs/content-pass.md` for dossier sources and publication verification limits. The dossier itself is not exposed as a public résumé download.

## Curated journal and next-scene preparation
The current journal is a deliberate 14-entry selection, not the complete repository inventory. It follows the order in docs/project-curation.md; research entries are reserved for the future publications section. The paper bird peak scale is reduced from 13 to 9 viewport widths. Three library assets and a concrete falling-medal storyboard are ready in docs/publications-transition-plan.md and docs/publications-assets.md. The publications scene is planned, not yet added to the live route.

## Library implemented
The falling-medal transition and research reading room are now live. See docs/publications-transition-plan.md for the final implementation and verified publication metadata. Research & Resources includes three distinct statuses, paper/code links and ML notebooks. All original pre-library scroll distances are preserved; the full route now ends at p=2.78.
