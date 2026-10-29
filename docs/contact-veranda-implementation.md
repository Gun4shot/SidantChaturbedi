# Contact veranda — local implementation

28 October 2026. The final contact chapter follows Leadership & Community. It remains local; no push or deployment.

## Camera and continuity

The new passage occupies journey 3.62–4.24, with a reading stop at 4.29. The overall journey ends at 4.42. Earlier absolute chapter travel distances are preserved by the existing scroll mapping.

`contact-motion.ts` starts at the exact final courtyard pose. A smooth lateral curve moves approximately 5.2 units right and 1.5 units forward while the camera pans 65 degrees. It is an arcing tracking move with a pan, not a viewport roll. Eye height and lens remain fixed. Reverse scroll evaluates the same pose function. Only reading compositions snap.

The first prototype used two adjacent paintings. Visual review exposed a hard architectural edge and stretched border samples. The final renderer instead uses a single continuous panoramic clean plate around both spaces, shared horizontal ground, and separate foreground tree and board. The original background tree was removed with the image tool so the foreground tree has no painted duplicate behind it. The panorama is fixed in world space on a cylindrical matte surface; the camera never swaps scenes or crossfades backgrounds. Foreground depth supplies parallax without folding the background painting into unstable guessed depth regions.

The panorama and horizontal ground meet on the same ring. The floor retains explicit depth bias against the library floor, preserving the fix for the previously reported flicker. The library doorway camera curve is unchanged. The exterior artwork is now the extended, more vividly inked courtyard panorama; it is not pixel-identical to the older standalone courtyard painting.

## Artwork

Created using the built-in image-generation tool. Prompts and the reference roles are in [contact-artwork-prompts.md](contact-artwork-prompts.md). Generated source files are retained unchanged. WebP conversion preserves native dimensions; no artificial upscaling was used.

| Runtime asset | Native dimensions | Purpose |
| --- | --- | --- |
| `public/art/contact-panorama-v1.webp` | 2172 × 724 | Continuous courtyard/veranda clean plate |
| `public/art/veranda-tree-v1.webp` | 1024 × 1536 | Transparent near tree and planter |
| `public/art/letterbox-atlas-v1.webp` | 2172 × 724 | Transparent body/lid atlas, sampled as separate parts |
| `public/art/contact-veranda-v1.webp` | 1536 × 1024 | Static reduced-motion contact scenery |

The new art uses saturated greens, turquoise sky, amber timber and dark anime ink contours. HTML supplies all actual wording and crisp paper borders. The underlying art remains a matte painting, with native-resolution detail limits at very large screen sizes; it is not a reconstructed photoreal environment.

## Letter and content

`ContactJourney.tsx` displays a hanging wooden letterbox. Its lid hinges back while an ivory note rises out of the opening. The note and its controls use a projective transform from the same camera as the world. It settles into a readable near-frontal composition. Ropes anchor the box visually in the veranda, and the scene remains still for reading.

The contact values come directly from `profile.ts`: email, GitHub and LinkedIn. The email uses a `mailto:` link and a copy control. Copy success is announced only after the clipboard promise resolves; failure tells the visitor to select the address instead. There is no fake message submission form or invented availability claim.

The courtyard footer now continues to the contact scene. The final header returns to the courtyard; the footer returns to the beginning. All controls are inert during travel and enabled on arrival. Reduced motion has a static contact section with the same links and copy action.

## Validation

- Unit checks cover exact camera handoff, continuous level motion, monotonic pan, reversal, unchanged previous poses, note projection registration and final snap behavior.
- `scripts/verify-contact.mjs` checks desktop/mobile forward and reverse views, real link destinations, clipboard behavior, continuation/back controls, and reduced motion. Review captures live in ignored `artifacts/review/`.
- The existing doorway/floor review is rerun because the exterior painting is shared with that passage.
- Production TypeScript/Vite build checked after integration.

This supersedes the plan's proposal to stitch several side-view background paintings. The shared panorama was necessary to avoid a visible join during the wide turn.
