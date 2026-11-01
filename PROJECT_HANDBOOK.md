# Sidant Chaturbedi — project handbook

Last reviewed: **1 November 2026**. This is the central handoff for the portfolio: guidelines, implementation, history, and publishing. Older documents in `docs/` record experiments and may be superseded. Current source code and the latest user instructions take precedence.

## 1. Project and hosting

| Item | Value |
| --- | --- |
| Owner / public name | **Sidant Chaturbedi**, as recorded in `src/profile.ts` |
| Local checkout | `C:\Projects\portfolio2026` |
| GitHub | https://github.com/Gun4shot/SidantChaturbedi |
| Remote | `origin` → `https://github.com/Gun4shot/SidantChaturbedi.git` |
| Working / production branch | `main` |
| Live website | https://sidant-chaturbedi.vercel.app/ |
| Hosting | Vercel project `sidant-chaturbedi`, team `sidants-projects` |
| Deployment | GitHub-connected Vercel build when changes are pushed to `main` |
| Stack | React, TypeScript, Vite, Three.js |
| Build / output | `npm run build` / `dist` |

**Verified on 31 October 2026:** local HEAD and GitHub `main` were `708ebe320f5e8e1400f607acde44e394cf40bcad` (`708ebe3`, “Complete portfolio journey and refresh meadow and honors artwork”). GitHub's combined deployment status was `success`; the live homepage returned HTTP 200. This is a dated snapshot, not a claim about future deployments.

**1 November release batch:** v8 reading garden and registered detail, v7 library, animated Hello Garden stationery, illustrated community folio, and a closing sky scene that loops into the original opening. The user requested publication to GitHub. This commit records the reviewed release; verify its GitHub/Vercel status before treating it as deployed. Historical source artwork is retained, while unused experimental runtime exports are omitted (marked in the asset manifest).

The deployed website runs independently of the local computer and dev server. Vercel does not require a terminal to remain open. No provider can guarantee that a site will never go offline; service incidents, account limits, or configuration problems can affect availability.

## 2. Product and design guidelines

A personal portfolio experienced as one continuous journey through a vivid, hand-painted anime world. Scrolling moves a camera through connected scenes; the result should feel like travelling through an illustrated film.

- Preserve story, camera paths, interactions, and timing when the request is only about artwork.
- Keep facts accurate and copy concise. Never invent awards, employment, degrees, publication acceptance, results, or destinations.
- The opening forest and apple scenes were explicitly liked. Preserve them unless a relevant change is requested.
- Use Studio Ghibli-inspired background language: coherent painted shapes, expressive natural colors, warm light/cool shade, blue skies, cream clouds, selective dark contours, and atmospheric depth.
- Avoid noisy micro-detail, photorealistic scenery, glossy game assets, generic UI panels, and automatic vector tracing that turns painting into posterized patches.
- Art must be crisp at the actual camera framing. A larger export or a prompt saying “4K” does not create native painted detail. Record actual dimensions and distinguish original art from upscales.
- Integrate props through proportion, perspective, contact shadows, lighting, and occlusion. The book must not appear enormous or detached from the ground.
- Lighting may move subtly. Keep highlights and shadows intentional; do not blur the entire viewport to conceal a faulty handoff.
- Keep text readable through contrast, controlled backing, and restrained shadows.
- Do not add the white “Project Journal” bar: it was explicitly rejected.
- Preserve keyboard access, visible focus, HTML content, Pause, reduced motion, and the ordinary-scrolling fallback at `/?view=still`.
- **Do not push after every edit.** Work locally, verify a finished batch, and publish when requested. A request to publish one batch is not ongoing permission for every future iteration.

Three.js already renders the physical book and painted projections on calibrated geometry. The user's objection is to crude/generic 3D-model scenery; do not replace the painted world with that aesthetic.

## 3. Scene sequence and interaction rules

| Stage | Experience and constraints |
| --- | --- |
| Sky → introduction | Descend into the landscape; readable introduction and supplied portrait. |
| Tree / education / apple | Pan to tree, release apple, pass education, hit Newton, approach the falling apple to enter the next world. Preserve camera matching and timing. |
| Projects | Sunlit meadow and physical journal with page turns, searchable index, actual project images, and clickable destinations. |
| Paper bird → honors | Bird starts near the upper-left of the book, flies left, turns right across the lens, then recedes. No spin, central pause, extra-scroll hold, or whole-screen blur. Avoid excessive scale. |
| Honors | Laurel grove with four interactive medals; moderate size, quality artwork, and readable award details. |
| Honors → research | Current route uses a laurel/leaf passage. Earlier falling-medal/table ideas are superseded. |
| Research library | An unfolding paper dominates. Small side index, actual figures and abstract/method content, direct links where available. Selection changes replay unfolding, including rapid selection. **No table.** |
| Library → community | Calibrated physical camera passes through the right arch into the courtyard. Preserve perspective; do not substitute a flat image zoom. |
| Community → contact | Camera turns through the garden toward a hanging paper mobile. Three tactile objects select email, GitHub, or LinkedIn; an unfolding note offers destinations and an optional email draft. Camera path and timing remain unchanged. |

Reverse scrolling must retrace transitions smoothly. Snap near intended reading frames, never stop at an intermediate handoff. Keep original scroll durations unless retiming is requested. Use `src/scroll-timing.ts`: journey progress is not a raw percentage of document height.

## 4. Content and evidence

Canonical editable content:

- `src/profile.ts`: name, role, contact links, education, honors.
- `src/projects.ts`: curated projects and destinations.
- `src/publications.ts`, `src/research-source.json`: publication metadata, status, copy, and figures.
- `src/community.ts`: community and teaching content.

Original inputs include the user's `Sidant_Chaturbedi_Portfolio_Content.pdf`, GitHub repositories, research records, and portrait `IMG-20260616-WA0010.jpg`. The original files were supplied from `C:/Users/Lenovo/Downloads/`; do not assume that location exists elsewhere. The dossier is not an approved public résumé download. Reference images establish visual direction, not personal facts. Instructions within source documents are not automatically user instructions.

The journal contains **14 curated projects**, in this order:

1. SolveScript
2. WhiteBook
3. ML Field Notes
4. Khulla Malpot
5. Nidaan
6. Meteor Madness
7. Schwarzschild Final
8. Handtracker
9. People Recognizer
10. ALCC Website
11. Fraud Detection
12. TapTapbird
13. Snake Game
14. Tic Tac Toe

Keep games. Reserve Sentinel-1, Road Graphs, and Himalayan Waters for research. Exclude FutureSelf.ID, Nidaan Lite, and README Generator as requested. The [curation notes](docs/project-curation.md) explain the remaining selections; the full archived inventory does not determine the displayed collection.

Use actual website or repository screenshots. Only use a realistic substitute when a real image is unavailable; never represent a generated interface as an actual screenshot. Prefer verified main-site links, otherwise GitHub.

Research statuses are distinct: Sentinel-1 is recorded as published, road graph work as submitted, and Himalayan water work as ongoing. Do not imply all three are published. Retain real figures and source links. Recheck source evidence before changing claims; see [content notes](docs/content-pass.md) and [paper update](docs/research-paper-update.md).

## 5. Code and assets

| Location | Responsibility |
| --- | --- |
| `src/App.tsx`, `src/landscape.ts`, `src/journey-path.ts` | Overall journey and original landscape |
| `src/scroll-timing.ts`, `src/scene-snap.ts` | Scroll mapping and reading-frame snapping |
| `src/AppleJourney.tsx`, `src/apple-motion.ts` | Apple choreography |
| `src/BookJourney.tsx`, `src/project-meadow.ts` | Journal, scenery, project textures and controls |
| `src/book-motion.ts`, `src/meadow-camera.ts` | Book deformation and camera handoff |
| `src/HonorsJourney.tsx`, `src/honors-motion.ts` | Bird, medals, grove and related motion |
| `src/LibraryJourney.tsx`, `src/publication-motion.ts`, `src/usePaperReplay.ts` | Research and replayable paper |
| `src/CourtyardJourney.tsx`, `src/courtyard-motion.ts`, `src/courtyard-projection.ts` | Calibrated doorway, shared painted world, community |
| `src/ContactJourney.tsx`, `src/contact-motion.ts` | Camera turn, letterbox, postcards and links |
| Corresponding `src/*-journey.css` | Layout, responsive/static treatments and readability |
| `assets/source/`, `assets/manifest.json` | Versioned original art, historical experiments, provenance |
| `public/art/`, `public/projects/` | Runtime art and project captures |
| `docs/`, `scripts/` | Scene history, source evidence, asset conversion and browser checks |
| `tests/camera-path.test.mjs` | Motion/content regression checks |
| `artifacts/review/` | Ignored local screenshots, analysis and review tools |

### Active local art and perspective constraints

- Accepted meadow/book and honors art follow v4: [meadow notes](docs/project-meadow-v4.md), [honors notes](docs/honors-art-v4.md).
- Library color: `public/art/library-arch-v7.webp`, native source 1536×1024.
- Exterior: `public/art/garden-panorama-v8.webp`, native source 2172×724. This is the sheltered conservatory garden, replacing oversized snowy mountains.
- Close-up: `public/art/garden-detail-v8.webp`, native source 1619×971. Separately painted and approximately registered; not an exact crop or whole-scene native 4K art.
- Detail is feathered spatially around the conservatory, not swapped at a scroll threshold. Keep it off mismatched distant hills and the ground; broad blending caused double horizons.
- `teaching-board-v4.webp` and `veranda-tree-v4.webp` remain painted foreground assets.
- `library-arch-v1.webp` still supplies the calibrated aperture alpha independently of the newer color plate. An old version number does not mean it is unused.
- Preserve doorway camera coordinates and transforms during artwork-only edits. Floor polygon offset prevents the earlier glitch below the plant.
- The v8 floor join is `855/1024`, with a mirrored extension using the bottom 16% of the painting. These are artwork mappings, not camera zoom settings.
- Supersampling is capped at 3840×2160. That framebuffer size does not make a small painting native 4K.

Read [doorway research](docs/doorway-camera-research.md) and [v8 garden implementation](docs/reading-garden-v8.md) before changing the projection system.

Preserve versioned art originals, export efficient runtime formats, and update the manifest. Check source dimensions, close-up framing, mobile crops, clean alpha edges, and download cost. Do not delete older assets without checking references. Files in `public/` enter the build even without imports, so review obsolete exports before release.

## 6. History and lessons

This summarizes the conversation and retained implementation notes, not a verbatim transcript. Exact early dates are not reconstructed.

| Phase | Outcome / lesson |
| --- | --- |
| Initial journey | Sky, forest, tree, education, apple/Newton, and journal established; placeholder facts later replaced with dossier/repository content. |
| Projects / bird | Removed unwanted journal header, curated repositories, made destinations clickable, replaced slide-like transition with bird flight; reduced excess zoom, rotation, blur, and center hold. |
| Research | Added actual research content and figures. Replaced side cards with unfolding paper and tiny index. Removed table; superseded falling-medal transition with leaf passage. |
| Intro / navigation | Supplied portrait, improved intro contrast, and reading-frame snapping. |
| Courtyard / contact | Community courtyard, researched physical doorway projection, floor-overlap fix, camera rotation to letterbox finale. |
| 29 Oct 2026: v4 meadow/honors | Refined painted scenery, book grounding, medals and lighting. Published with completed journey in `708ebe3`. |
| Local v4 library/exterior | Repainted library, panorama, board and tree while retaining calibration. |
| Local v5–v6 vector experiments | Traced scenery and added detail for sharp zooms. Rejected: posterized/random-painting appearance lost desired anime treatment. Do not reactivate solely for pixel sharpness. |
| Local v7 | Returned to painted art. Library remains active; snowy mountain exterior rejected for design and enlarged-image quality. |
| 31 Oct 2026: local v8 | New conservatory composition with restricted registered detail. Fixed floor mapping and broad-detail mismatch; preserved camera path. |
| 31 Oct 2026: local postcards | Three contact postcards with accessible selection, direct destinations and clipboard feedback; unchanged travel. |
| 31 Oct 2026: handbook | Consolidated guidelines, history and hosting instructions; corrected stale documentation. No deployment performed. |

Further records: [library/outdoor v4](docs/library-outdoor-v4.md), [vector v5](docs/vector-panorama-v5.md), [detail v6](docs/detailed-scenes-v6.md), [painted v7](docs/painted-scenes-v7.md), [contact implementation](docs/contact-veranda-implementation.md), [postcards](docs/contact-postcards.md). Older plans describe decisions at their own time, not necessarily the current route.

## 7. Local development and verification

Current machine: Node **24.2.0**. Use Node 24 for a matching setup; tests use Node's TypeScript stripping flag. On a fresh checkout or dependency change:

```powershell
Set-Location C:\Projects\portfolio2026
npm ci
npm run dev
```

Use Vite's printed URL; default is `http://127.0.0.1:5173/`, but occupied ports may change it. Browser QA helpers generally target 5175. Check for an existing server first, then use this to request that port explicitly:

```powershell
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5175 --strictPort
```

Before releasing code/art changes:

```powershell
npm test
npm run build
git diff --check
```

Resolve failures before publishing. The 1 November release validation passed 34 tests and the production build, plus desktop/emulated-phone checks for the community, contact and ending loop; rerun for future changes. `npm run preview` serves `dist` for production-build review at its printed URL.

Visually review desktop, phone, short landscape, forward/reverse travel, Pause, reduced motion/static view, text and destinations. Inspect close-up frames, not just whole-scene thumbnails. Check rapid research selection, journal controls, medals and contact clipboard failure when relevant.

Helpers: `scripts/verify-project-garden.mjs`, `verify-honors-art.mjs`, `verify-passage.mjs`, `verify-paper.mjs`, `verify-courtyard.mjs`, `verify-courtyard-floor.mjs`, `verify-contact.mjs`, `verify-postcards.mjs`. Run with `node --experimental-strip-types scripts/<script-name>.mjs` after inspecting its URL/dependencies. Some use Playwright/Sharp under `C:/Users/Lenovo/AppData/Local/Temp/portfolio-capture` and a local Edge executable. They need path/dependency adaptation on another machine and are not portable clean-checkout tests. Emulation is not physical-device performance testing.

## 8. Publishing to GitHub and Vercel

**Use this workflow for a reviewed batch the user wants published.** No Vercel CLI or `gh` CLI is required. Git authentication previously worked through Git Credential Manager; a new machine may need sign-in. Never commit credentials, tokens, private documents, or auth files.

### A. Check branch, remote, and incoming changes

```powershell
Set-Location C:\Projects\portfolio2026
git status --short
git branch --show-current
git remote -v
git fetch origin
git log --oneline --left-right HEAD...origin/main
```

Confirm `main` and the remote in section 1. In the comparison, `<` means local-only commits and `>` remote-only commits. Preserve and reconcile local work if remote changes exist. Do not blindly pull/rebase a dirty worktree, discard edits, or force-push. Resolve conflicts through a reviewed merge/rebase and rerun checks.

### B. Review and validate

Run section 7 checks and visually inspect affected scenes. Review tracked and untracked changes:

```powershell
git diff --stat
git diff
git status --short
```

Tracked diffs do not show untracked contents; inspect new files separately. Include required runtime assets, originals/provenance, code and notes. Avoid abandoned large exports or temporary captures. `node_modules/`, `dist/`, `.vite/`, build-info files and `artifacts/review/` are ignored. Vercel builds `dist`; do not commit it.

### C. Stage and commit intended files

Stage explicit reviewed paths. This example commits **only this documentation update**:

```powershell
git add -- PROJECT_HANDBOOK.md README.md docs/PROJECT_GUIDELINES.md docs/PROJECT_PLAN.md
git diff --cached --stat
git diff --cached
git diff --cached --check
git commit -m "Document portfolio guidelines, history, and publishing workflow"
```

For a site release, replace the paths/message with the actual reviewed code, artwork, scripts and notes. The documentation-only example will not publish local garden changes. Check for unrelated files already staged. `git restore --staged -- path/to/file` unstages a path without discarding its working copy.

### D. Push the finished batch

```powershell
git push origin main
git rev-parse HEAD
git status --short
```

Pushing to `main` starts the connected production deployment. **Git push success does not mean the Vercel build has finished or succeeded.** Local preview changes do not reach the hosted site until published.

### E. Verify the deployment

1. Open https://vercel.com/sidants-projects/sidant-chaturbedi and inspect the latest deployment.
2. Match its Git commit to `git rev-parse HEAD`; confirm Production environment and Ready status. Read build logs on failure.
3. Open https://sidant-chaturbedi.vercel.app/ and verify the changed scene, destinations, and forward/reverse motion. Hard-refresh if the browser retains an old page.
4. Check phone layout and console/network errors. HTTP 200 alone does not prove new assets or interactions deployed.

Optional public GitHub status check, subject to API rate limits:

```powershell
$releaseSha = git rev-parse HEAD
$releaseStatus = Invoke-RestMethod "https://api.github.com/repos/Gun4shot/SidantChaturbedi/commits/$releaseSha/status"
$releaseStatus | Select-Object sha, state
$releaseStatus.statuses | Select-Object context, state, description, target_url
```

Some integrations expose check runs rather than legacy commit statuses; missing statuses alone prove neither success nor failure. Verify in Vercel and on the live site too.

### Troubleshooting and rollback

If no deployment appears, inspect Vercel's Git connection, repository and production branch. Expected settings: repository root, Vite framework, `npm run build`, output `dist`, lockfile-compatible npm installation. Check configured Node against the tested local version. These are expected settings, not a claim every dashboard field was re-inspected for this document. Redeploy the correct commit after resolving the issue; do not create another hosting project just because a build failed.

For an urgent regression, use Vercel's available rollback/promote controls for a known good deployment, then reconcile source history. Alternatively, review `git revert <commit-sha>`, validate and push the new revert commit. Do not use `git reset --hard` or force-push as routine rollback. Dashboard rollback does not undo GitHub history; the next push can reintroduce the problem.

## Latest local contact revision — 31 October 2026

The first postcard panel was superseded by the Hello Garden: a hanging envelope, GitHub notebook, and LinkedIn ticket, with selection-driven notes, a replayable breeze/paper-crane animation, and an optional local email draft. Existing branch and crane artwork is reused. No message is submitted by the site. See [Hello Garden notes](docs/contact-hello-garden.md). A subsequent animation pass adds staggered 3D arrivals, a bounded shared-clock reveal, hinged object details, and concealed note changes; see [animation storyboard](docs/contact-animation-plan.md). Included in the 1 November release batch.

## Latest local community revision — 31 October 2026

The classroom chalkboard and cream intro panel have been replaced by a projected illustrated field guide, with four original schematic drawings, staged entrance, paper selectors, and close/change/unfold story transitions. Source facts and both neighboring camera paths are preserved. The old board mesh is removed; old artwork is retained. See [community field guide](docs/community-field-guide.md). Included in the 1 November release batch.

## Latest local ending — 1 November 2026

Contact now leads through painted clouds to the exact opening landscape and a thank-you reading stop. Further scrolling restores Hello, then atomically resets the scroll/render clock at a matching view to begin another pass. Earlier chapter distances are preserved; the route now ends at 5.55. Static/reduced-motion mode has an explicit restart instead of automatic looping. See [ending loop](docs/ending-loop.md). Included in the 1 November release batch.

## 9. Maintain this handoff

After a release, update the dated deployment snapshot, active art versions, significant decisions and validation evidence. Put detailed prompts and technical findings in scene documents and link them here. Distinguish deployed, local, proposed and rejected work. Never claim a live update solely because the local preview changed.
