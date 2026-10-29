# Doorway camera: research and implementation

28 October 2026. Applied locally to the library → learning courtyard passage.

## Why the original move looked wrong

Uniformly scaling an image changes every feature by the same factor. A camera moving through a room does not: nearby jambs move across the view much faster than far scenery, the floor foreshortens, and the view of an angled opening changes as the camera turns. Independently scaling the interior and exterior did not give them a shared horizon, camera position, or occlusion relationship.

Panning rotates a camera; dollying translates it. Zooming changes focal length. This shot needs a dolly combined with a controlled pan, with a fixed lens and level eye height. It does not need a dolly zoom, which deliberately changes the foreground/background relationship.

## Sources and the principles used

- [NVIDIA VPI: pinhole camera model](https://docs.nvidia.com/vpi/appendix_pinhole_camera.html): separate camera intrinsics (focal length, optical centre) from pose, and divide projected coordinates by depth.
- [MIT: pinhole image formation and linear perspective](https://people.csail.mit.edu/fredo/comp-photo-book/02-fundamentals-02-pinhole-image-formation-and-linear-perspective.html): projection, field of view, and the relationship between depth and apparent size.
- [Autodesk: camera mapping](https://download.autodesk.com/us/maya/2013help-composite/files/GUID-AA9C3E04-7C5A-4781-A314-7135DD078494.htm): project a painting from its capture camera onto geometry, then render with a moving camera.
- [Maxon: Projection Man](https://help.maxon.net/c4d/s26/en-us/Content/html/32201.html): camera-projected matte paintings can support moving shots without modelling and shading every visible detail.
- [The Walt Disney Family Museum: the multiplane camera](https://www.waltdisney.org/blog/machine-imagination-walt-disneys-pinocchio-and-multiplane-camera): artwork at different depths creates relative motion and depth while preserving the illustrated aesthetic.
- Horry, Anjyo and Arai, *Tour Into the Picture*, SIGGRAPH 1997: reconstruct a simple scene from a painted background, vanishing point and foreground layers. [SIGGRAPH visual proceedings](https://history.siggraph.org/wp-content/uploads/2022/11/SIGGRAPH-1997-Visual-Proceedings.pdf) and [Stanford's course implementation](https://lightfield.stanford.edu/courses/cs99d-98/online_projects.html). The paper's full Princeton-hosted PDF was inaccessible during this research; the implementation follows the general published method, not a claim to reproduce the paper exactly.

## Applied camera model

For a world point transformed into camera coordinates `(X, Y, D)`, with positive forward depth `D`:

```
screenX = cx + focal * X / D
screenY = cy - focal * Y / D
```

The source painting is 1536 × 1024. Its approximate calibration uses focal length 1100 source pixels, optical centre `(768, 610)`, and eye height 1.6 world units. The offset optical centre preserves the painted horizon without pitching the camera. Responsive cropping changes the viewport intrinsics once per viewport size; scroll progress never changes focal length.

The library is a small set of projected walls, a horizontal floor and a ceiling. The selected doorway occupies a recessed bay angled 40° from the original camera axis. This calibration is inferred from the painting, not a surveyed architectural measurement. A cubic Bézier path approaches that bay and crosses its transparent aperture. Camera yaw initially follows the path tangent, then anticipates the turn and aligns with the doorway before crossing, as a camera operator would aim into the next space. Smooth easing at the journey endpoints has no stop or camera handover at the doorway. The crossing is around journey progress 3.264.

The courtyard has a horizontal ground plane and a shallow projection mesh. Edge architecture and the lower wall are nearer than the mountains. A fixed capture camera supplies texture coordinates; only the viewing camera moves. A 96-source-pixel overscan extends the matte's border using clamped edge samples, covering the small off-axis view just before crossing; it does not reconstruct unseen scenery. The chalkboard is a world plane six units in front of the final camera. Its accessible HTML uses the same camera's projective transform, rather than an independently animated CSS scale.

Depth testing produces the reveal: the library physically occludes the courtyard and board, while the transparent aperture lets them show through. At the threshold, the near frame passes outside the camera's view. There is no background swap or opacity crossfade in this passage.

## Practical limits

A single painting does not contain hidden surfaces or exact depths. The architecture and exterior depth mesh are plausible approximations; the path is constrained to views the source artwork can support. Very close texture details can soften because the source image is 1536 × 1024. This is a genuine perspective projection of illustrated geometry, not a photogrammetric reconstruction. No higher-resolution source or unseen room detail is invented in this revision.

The renderer runs only on pose or viewport changes, caps device pixel ratio, and releases geometry, materials and textures on unmount. Reduced motion keeps the static illustrated layout. Tests check source-frame alignment, constant eye height, continuous travel, doorway clearance, parallax, reverse scrolling, and exact registration of the board's HTML corners with its rendered corners.
