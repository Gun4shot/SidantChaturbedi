# Return to the sky — 1 November 2026

The Contact finale now continues into a closing sky scene and a forward scroll loop. Existing chapter travel distances are preserved; only the end of the route is extended, from p=4.42 to 5.55. There is a thank-you reading stop at 5.04.

## Choreography
- 4.42–4.98: painted clouds cover the departure from the garden. The scene exchange at 4.74 occurs while the cloud veil is fully opaque. Reverse scrolling evaluates the same veil.
- The original landscape renderer resumes with cameraPosition(0) and cameraTarget(0), original assets, and the same ambient clock. The original apple/Newton foreground is evaluated at its opening pose too. This is the actual starting scene, not another painting or screenshot. Later scenes are hidden beneath the veil without remounting.
- Around 5.04: “Thank you for wandering” and a short closing note. A Wander again button restarts directly.
- 5.18–5.43: the thank-you fades and the actual opening Hello/chrome fades in. There is a short matched-view interval before the endpoint.
- At 5.55: once native scroll and the damped render clock have both reached the end, both reset to zero in the same frame. The scene-snap timer is canceled through journey-loop. The renderer and ambient clock remain alive, so birds/clouds do not reset. Continued downward input begins another traversal. Returning upward before the endpoint retraces the finale to Contact.

## Accessibility and fallback
The thank-you has semantic HTML, a visible button and focus styling. Hidden opening controls are inert until the Hello reveal is complete. Contact controls become inert after departure. Reduced motion/WebGL fallback gets an ordinary-scrolling final section using the same static valley-master background as its opening, plus an explicit instant restart. It does not auto-loop.

## Validation
34 motion/content tests cover the unchanged earlier distances, exact camera match, full cloud coverage at the exchange, final reading stop, and the reset gate. Production build checked. scripts/verify-ending.mjs compares desktop/phone scene captures with the ambient clock paused, checks the closing message, button restart, scrolling across the seam, second-pass scrolling, reverse navigation and reduced-motion restart. The visible sky matches exactly; the browser may rerasterize the tiny distant Newton cutout after visiting zoomed scenes. Its transform/bounds are checked for exact equality and pixel differences are restricted to that cutout and shadow bounds and less than 0.1% of the viewport. Physical-device touch testing is not claimed.

Included in the 1 November release batch requested by the user. Deployment status must be checked against the release commit.

Final browser verification passed on desktop and emulated phone: wheel/touch seam crossing, explicit restart, continued second-pass scrolling, reverse return to Contact, and reduced-motion restart.
