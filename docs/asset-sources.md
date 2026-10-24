# Art assets and resolution

All illustrations were generated with the built-in image_gen tool and saved as original PNGs. No source artwork was enlarged and described as native 4K. Original concept-generation prompts are in `../portfolio-art-direction/PROMPTS.md`.

| File in public/art | Native pixels | Runtime role |
| --- | --- | --- |
| mountains.png | 2117 x 743 | Distant mountain scenery |
| cloud.png | 1957 x 804 | Independently moving cloud planes |
| meadow-grasses.png | 1916 x 821 | Foreground and midground vegetation |
| tree.png | 1254 x 1254 | Instanced painted tree layer |
| ground-texture.png | 1254 x 1254 | Repeating fine-detail terrain material |
| valley-master.png | 1672 x 941 | Static/reduced-motion fallback |
| riverside-arrival.png | 1672 x 941 | Saved arrival reference; not switched into the live scene |
| apple-collage.png | 1254 x 1254 | Transparent painted fruit; canopy apples and continuous falling/zooming apple |
| newton-collage.png | 1134 x 1387 | Transparent painted Newton; animated DOM cutout |
| project-journal-v1.png | 1536 x 1024 | Open blank illustrated project journal |
| leaf-lens-v1.png | 1536 x 1024 | Botanical computer-vision project illustration |

The old flat journal asset is retained as unused historical art. The current journal is a physical Three.js book in a painted meadow. Its four new assets, verified dimensions, and exact prompts are documented in meadow-book-v2-art.md. Flower and butterfly artwork use native transparent alpha; the book cover texture is applied to beveled geometry.

The two former underground concepts (1672 x 941 each) are archived in `../portfolio-art-direction/archived-underground/` and are no longer website assets. Their historical prompts remain in `underground-prompts.md`. The current apple/Newton prompts are in `apple-art-prompts.md` and the current scroll sequence is documented in `tree-and-underground.md`.

Render resolution and source-image resolution are different. High and Ultra change the canvas drawing-buffer resolution. Texture tiling gives the near ground fine spatial detail without stretching one small landscape image over the screen. Distant backdrops and individual tree/grass sprites retain their original files and use mipmaps and anisotropic filtering. A future native-4K artwork pass could improve large-format still views; the generator returned the dimensions documented above.

## tree.png — exact generation prompt

Create one isolated mature leafy meadow tree as a high-resolution transparent-background asset for a Studio Ghibli-style 3D anime portfolio landscape. Rich hand-painted gouache, exquisite tiny leaf clusters, luminous warm upper-left summer sunlight, deep blue-green shadows, sage and emerald leaves with golden-green tips. Graceful slightly crooked brown trunk, spreading broad asymmetric canopy, whole tree visible from roots to top, generous transparent margin on every side. Eye-level view. Original background animation artwork, painterly organic soft rounded foliage clusters, not a cartoon icon, not a flat geometric vector or plastic 3D render. Native high detail, preferably 2048 by 2048 or higher. True alpha transparent background between branches and around silhouette; no sky, no ground rectangle, no labels, no watermark, no white matte. Single tree only.

Transparent background: true.

## ground-texture.png — exact generation prompt

Generate a seamless tileable ground texture for a high-resolution 3D Studio Ghibli-inspired anime meadow. Perfect orthographic overhead view, looking straight down at the ground, no horizon or perspective. Very dense soft short meadow grass, fine hand-painted gouache brush marks, tiny blades and delicate clover-like leaves, mostly muted sage green and warm moss green with golden-green highlights and cooler emerald shadow patches. Very subtle scattered tiny cream flower flecks, no large flowers or objects. Completely flat ambient diffuse lighting, no cast shadows, no bright sun spots. Small organic clustered patches and gently mottled watercolor pigment. The texture must read as a beautiful carpet of grass from close up. Do not draw isolated upright grass clumps, no soil patches, no trees, no mountains, no borders or text. Uniform edge-to-edge coverage and seamless repeating edges. Output the highest native resolution available, ideally 4096x4096, with extremely fine painted grass detail. This is an albedo texture, not a landscape illustration.

Transparent background: false. The runtime mixes two texture orientations/scales to reduce obvious repeating patterns.

