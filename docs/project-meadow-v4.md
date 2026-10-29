# Project meadow v4 — reference-led revision

## Correction

The v3 garden was too dense and micro-detailed. Its hovering, strongly tilted book did not belong to the painted ground. V4 follows the user's new two-panel anime reference: broad cream clouds with cool gray-blue shadow masses, cerulean sky, open bright green hills, sparse flower accents and simplified props. The supplied reference is used as visual guidance, not copied into the website.

## Runtime assets

Generated with the built-in image tool, original sources retained under `assets/source`. WebP exports retain native resolution, quality 98 and alpha quality 100 where relevant. No artificial upscaling.

| Asset | Source | Runtime | Native dimensions |
|---|---|---|---|
| Background | `assets/source/project-meadow-v4.png` | `public/art/project-meadow-v4.webp` | 1672 × 940 |
| Cover | `assets/source/journal-cover-v4.png` | `public/art/journal-cover-v4.webp` | 1024 × 1536 |
| Grass | `assets/source/project-grass-v4.png` | `public/art/project-grass-v4.webp` | 2172 × 724 |

The background remains below 4K; its cleaner shapes reduce visual noise but native detail still limits very large screens/zoom. The extra-wide grass sprite is rendered at its correct aspect ratio, not stretched into the old square foliage planes. Superseded v3 sources remain available for comparison.

Portrait screens use a bottom-aligned 118% background crop to keep the painted hill crest above the resting journal's far edge. Desktop and phone resting compositions were inspected, including a 1920×1080 capture.

## Book and continuity

Closed book scale is .76 and returns smoothly to 1 for the existing reading framing. Resting pitch is -1.37 radians instead of -1.12, matching a shallow grass bank. The idle bob is removed. A rectangular shadow uses the same resting transform and underside plane as the book; short grass tufts in the book's actual depth buffer overlap its lower edge. The shadow remains on the ground and fades as the book rises. The simple sage/ivory cover uses an unlit painted material to preserve the authored palette; page contents and project screenshots remain unchanged.

Apple camera handoff, reading endpoint/layout, page mechanics, scroll thresholds, snap positions and bird flight are unchanged. The old forest light rays and dark vignette are replaced by very faint moving cloud shadows over grass. Motion uses the existing ambient clock and respects Pause.

## Exact background prompt

Original Studio Ghibli-inspired hand-painted anime film BACKGROUND for a portfolio, matching the LOWER PANEL of the attached animation reference very closely in rendering vocabulary, color and simplicity. The attachment is STYLE REFERENCE only. One single image, NOT split panels. Wide LANDSCAPE 16:9 composition, highest available native resolution, ideally 3840x2160. Art direction: big confident clean painted shapes; deep clear cerulean blue sky; two enormous soft-edged ivory cumulus clouds with broad cool blue-gray shaded undersides, just like the reference; vivid fresh grass-green rolling hill; simple dark green rounded trees on distant right edge. Peaceful summer wind. Sparse tiny white daisies and occasional coral flower dots, simple sweeping brush strokes suggesting grass, NO tiny repeated leaf detail. Restrained detail, large calm areas, crisp clean color boundaries, selective thin brown contour lines only on a few close objects, NO uniform outlines around every blade or leaf. Gentle traditional background painting, not intricate line engraving, not stippling, not noisy dots, not oil-paint texture, not canvas grain, not photorealistic, not glossy 3D. Composition designed for a separately rendered notebook: sky in TOP 52% of image, low grassy ridge crossing around 53% height. Foreground is a gently sloping open meadow toward the viewer, with a broad nearly FLAT quiet patch of warm yellow-green short grass centered at x50% y73%, completely empty, at least 40% of width. A small book will be rendered resting at that location. This foreground has human-scale blades 2-3cm tall, not miniature landscape trees. Keep flowers clustered only at extreme lower left and lower right, leave lower middle simple open broad painted grass. No path, no house, no rocks, no tree canopy, no fern wall, no mountains, no objects, no book, no person, no umbrella, no painter, no text, no watermark. Sun from upper left, pale warm light on central grass and a few broad soft cool green shadows near lower corners. Strive for simplicity and warmth, with the exact quiet graphic charm of the provided anime frame. Clear shapes rather than excessive detail. No blur effect, no camera depth of field.

## Exact cover prompt

A flat FRONT COVER TEXTURE for a small hand-drawn anime field notebook, completely face-on orthographic rectangle, portrait 2:3 canvas, no perspective or surrounding scenery. Match the clean cel-painted prop rendering of the LOWER PANEL of the provided anime reference: broad solid color areas, warm restrained shading, thin dark brown outer edge, NO grain, NO woven linen, NO speckling, NO intricate filigree. Entire canvas filled with smooth muted sage-teal green cloth color (#547b69 approximate), only very subtle broad brush variation. Fine warm ivory double-line rectangular border inset 5% from canvas edges, simple small hand-drawn ivory sun-and-leaf emblem centered at x50% y35%, emblem no more than 20% canvas width. Lower half clean and completely empty, because typography will be rendered separately. Restrained cream, sage and dark green palette, crisp uncomplicated outlines like a journal prop in a Studio Ghibli animation cel, NOT photorealistic or antique ornament. No lettering, no watermark, no book thickness, no open pages, no image border outside the texture. Opaque full rectangular texture.

## Exact foreground prompt

Transparent sprite: a SIMPLE 2D hand-painted anime tuft of short meadow grass, exactly three small ivory daisies and two tiny coral flowers. About 20 long sweeping grass blades in three broad flat shades of fresh summer green, clean cel-painted color shapes, selective fine dark green strokes, just like grass in the LOWER PANEL of the attached reference. No veins, no fern fronds, no ivy, no hundreds of dots, no grain, no photorealism, no 3D rendering, no intricate botanical detail. WIDE low tuft, approximately 3:1 silhouette, roots along the bottom, taller grass in middle, irregular natural perimeter. Landscape image, maximum native quality. True transparent background through all gaps. No dirt platform, no cast shadow, no scenery, no text, no watermark. Warm sunshine from upper left, cool grass-green shadow underneath. A small charming animation cel with SIMPLE confident brush shapes.

## Validation

All 32 camera/motion tests pass, including continuity across every book pose and added assertions for the smaller rest size and unchanged reading scale. Production build passes. `scripts/verify-project-garden.mjs v4` checks desktop/mobile project links, previous/next pages, project index, light Pause, and reverse scrolling; captures arrival, rest, opening, reading and bird departure. Final screenshots use label `v4-final`. Nothing pushed or deployed.
