# Honors art refresh — 2026-10-29

## Visual direction and scope

Carries the accepted v4 project meadow style into the laurel grove: broad cerulean/cream sky, simple distant blue-green mountains, a quiet sunlit grass bank, simplified leaves and cool shade beneath the tree. Light comes from upper left across all assets. Award content, four selections, settled sizes, bird flight, scroll timing and leaf transition path are preserved. Thin hanging cords connect ribbon loops to the branch.

Three raster assets were generated using the built-in image tool; native PNGs retained and exported to WebP at quality 98 / alpha quality 100 without enlargement. Each is 1672×941; these are not native 4K images. The medal is an original hand-authored SVG cel prop, with true transparent loop, warm metal rim, restrained highlights, blank center for existing HTML symbols, and resolution-independent edges. Generated medal alternatives had unwanted halos and are not shipped.

| Source | Runtime |
|---|---|
| `assets/source/honors-grove-v4.png` | `public/art/honors-grove-v4.webp` |
| `assets/source/laurel-branch-v4.png` | `public/art/laurel-branch-v4.webp` |
| `assets/source/laurel-passage-v4.png` | `public/art/laurel-passage-v4.webp` |
| Original SVG source and runtime | `public/art/honor-ribbon-v4.svg` |

## Lighting and continuity

Soft light/shadow patches, pollen drift and subtle medal sheen use the existing ambient clock and respect Pause. Reduced-motion styles freeze added decorative light transforms. No full-screen blur added. Palette matching reduces the color change during the existing continuous bird blend. The outgoing leaf now matches the branch style and retains its original horizontal silhouette and dimensions. Its repeated background underlays retain opaque coverage through the scenery swap.

Sampled the actual leaf alpha at an 11×11 viewport grid over every .005 step of the blend window, at 1440×900, 390×844 and 844×390. Minimum effective opacity with the existing three layers was 0.999998, so no scenery cut is exposed.

## Exact background prompt

Create one original Studio Ghibli-inspired anime background, matching the broad SIMPLE painted shapes and clean summer color palette of reference 1 (accepted portfolio meadow) and reference 2 (animation reference, lower panel). Landscape 16:9, highest native resolution. A peaceful laurel grove on the NEXT part of the same grassy hillside, looking out over a distant Nepali valley. Bright cerulean sky and two large ivory cumulus clouds with broad cool blue-gray shadow shapes. Three gentle overlapping blue-green mountain silhouettes in far distance, a single restrained snowy peak at far right; no tiny ridgelines or detailed villages. Fresh green grass with a handful of small white flowers at the extreme bottom corners. At far RIGHT edge a graceful old laurel tree trunk with broad clean shapes of green canopy framing only the upper-right corner; a few broad leaves along far top left. Most of CENTER and LEFT is calm open sky/valley, deliberately quiet behind later HTML headings and achievement story. Right-middle sky also quiet because four hanging medals will be composited there. Horizon around 55% height, grassy near bank across lower 25%. Warm afternoon sun from UPPER LEFT, golden thin highlights on right tree and upper leaf edges, broad cool emerald shade at lower-right. Believable single-source lighting, not uniform brightness. Hand-painted animation background: simple confident brush masses, clean color boundaries, a few selective fine dark contours, no micro-detail, no speckling, no dense leaf clusters, no canvas grain, no 3D gloss, no photographic textures, no lens blur, no dramatic god rays. Think of the same quiet summer afternoon as reference 1, now sheltered by a laurel tree. No path, no buildings, no mountains filling the screen, no foreground branch crossing center, no medal, no ribbon, no people, no words, no watermark. Original calm beautifully composed scene with lots of breathing room. Do not reproduce the many detailed leaves of earlier images.

## Exact branch prompt

Restyle reference 1, the transparent laurel branch, as a SIMPLE clean hand-painted anime prop matching reference 2, the accepted summer meadow. Keep reference 1's EXACT functional composition: a woody branch enters from TOP RIGHT and extends left across the TOP QUARTER, with a shorter leafy droop down the RIGHT EDGE. Landscape 16:9 canvas, true transparency across the large empty lower-left/center and through leaf gaps. This will hold hanging medals in a portfolio. Sparse elegant laurel leaves, about 22 broad leaves total with 3-4 small ivory blossoms, not dozens of tiny leaves, no veins beyond one simple central stroke. Smooth sage/emerald green leaf faces with one broad cool teal shadow per leaf, warm yellow-green accents on upper-left-facing edges, simple warm brown branch with one shadow side. Thin dark green/brown outlines, confident simplified cel painting, no rough grain, no realistic bark, no tiny texture, no gold glitter, no glow or halo, no blur, no canvas backdrop. Warm sun consistently from upper LEFT. Strong clear silhouettes and beautiful quiet shapes like a hand-drawn Studio Ghibli animation cel. Keep all lower central 70% canvas transparent, no medal, ribbon, text or scenery. Preserve branch orientation, shape coverage and aspect ratio to support the existing animation without layout changes. Highest native quality.

## Exact passage-leaf prompt

Restyle the attached single laurel leaf as a SIMPLE clean hand-painted anime animation cel to match a bright summer Studio Ghibli-inspired meadow. Preserve its exact horizontal composition and silhouette footprint: short stem at far LEFT around mid-height, broad oval leaf body filling central 90% width and central 76% height, tapered pointed tip at far RIGHT around mid-height. Landscape 16:9 canvas, fully transparent background outside leaf. Leaf body MUST BE FULLY OPAQUE, solid green with no holes or translucent patches, because it will pass across camera to conceal a scene change. Broad sage/olive green fill, one large cool emerald shadow mass across lower-left portion, warm yellow-green upper-left sunlit edge, ONE pale central vein and only 5 simple curved secondary veins per side. Thin clean dark green outline. No tiny veins, no canvas grain, no realistic texture, no speckles, no shiny wax reflections, no luminous halo, no blur, no background or cast shadow. Clear beautiful hand-painted shapes and very restrained tonal variation. Keep original silhouette, margin, stem direction and aspect ratio for compatibility with the existing camera transition. Highest native quality.

## Checks

`npm test`: 32 passing camera/geometry/content tests. `npm run build`: successful. `scripts/verify-honors-art.mjs v4`: desktop and mobile four-award selection, story bounds, Pause behavior, forward/reverse transition captures and no runtime or resource errors. Review captures live in ignored `artifacts/review/`.
