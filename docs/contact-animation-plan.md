# Contact animation storyboard — 31 October 2026

## Step 1: diagnosis
The prior mobile faded as one block near the end of the camera turn. Its note animation ran on component mount, before arrival. Selection remounted text without concealing the change.

## Step 2: entrance choreography
Keep the existing camera and journey timing. Give props a separate bounded reveal clock, driven toward scroll progress using the shared landscape clock (so Pause stops it). A fast jump still takes time to stage the entrance. Reverse travel withdraws the same props; no camera retiming.

1. Branch resolves into view while strings extend downward.
2. Envelope, notebook and ticket descend in staggered order. Each starts turned away and swings through a diminishing arc, with separate rotation and depth from the outer resting layout.
3. Crane sweeps across the mobile as the third object arrives.
4. The invitation rotates open from an almost edge-on fold. Its crease shadow recedes; ink and controls appear after the sheet opens.
5. Props settle fully. No endless wobble while reading.

## Step 3: selection
Use the existing paper replay state machine: close the current sheet, change content only when concealed, unfold the next one. Rapid input updates the pending destination; no overlapping timers. Keep draft state above the changing content. Selected props open their envelope flap/notebook cover/ticket corner using separate layers.

## Step 4: verification
Check sampled entrance frames, pause, fast arrival, reverse and re-entry, keyboard/rapid selection, draft retention, responsive bounds and reduced motion. Build the production preview after validation. Static/reduced-motion mode displays the settled composition immediately.
