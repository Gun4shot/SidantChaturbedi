# Journal polish - 23 October 2026

- Fixed the early image reveal: the turning mesh now retains clearance above the resting paper at every point of its curl. Front/back textures also match the destination when jumping through the project index.
- Left/right arrow keys work without clicking the canvas. A second press during a turn queues one turn; held keys are ignored. Editing in the search dialog keeps normal arrow-key behavior.
- Replaced the straight lift with a cubic arc, slight banking, delayed cover opening and camera clearance before the final reading pose. The path reverses with scroll.
- Neutral ivory paper, dark forest ink, larger secondary type, 2160 x 2400 page textures, no text mip blending, and 1.75-2x framebuffer rendering.
- Equal page proportions, no protruding spine, smaller traveling curl, dedicated control space and a restrained cream navigation backdrop.

## Verification

`npm test`: 16 passing tests. `npm run build`: successful.
Browser checks at 1280 x 720 and 390 x 844: automatic scroll opening, forward/back arrow input, queued arrow input, index search, input-field arrow behavior, jumps across the index, reading layout, scroll exit and return. Emulation does not establish physical phone frame rate.

Screenshots in `docs/screenshots/`: journal-v3-desktop.png, journal-v3-mobile.png, journal-v3-index.png, journal-v3-opening.png and journal-v3-turn.png.

Projects remain explicitly labeled sample concepts until actual project details are supplied.
