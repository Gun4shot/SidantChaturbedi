# Paper-crane passage

The original sky, apple, Newton and opening-book choreography is preserved. The white title banner is removed. The honors scene is a painted laurel grove built from transparent collage layers.

## Continuous scroll storyboard
- 1.36–1.48: a small paper crane waits at the upper-left edge of the open journal.
- 1.48–1.60: it lifts left and banks into a rightward flight. The journal camera leans into the departure.
- 1.60–1.83: the crane approaches the viewer, growing continuously. Its broad wing fills the screen near the center of the flight; the scenery changes behind the paper.
- 1.83–2.04: the bird continues right and shrinks out of view. The grove pulls back in layered perspective.
- 2.04–2.14: explore four hanging honors and contact links.

The flight has a continuous tangent at the left turn and a single size peak, with no middle hold. Scrolling backward reverses it. Reduced motion presents the same content without the flight.

## Projects
32 journal entries: all 30 public GitHub repositories from the recorded inventory, plus two PDF-only research entries. Forks are labeled. Each repository has a native clickable link; four responding live sites are the primary page destinations, with source links retained. No URLs were invented for the two research entries without published destinations. Page textures are cached lazily.

## Verification
20 automated checks pass, including original motion, transition continuity, reverse traversal, upper-left departure, rightward exit, paper occlusion and complete repository link coverage. Production build passes. Desktop and 390×844 browser layouts inspected. Actual mobile hardware performance remains unmeasured.

## Latest flight refinement
The flight now settles at p=1.90 (previously 2.04), reducing its scroll span by 25%. Peak bird size is 6 viewport widths (previously 9). The near-lens size curve and paper occlusion window are narrower, eliminating the prolonged covered middle. Flight background blur is zero; the earlier apple transition retains its original blur. Honors controls and text become available with the earlier arrival. 21 tests and production build pass.

## Final seamless-pass correction
Removed the full-screen paper-proximity element and its texture/gradient completely. Removed flight blur filter code, including the foreground leaf blur. Peak crane width is now 1.6 viewport widths, down from 6; on portrait screens this is based on width, not the taller dimension. Scenery blends over local flight progress 0.40–0.82 rather than switching at the peak. The outgoing meadow remains opaque beneath the incoming grove to avoid a brightness dip or exposing the original landscape. Incoming camera magnification is reduced to 1.3× for the background and 1.6× for branches, with pullback beginning during the blend. Browser inspection confirms no paper overlay and no meadow blur during the passage. 21 tests and production build pass.

