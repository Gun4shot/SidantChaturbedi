# Learning Courtyard — local implementation, updated 28 October 2026

The subsequent [contact finale](contact-veranda-implementation.md) extends this same renderer with a shared panoramic exterior and a 65° camera turn. It supersedes the standalone exterior depth mesh described below; the library geometry and doorway camera path remain in use.

The new Leadership & Community chapter follows research. It presents four concise stories: AION scientific/training leadership, A-Level Computer Club, Cambridge tutoring, and community teaching through PiE and Nepal Baal Sewa Aashram. Content comes from pages 4–5 of the user's October 2026 dossier. Outreach targets are not represented as achieved participation, and school apps are not represented as completed releases.

## Continuous scene

The library's lower-right arch is an unobstructed opening with genuine transparency. Both the library and courtyard are present before departure. There is no full-background crossfade, blur wash or midpoint image swap.

At journey progress 2.80–3.48 the manuscript rolls closed and one camera follows a smooth dolly curve toward the opening. Eye height and focal length stay fixed. The camera turns along its direction of travel, crosses the recessed doorway, and settles in the courtyard. Near architecture moves faster than distant hills because of its depth. The board is visible through the doorway before arrival. The four story tabs enable on arrival; the completed courtyard snaps at 3.53. Earlier chapter distances remain unchanged.

The generated opening already removes its railing and window bars, so no separate hinged panels are required. The original library painting remains available as the static/loading fallback. The revised library plate preserves its layout but changes the selected bay into a doorway; it is not claimed to be pixel-identical to the original.

`courtyard-motion.ts` defines a calibrated pinhole camera, the room and doorway, the camera path, and the board's projection. `courtyard-projection.ts` projects the existing paintings onto shallow geometry: library walls and floor, an angled doorway bay, exterior ground, and a depth mesh for the distant scenery. The original view is reproduced by projective texture coordinates; the moving camera then reveals perspective and parallax. Depth testing keeps the board behind the library until it is seen through the aperture. Reverse scrolling retraces the same poses.

The existing Three.js dependency renders painted surfaces, with no sculpted or conventionally lit models. HTML board content uses an exact homography from the same camera, so its text stays registered with the painted board. Rendering occurs only when the camera or viewport changes, and pixel ratio is capped at 1.75. The board has semantic selection buttons, live story content, keyboard focus styles, an AION link, and an email link. The library footer provides an explicit continuation control while preserving normal manuscript scrolling. Reduced-motion mode lays the courtyard out as a static section without this renderer.

See [camera research and calibration](doorway-camera-research.md) for the source material, projection equations, and limits of reconstructing depth from a single painting. This replaces the first implementation's independent CSS scale curves.

## Artwork and delivery

Created with the built-in image generation tool. Originals are preserved under `assets/source/`; runtime WebP files are under `public/art/`. Native resolution is 1536 × 1024 for all three images. WebP encoding uses quality 90 with alpha quality 100; no enlargement or compositional alteration is performed during encoding. `scripts/encode-courtyard.mjs` records the encoding operation. The existing laurel branch supplies a small foreground canopy layer.

| Original PNG | Runtime asset | Role |
| --- | --- | --- |
| `assets/source/library-arch-v1.png` | `public/art/library-arch-v1.webp` | Library with transparent right doorway |
| `assets/source/learning-courtyard-v1.png` | `public/art/learning-courtyard-v1.webp` | Exterior courtyard and distant Himalayan ridge |
| `assets/source/teaching-board-v1.png` | `public/art/teaching-board-v1.webp` | Transparent hanging chalkboard, with HTML content |

Full generation prompts are recorded in `learning-courtyard-prompts.md`; provenance entries are in `assets/manifest.json`.

## Verification

- Camera tests cover continuity, reverse travel, unchanged initial library framing at five screen sizes, a single crossing inside the actual doorway, depth parallax, matching HTML/painted board projections, and unchanged earlier scroll distances.
- Browser review captures library, approach, threshold, arrival and reverse travel at 1440 × 900 and 390 × 844.
- Interaction checks exercise all four stories, the continuation control, returning to the library, research index replay and the reduced-motion fallback.
- Screenshots are local review artifacts under `artifacts/review/` and are not published.

No GitHub push or deployment was performed.
