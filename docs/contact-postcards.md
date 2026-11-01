# Contact correspondence collection — 31 October 2026

The contact finale now presents a collection of three interactive postcards inside the existing hanging letterbox. Visitors choose A letter, The workshop (GitHub), or A connection (LinkedIn). Each card has an original vector platform illustration, perforated paper stamp, layered landscape, its own palette, short invitation, and a direct destination link. Paper rotation and depth accompany selection; stamp lift responds to hover. The address, copy control, and both profile links remain available regardless of selection.

The existing contact camera, projection, scroll intervals, hinged box, garden artwork, and reverse travel are unchanged. All content still uses profile.ts. The design retains ivory paper, forest ink, coral accents, physical shadows and the existing display typography. Artwork is inline SVG/CSS, with no added network requests or generated image assets.

Selection buttons expose pressed state, remain keyboard accessible, and announce card changes politely. The section remains inert during travel. Reduced motion disables card and ambient animations and retains all interactions. Copy feedback reports actual clipboard success or failure.

Validation: production build and all 32 existing motion tests passed. scripts/verify-contact.mjs passed forward/reverse desktop and phone travel, clipboard success/failure, navigation, short landscape layout and reduced motion. scripts/verify-postcards.mjs passed selection and destination checks for all three cards at 1440×900, 390×844, 390×667 and 844×390, including link clearance from the box. Desktop, phone and short-landscape captures were visually inspected in artifacts/review. Changes remain local.
