# Scalable courtyard painting — 2026-10-30

The v4 panorama was only 2172×724 pixels for a 140-degree sweep. The camera displays a subsection of that image. A larger framebuffer and anisotropic sampling cannot reconstruct those missing source edges. There is no blur filter on the courtyard canvas.

## Chosen implementation

- Trace the existing painted shapes into actual cubic paths, preserving the calibrated 3:1 composition. The SVG contains no embedded bitmap.
- Keep the vector master in `assets/source/contact-panorama-v5.svg`.
- Pre-render the paths at 8192×2731 (2.20 MB WebP) and 4096×1365 (1.00 MB WebP). This is vector rasterization, not bitmap enlargement or AI super-resolution.
- Load the 8192 tier when the GPU supports it and the browser reports at least 8 GB device memory. Use 4096 otherwise. Browsers without the memory API default to the high tier when supported. The existing v4 asset is a network-failure fallback.
- The larger tier uses roughly 119 MB GPU texture memory with mipmaps, versus 30 MB for 4096. Do not upload the SVG or retrace it on each animation frame. The source SVG is never downloaded by the live application.
- Static/reduced-motion backgrounds use the 4096 tier. Remove the redundant v4 panorama preload: the projection loads only its selected tier.
- No changes to camera paths, perspective calibration, scroll timing or background UV coordinates.

## Reproduction

Tool: [VTracer](https://github.com/visioncortex/vtracer), official Windows CLI release `1.0.0-alpha.4`. The temporary executable is in ignored `artifacts/review/vtracer/`; it is not an application dependency.

```powershell
vtracer.exe assets/source/contact-panorama-v4.png assets/source/contact-panorama-v5.svg --preset photo --mode spline --filter-speckle 2 --color-precision 7 --gradient-step 12 --simplify 0.45 --path-precision 2 --optimize 2
```

Add `viewBox="0 0 2172 724"` to the generated SVG root, then run `node scripts/encode-vector-panorama.mjs`. The encoder changes the SVG output dimensions before rendering, and rejects embedded raster images.

## Tradeoffs and validation

Curves remain crisp when enlarged, but tracing cannot recover detail absent from the painting. This version has more defined, flatter color regions. It is not newly painted native 8K detail, and the runtime texture is finite resolution; arbitrary unlimited browser zoom will eventually soften it. The library and foreground sprites remain raster artwork.

Compared original, simplified and detailed traces at 3×. Selected the painterly trace to preserve more shading. Browser captures at identical camera positions cover the doorway, courtyard, contact rotation, contact reading and reverse passage on 1920×1080 and 390×844. Verified that desktop loaded 8192×2731 and constrained mobile loaded 4096×1365, with no page errors. Production build passed. Review captures and scripts are in ignored `artifacts/review`.

Changes remain local; no GitHub push or deployment.
