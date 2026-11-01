# Close-view vector detail pass — 2026-10-30

Scope: the library, outdoor panorama and foreground veranda tree. Scene composition, camera calibration, aperture mask, scroll timing and interaction code are preserved.

## Artwork

The accepted v5 outdoor SVG is the base. `scripts/detail-vector-scenes.mjs` adds 389 original SVG detail groups: leaf forms with fine veins, cream/coral blossoms inside existing shrubs, selected stone-edge highlights, a few snow contours and sparse paving-joint grass. Placements use the source painting's foliage colors and a fixed seed, so marks remain attached to the scene and do not change across exports. Details are deliberately sparse at normal viewing distance. No noise filter, sharpening halo or blur is added.

Library and tree were traced with VTracer 1.0.0-alpha.4 using the same detailed settings as v5:

```text
--preset photo --mode spline --filter-speckle 2 --color-precision 7 --gradient-step 12 --simplify 0.45 --path-precision 2 --optimize 2
```

Their inputs are the project-generated library-arch-v4.png and veranda-tree-v4.png. The original library-arch-v1 alpha still supplies the calibrated doorway. Tree cutout transparency is retained in the new vector master and exports.

`scripts/encode-detailed-scenes.mjs` renders SVG paths at target dimensions before WebP compression (quality 96, alpha 100). It rejects embedded bitmap elements. The vector masters stay in assets/source and are not downloaded at runtime.

| Artwork | High tier | Constrained tier |
| --- | --- | --- |
| Outdoor panorama | 8192×2731, 2.75 MB | 4096×1365, 1.15 MB |
| Library | 4096×2731, 1.20 MB | 2048×1365, 0.52 MB |
| Tree | 2048×3072, 1.17 MB | 1024×1536, 0.45 MB |

Tier selection uses the existing GPU texture-size/device-memory checks. Each revised texture falls back to its v4 asset if the new file fails to load. Duplicate v4 library/tree preloads were removed. Static/reduced-motion scenes use the constrained-tier backgrounds.

Tracing makes contours scalable but does not reconstruct absent photographic information. The new outdoor details are original vector embellishments; the library and tree gain sharper contours rather than newly invented fine detail. Runtime exports still have finite resolution.

## Validation

32 motion/content tests and production build passed. Desktop 1920×1080 and mobile 390×844 captures cover research reading, library approach, threshold, courtyard, contact turn, contact reading and reverse travel. Both panorama resolution tiers loaded correctly; no browser page errors. Tree alpha and doorway/floor alignment were visually reviewed. Close-view comparison: artifacts/review/close-up-detail-comparison.png (ignored review artifact).

No GitHub push or deployment for this pass.
