# Current tree and apple sequence

The underground experiment is removed. The journey ends on red.

The original painted sky and meadow lead into a brief pullback, a leftward glide, and a forward move toward the same tree. The canopy camera faces directly ahead, with no pitch, roll, or oblique angle. Four small notes surround its center, linked to circled apples. Fifteen apples are placed in the crown. Newton is a smaller painted cutout at the tree base.

## Logical choreography

Percentages below refer to animation progress. Physical scrolling is mapped through `scroll-timing.ts`: only 28–35.5% is compressed to 55% of its former scroll distance. The fall and its education cards retain their original duration.

- 0–24%: sky to meadow.
- 24–28%: meadow introduction.
- 28–35.5%: pull back, glide left, push toward the crown.
- 35.5–49%: four introduction notes.
- 49–55.5%: camera approaches the selected apple.
- 55.5–82.5%: vertical fall through three education stages; camera follows closely, slightly to the right; from 75.5% it smoothly pulls back to reveal the full encounter.
- 82.5%: physical head contact, with the camera settled into the wider view and the physical apple size unchanged.
- 82.5–87%: rebound and ground landing.
- 87–91%: landing hold.
- 91–99.5%: continuous camera dolly into the intact, stationary apple, ending on red.

At 50.5–55.5%, during the camera approach, the hanging apple rocks around its stem and makes a small downward tug. Its final lean carries into the beginning of the fall; the tether recoils at 55.5–56.8% and the residual stem rotation settles by 58.5%. The breaking action is the stem detaching from the tree, never the apple body splitting after landing.


All image positions and apparent sizes are projected from world anchors using the same camera as the landscape. The apple's physical size remains 1.05 units throughout. Its x and z remain fixed until head contact, then it rebounds sideways to the ground. The camera stays level through the fall and final approach. Reverse scrolling retraces the same deterministic path.

Desktop and phone use different framing offsets. On narrow screens the four notes form a compact two-column layout below the crown. Reduced-motion and WebGL fallback remain ordinary scrolling text sections. No new modeled props are added.

The nine automated tests cover terrain clearance, camera joins, frontal framing, vertical fall, unchanging physical size, smooth close-to-wide framing before impact, rebound, stationary landing during the camera dolly, red coverage, reverse traversal, timing-map inversion, unchanged fall distance, card emergence, and stem-release continuity and tree-wind synchronization. Browser screenshots are under `docs/screenshots/`.


Both the About Me cards and the education cards scale and translate from an anchor at the apple into their normal reading position, then fold back toward the apple. Anchors use cached, untransformed layout measurements. Reduced-motion mode displays the cards normally, with no animated detachment.

Canopy fruit anchors use the same sine wind wave and five-row interpolation as the hero tree shader. Wind influence blends out at detachment so the apple joins its original straight falling path continuously. Pause freezes the shared ambient wind; scroll still controls the release.
