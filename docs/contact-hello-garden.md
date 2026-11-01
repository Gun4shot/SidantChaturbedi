# Hello Garden — 31 October 2026

Supersedes the first contact postcard panel. The finale is now an open-air hanging paper mobile: a wax-sealed envelope, a forest-green GitHub notebook, and a blue LinkedIn ticket. The selected object lifts visually and unfolds its corresponding note. Existing laurel-branch-v4.webp and paper-crane-v2.png artwork supplies painted decoration; platform marks and paper objects are HTML/CSS/SVG. No new raster assets or external requests were introduced.

The wooden letterbox and full-sheet tab panel have been removed from the contact composition. The camera path, projection, scroll timing, garden renderer and preceding scenes are unchanged. The mobile and note remain attached to the existing projected coordinate system. Scroll reveal remains reversible.

A visitor-triggered breeze replays a brief hinged paper swing and crane flight. It has no endless ambient animation. Email offers three subject starters and an optional 1,500-character note, retained in component memory across channel selection. The action encodes a mailto draft; it does not submit or store a message. The canonical address and direct profile links remain available beneath every selection, including truthful copy success/failure feedback.

Buttons have explicit accessible names and pressed states, standard keyboard activation, and visible focus. Text input has a visible label. All contact controls remain inert during travel. Reduced motion removes folding, flight, swing and hover transitions. Phone layouts use smaller paper objects and the same usable note; short landscape arranges objects vertically next to the note. Static mode allows ordinary scrolling through the full section.

Validation: all 32 motion tests, production build and git diff --check passed. Existing contact browser checks passed desktop/phone forward and reverse travel, clipboard success and failure, navigation, short-landscape link bounds and static mode. Updated verify-postcards.mjs checks all destinations, keyboard selection, encoded subject/body, retained draft, breeze activation and reduced-motion suppression at four sizes (1440x900, 390x844, 390x667, 844x390). Live desktop, phone and short-landscape screenshots were visually inspected. Browser emulation is not physical-device performance testing.

Changes remain local and unpublished.

## Implemented animation pass
The entrance now uses src/contact-reveal.ts. A bounded reveal follows the existing scroll target through the shared ambient clock; it takes approximately 1.65 seconds to traverse the full range and cannot skip on a fast jump. Pause holds that clock. The camera path and scroll distances remain unchanged. Reverse travel retracts the same staged poses, with the same bounded catch-up rather than an instantaneous prop reset.

Each object has separate projection/resting, arrival, and breeze layers. Independent arrival transforms supply vertical movement, depth, turn and damped swing. The note opens later with a perspective fold, clipped edge and receding crease shadow. Selection uses usePaperReplay: contents swap only when closed, rapid choices coalesce, and the contact sheet is inert until reopening finishes. That inert behavior is opt-in; the research section retains its prior default. Contact explicitly initializes its own paper-open variable so it cannot inherit the research sheet's closed state.

The selected envelope flap hinges back; the notebook spine and ticket corner turn independently. Static mode stays immediately readable. Reduced motion suppresses all added movement. The animated entrance does not depend on component-mount CSS animation.

Checks: 33 motion tests and production build passed. The animation browser script exercises desktop and phone arrival, shared-clock pause/resume, concealed/rapid selection, retained draft and reverse/re-entry. Pause is invoked programmatically for the clock integration check because the existing global control is outside the final scene viewport. The reduced-motion interaction checks cover four viewport sizes. Local stage captures are under artifacts/review/contact-entrance-*.

## Stationery refinement — 31 October 2026
Replaced the yellow board treatment with personal airmail stationery in contact-stationery.css: warm off-white paper, a fine coral/sage striped edge, botanical line drawing in the margin, circular postmark, inset rule, restrained sheet shadow and folded corner. Email starts with “Dear Sidant…”; subject options use ink underlines, the note has writing rules, and the primary action uses forest green. Existing content, draft behavior, fold/arrival animations and camera path are preserved. All decorative additions are CSS/inline SVG; no new raster assets or network requests.

Production build and four-size reduced-motion interaction checks passed. Live animation checks cover desktop and phone selection and entrance. Desktop stationery and compact layout captures were visually reviewed. Changes remain local and unpublished.
