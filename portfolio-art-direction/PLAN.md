# Siddhant Chaturvedi — sky to meadow portfolio

## Recommendation

Build one continuous Three.js environment with painted distant scenery and actual 3D terrain near the camera. Use a single scroll-driven camera path from above the valley down to a riverside clearing. This makes a continuous shot possible without a video-generation subscription.

The five generated paintings are an initial art kit, not a finished 3D environment or a tested animation. The opening and arrival paintings define the desired mood and composition; they are NOT frames to crossfade between. Their geography is visually related, not geometrically registered. The actual rendered scene must establish consistent geography.

## The experience

| Scroll progress | Camera and scene | Typography |
| --- | --- | --- |
| 0–15% | High above the valley; horizon and twin peaks remain visible beneath a large blue sky. Clouds drift and a few birds circle. | White “Hello.” with smaller “Scroll down.” |
| 15–65% | Camera travels forward and downward along a smooth arc. Clouds pass beside the view; distant mountains shift slowly while near terrain grows naturally. River remains on the right. | Greeting fades away early. |
| 65–85% | Camera eases into the riverside clearing, pitches gradually toward the horizon, and slows to eye height. Grasses and flowers enter the foreground. | Keep view clear during the landing. |
| 85–100% | Camera settles. Water, foliage and clouds continue subtle ambient movement. | Left: “Hi, I am Siddhant Chaturvedi.” Right: portrait cutout rises and fades in gently. |

Start with roughly four viewport heights of scroll travel and tune the duration in a real prototype. These are design starting points, not measured results. On mobile, use a shorter journey and stack text and portrait.

## How to make the descent seamless

- Keep one canvas, one scene and one camera mounted throughout. Do not switch background images or remount scene components at section boundaries.
- Build a real terrain mesh and a curved river surface. Use a limited, painterly palette with soft lighting and subtle surface detail. Nearby objects need volume because the camera will see them from changing heights.
- Place the mountain PNG far away on a broad scenery plane or shallow curved surface. Keep its edges outside the camera view; bury its base behind terrain and atmospheric haze.
- Use cloud PNGs on separated planes, with restrained scale variation. Keep them outside the camera's direct route to avoid intersecting a flat cloud or exposing its edge.
- Place grass sprites near the final clearing. Use real thin grass geometry for any plants the camera passes very close to or views from above. Anchor sway at the base.
- Move the camera along a continuous Catmull-Rom curve, sampled by arc length, with a separately authored smooth look-at target path. Keep a fixed field of view initially; avoid sudden zooms, roll, sharp pitch changes or passing through terrain.
- Map native document scroll to a single normalized progress value using GSAP ScrollTrigger. A small scrub delay (start around 0.4 seconds) smooths wheel input. Use that same smoothed value for camera position, orientation and text cues, so they stay synchronized. Avoid stacking several smoothing libraries.
- Use one gentle easing function across the journey rather than unrelated section eases. Scrolling backward should naturally retrace the same path.
- Use elapsed time independently for clouds, bird wing flaps, water and grass, so the world stays alive when scrolling stops. Pause ambient updates when the page is hidden.
- Preload the complete opening/landing scene before revealing the interactive experience. Keep an attractive poster visible while loading. Never swap in a different full-screen composition halfway through the descent.
- Check camera clearance along the complete path and test rapid scrolling, reversing, viewport resizing and deep-link reloads before calling the transition seamless.

## Initial stack

Vite + React + TypeScript, Three.js through React Three Fiber, and GSAP ScrollTrigger. Use normal HTML for all copy and navigation, positioned over the canvas. No text is baked into the generated images.

Only one system should own scroll progress. Keep touch scrolling native, expose a “Skip intro” action, and provide a static layout for reduced-motion preferences or unavailable WebGL.

The recommendation is a project-specific design inference. Supporting official documentation:
- [Three.js CatmullRomCurve3](https://threejs.org/docs/pages/CatmullRomCurve3.html)
- [Three.js PerspectiveCamera](https://threejs.org/docs/pages/PerspectiveCamera.html)
- [GSAP ScrollTrigger, including scrub](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

## Generated assets

| File | Dimensions | Purpose |
| --- | --- | --- |
| valley-master.png | 1672 × 941 | Elevated establishing reference and potential loading/static poster |
| riverside-arrival.png | 1672 × 941 | Ground arrival reference and potential reduced-motion illustration |
| cloud.png | 1957 × 804 | Transparent cloud for independent drift |
| mountains.png | 2117 × 743 | Transparent distant mountain backdrop |
| meadow-grasses.png | 1916 × 821 | Transparent foreground plants and flowers |

The three layer assets have verified alpha transparency. Images were visually reviewed. Before shipping, test edges on the actual blue/green scene backgrounds, reduce texture sizes where appropriate, and create compressed delivery copies while preserving these originals. Transparency and painterly edges still need in-scene compositing checks.

The artwork depicts a warm summer valley with upper-left sunlight, ivory clouds, blue-green mountain peaks, emerald meadows, and a turquoise river on the right. Keep that lighting direction across every future object and the portrait.

The images are not seamless repeating textures, 360-degree panoramas, depth maps, or 3D models. Do not wrap the entire master painting around a sphere and expect a correct descent.

## Remaining implementation assets

- Terrain and river geometry, with painterly materials.
- A few simple 3D birds with hinged wings and varied looping paths; this gives actual flapping without an AI video.
- A small set of trees/rocks or additional painted distant tree layers if the camera composition needs them.
- Optional tiling grass/ground textures after camera placement is approved.
- The user's real portrait, cut out with transparent background.

## Portrait treatment and user input

Provide one sharp waist-up or full-body photo, ideally around 2000 pixels tall or greater, in soft daylight. Keep hair, shoulders and any desired hands fully inside the frame. A plain contrasting background helps extraction; a pre-existing cutout is not required.

We can place the portrait on a plane with a soft grounding shadow and add a restrained entrance, subtle tilt and small pointer parallax. This is a 2.5D photo treatment, not a fully rigged 3D person. Avoid large rotations that reveal its flatness. A true animated avatar would require a separate model and rig.

Optional input: a short professional role or one-line bio for beneath your name. The riverside meadow is the chosen default environment.

## Build order and acceptance

1. Block out terrain, river and camera using simple shapes. Validate the entire descent before detailed decoration.
2. Match the art references using mountains, painted materials, clouds and plants. Review opening, mid-descent and landing from desktop and phone aspect ratios.
3. Add subtle ambient motion and HTML text choreography.
4. Add the supplied portrait and tune layout/contrast. The arrival painting remains fairly detailed, so use a restrained local backdrop behind the text if needed.
5. Optimize texture sizes, draw calls, alpha overdraw and device pixel ratio. Aim for 60 fps on a representative desktop and at least 30 fps on a representative phone; these are targets until tested.
6. Verify no visible scenery edges, camera intersections, cut transitions, loading pop-in or scroll jumps. Check keyboard navigation, skip intro, reduced motion, WebGL fallback and legible copy.

## Why not start with a video?

A video can be an optional later export of the established scene. For this interactive design, a real-time scene gives independent ambient animation and direct forward/backward camera control. Generating two beautiful stills does not guarantee a consistent video between them; mapping a video to scroll also needs separate seeking and device-performance validation. The recommended implementation requires no Luma or similar subscription.

## Scope of this delivery

Completed: five generated images, saved prompts, transition design and implementation plan.
Not yet implemented or performance-tested: the website, terrain, camera animation, birds and portrait treatment.
Existing project contents were not inspected or deleted; this planning and asset pass is self-contained in portfolio-art-direction.

