# Contact finale — the letter veranda

Plan from 28 October 2026. Implemented locally after user approval; see [implementation and final approach](contact-veranda-implementation.md). The implementation uses a continuous panoramic clean plate to avoid a visible join between separate side-view paintings. No push or deployment.

## Creative direction

Finish the journey with a sweeping lateral camera move into a small, sheltered veranda adjoining the courtyard. The camera follows an approximately 65–75° arc around the near tree and its stone planter. The teaching board passes left, the trunk moves across part of the foreground, and a warm wooden letterbox comes into view on the far side. The mountain view remains visible through the railing, anchoring the two compositions in the same place.

The new sensation is turning a physical corner. Keep the camera level and the lens fixed. Do not roll the viewport or spin the whole painting. The final image should feel quiet and welcoming after the movement: honey-colored timber, the same afternoon light, climbing flowers, a small brass latch and an ivory letter emerging from an open wooden box. No desk is needed.

Proposed closing copy:

> Every good idea starts with a hello.
>
> Have a project, a research question, or something worth exploring?
> Let’s talk.

Keep the wording brief; the email and two profile links are the useful content. The letter is a readable HTML surface in the scene, not generated typography.

## Camera choreography

Append this move after the courtyard reading stop at journey 3.53. Tentative transition interval: 3.62–4.24, with a final contact reading stop around 4.29. Tune the scroll distance using a rough camera prototype; preserve all existing earlier travel distances.

| Part of transition | Visible action | Spatial purpose |
| --- | --- | --- |
| 0–18% | Courtyard overlay copy recedes. The camera takes a slight step to the right and begins to turn; the board remains planted in its original position. | Establish lateral movement before increasing rotation. |
| 12–48% | The camera follows a broad arc beside the tree. The board moves left and becomes foreshortened; near bark and leaves cross faster than the mountain ridge. | Make the change of viewpoint legible through parallax. |
| 35–76% | A letterbox and veranda are already visible beyond the trunk. Near bark and the porch upright partially occlude the view as their side faces become visible. | Reveal the adjacent space continuously; avoid a hidden whole-scene replacement. |
| 65–91% | The camera leaves the arc on its tangent and approaches the box slightly. Its lid hinges open and an ivory note lifts from inside, with its lower edge still seated in the box. | Tie the contact reveal to a physical object without another paper-unrolling sequence. |
| 85–100% | The note settles nearly square to the view; the camera eases to rest. Contact controls become readable and focusable. | End with a stable, generous reading composition. |

These intervals overlap. There is no intermediate pause or snap. Opening the box is scroll driven and reversible. Do not trigger a repeating autonomous opening animation whenever the user moves the pointer.

## How the turn will stay seamless

Use the current courtyard's final camera pose as the exact start pose. Extend the existing scene and camera rather than mounting a second independently animated scene. Keep one projection, one horizon, one eye height and consistent depth testing throughout.

Prototype a wide arc of roughly 3–4 world units around a selected near-tree pivot. Aim progressively from the courtyard towards the letterbox, with no sudden target switch. Use a continuous curve and smooth endpoint acceleration; join the exit approach with matching direction and speed. The rotation angle is a framing target, not a reason to force a tight orbit through scenery.

The existing exterior is a painting projected onto a shallow mesh. It cannot support a large side turn by itself. Before committing to the final camera path:

1. Separate the near tree, planter and visible porch edge from the courtyard background. Prepare a clean plate behind them so the tree does not appear twice as the viewpoint changes.
2. Extend the ground and side architecture into the newly visible veranda. Use adjacent front/side surfaces with shared physical edges and matched painted textures. A painted front/side atlas gives thickness to the letterbox; its lid uses a real hinge pivot.
3. Prepare matching oblique artwork for tree and porch surfaces that become visible during the turn. Use fixed projective textures or a common UV atlas on shallow geometry. Avoid camera-facing billboards that visibly swivel and avoid progress-based swaps between entire images.
4. Keep the distant ridge/sky consistent across the panorama extension. Place the new scene in the world before the camera departs; its first visible sliver must match its later full view.
5. Use the near trunk and veranda post as normal occluders. They can cover local matte boundaries, but the scene must work when stepping through frames or reversing direction. Do not rely on a full-screen wipe to hide a teleport.
6. Split floor surfaces at their shared boundary where possible. Where projected surfaces must overlap, retain explicit depth priority to avoid the floor flicker fixed in the courtyard.

If the source artwork cannot support the desired angle, reduce the arc before introducing stretched surfaces. The prototype must establish convincing continuity before decorative art and animation are polished.

## Artwork to prepare

- Matched courtyard clean plate with backfilled areas beneath the separated foreground tree/planter.
- Transparent near-tree and foliage layers, plus matching side-facing bark surfaces for the limited arc.
- Adjacent veranda master painting using the current courtyard as reference: same horizon, sun direction, palette and architectural materials.
- Separate veranda upright, low railing, flowers and near ground edge for depth and occlusion.
- Letterbox front, side, inner recess and hinged lid in one consistent painted atlas; blank ivory note and small envelope detail.
- Shared distant scenery extension for the new viewing direction, inspected for doubled or jumping landmarks.

Preserve the existing courtyard reading composition as closely as possible. Start with gray geometry and existing textures; generate final assets after the path and required revealed surfaces are known. Record asset provenance and inspect native resolution at the closest planned view.

## Contact content and interactions

Read values directly from `src/profile.ts`; do not duplicate or silently correct their spelling:

- Email: `sidant.chatubedi@gmail.com` — primary visible address, `mailto:` link, and a small Copy action with truthful success feedback.
- GitHub: `https://github.com/gun4shot`.
- LinkedIn: `https://www.linkedin.com/in/sidant-chaturbedi-9a7181321/`.

These are the existing project values, not newly verified external account ownership. No invented phone number, availability status, response-time promise or contact-form submission backend.

Use one clear note with the headline, short invitation, email, and GitHub/LinkedIn links. Anchor the HTML to the note using the same world-to-screen projection as its painted surface. Settle it almost frontal and make it large enough to read without hunting for a tiny interactive object. Use warm ivory against dark ink; background decoration must not interfere with the email.

Keep the final composition calm: only slight leaf movement or a small envelope corner flutter. Hover/focus can underline links and lift a subtle paper shadow. The note itself should not tilt away while someone reads or copies the address. Provide an unobtrusive Back to the courtyard control and Back to the sky action. The scene ends at a stable scroll stop; no forced automatic restart.

## Responsive and accessible behavior

Desktop: letterbox/note occupy the central-right area, with sky and valley providing breathing room. The note is the primary reading surface rather than a separate wall of contact cards.

Phone: fit the same arc to a portrait-safe view and make the final note nearly full width. Keep the box's hinge visible below the note; place controls vertically with comfortable tap targets. Adjust the framing rather than increasing camera speed or shrinking the text.

Reduced motion: show the final open box and contact note as a static section. Links, copy feedback and navigation must work without camera movement. Controls stay out of the tab order during travel and become available on arrival. Snap at reading compositions only.

## Implementation and review order

1. Build a disposable rough layout of the arc, tree/porch occluders and box. Validate camera position, gaze and horizon from the existing courtyard endpoint.
2. Capture five storyboard poses: courtyard, early arc, beside the trunk, veranda reveal, final note. Review desktop and portrait before generating detailed artwork.
3. Create and integrate only the required visible surfaces; check that the original courtyard composition still matches.
4. Add the hinged lid and rising note, then the real contact links and copy feedback.
5. Review forward/reverse travel, small scroll increments around occlusion boundaries, fast jumps, resize and reduced motion. Inspect the full path for texture stretching, gaps, floor flicker and sliding text.
6. Verify email/profile destinations, keyboard focus, clipboard success/failure, final snap behavior and production build. Keep changes local until the user asks to publish.

Acceptance criterion: the viewer experiences a continuous turn around a courtyard landmark into an adjacent place, then encounters a simple, immediately usable invitation to make contact.
