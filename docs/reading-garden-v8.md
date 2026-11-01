# Reading garden redesign — 2026-10-31

Replaces the rejected oversized snowy mountain panorama with a new sheltered garden: a rose-covered conservatory, low warm stone wall, timber buildings at the sides, open blue sky and distant rolling green countryside. The library remains v7; camera movement, content and interactive props retain their existing layout.

## Artwork and quality

- garden-panorama-v8.png: native 2172×724, generated as new artwork rather than another repaint of the mountain composition.
- garden-detail-v8.png: native 1619×971, separately painted conservatory close-up. Roughly twice the linear source density around the registered architectural area.
- Both encoded without resizing at WebP quality98 by scripts/encode-garden.mjs. No vector tracing, sharpening filter, or claim of native 4K.

The detail painting is sampled in the panorama shader through a fixed projective registration. Read-only SIFT/RANSAC analysis found 19 inliers with median 1.45-pixel error in the architectural region; the analyzed base coverage was x354–841/y273–599. This is approximate alignment of two paintings, not an exact crop. Broad distant scenery did not align and is explicitly excluded by the spatial mask. Detail is feathered only across the conservatory region, never swapped by scroll position. The main panorama supplies sky, hills and the floor continuously.

The new painting's wall/floor boundary is lower than the previous art. Cylindrical matte and projected floor now share a join at 855/1024, and the reflected paving extension uses the bottom16%. Existing polygon-offset protection remains. This changes artwork mapping only, not camera coordinates or motion curves. A failed optional detail load keeps the new panorama; the rejected mountain image is not a fallback for this scene.

## Main panorama art direction (summary)
New Studio Ghibli-inspired reading garden in a wide 3:1 composition: timber library cropped at left, veranda at right, warm limestone terrace, low stone wall, a modest rose-covered glass-and-wood conservatory, gentle sage/teal countryside and open azure sky. No snowy mountain landmark. Warm left-hand sunlight and cool leafy shadows, fine drawn architecture, continuous painted color, restrained flowers, no text or furniture baked into the image.

## Close-up art direction (summary)
Paint a high-detail registered view of the original garden's rectangle from 12% to 52% horizontally and 10% to 83% vertically. Preserve architecture and lighting; refine roof edges, windows, rose petals and foliage. No vector-traced or photoreal finish. The generated painting varied from the requested crop, so measured alignment and a restricted blend region were used instead of assuming an exact crop.

Generated with the built-in image tool. Source files are preserved in assets/source, with generator originals retained in the Codex generated_images directory. Alignment analysis is in ignored artifacts/review/analyze-garden-alignment.py and does not write or edit images.

Changes are local; no GitHub push or deployment.


## Validation

All 32 motion/content tests and production build passed. Desktop 1920x1080 and phone 390x844 browser captures covered courtyard reading, threshold, contact rotation, contact reading and reverse travel, with no page errors. The first broad detail mask caused mismatched distant hills; the final mask is restricted to the conservatory, and the final turn was visually reviewed. Preview: artifacts/review/vector-garden-desktop-0.png.
