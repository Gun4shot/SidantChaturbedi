# Search discovery and botanical identity — 1 November 2026

## Implementation

`scripts/seo.mjs` is a Vite plugin. It builds metadata and readable HTML from `src/profile.ts`, `projects.ts`, `publications.ts` and `community.ts`. The homepage sends that HTML to every visitor before React replaces it with the painted journey. `/profile` retains the complete reading view without any JavaScript, and the opening scene links to it. This is progressive enhancement, with no user-agent checks, hidden keyword lists or different content for crawlers.

The sitemap lists only `/` and `/profile`, each with a self-referencing canonical. No hash-only scenes, query-string previews, inflated priorities or fabricated modification dates. `robots.txt` permits crawling and advertises the sitemap. Person, ProfilePage and WebSite data connect the existing name, portrait and public GitHub/LinkedIn profiles. Metadata includes title, description, Open Graph and Twitter cards. Vercel clean URLs serve the profile; a noindex 404 page is included. Google ownership verification is a public meta tag, not a credential; retain it after verification.

Validate after changing content: `npm run build`, `node scripts/verify-seo.mjs`, `npm test`. Verify production responses for the homepage, profile, sitemap, robots and icons, plus a nonexistent URL returning 404. Google Search Console verification and sitemap submission must be checked independently after deploying. Indexing and rankings are determined by Google; no first-place guarantee or fixed timeline is claimed.

## Logo

Built-in image generation produced the original botanical S mark. Source: `assets/source/sidant-botanical-logo-v1.png`. Optimized PNG derivatives in `public/brand/`: 512, 192, 180, 96 and 32 pixels. The 96px icon appears in the header, and the logo appears in the permanent reading view. The original generated image is preserved. No external logo or brand asset was copied.

Exact generation prompt:

> Create a single finished square logo icon for Sidant Chaturbedi's personal portfolio, an AI researcher/developer whose portfolio is a hand-painted illustrated garden journey. Logo-brand. A sophisticated very simple botanical monogram: ivory capital S shaped like a gentle winding river, a small sage-green leaf growing from its upper tip, enclosed in a deep forest-green softly rounded square. A tiny warm golden sun dot at upper right. Elegant balanced silhouette, bold broad strokes readable at favicon size 32 pixels, mostly flat color with only a subtle hand-painted edge. Symmetrical generous safe padding. Background solid deep forest green #243f35 filling full square. Ivory #fff5dd, sage #a9c18f, ochre #deb66d. No words, no additional letters besides the stylized S, no mockup, no drop shadow outside square, no gradients, no elaborate texture, no thin lines. One centered icon only, not a presentation sheet. Output square.

## Reference documentation

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Favicons](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [URL inspection and indexing requests](https://support.google.com/webmasters/answer/9012289)


## Production and Google verification — 2 November 2026

- Implementation commit `ec9ff13` was pushed to GitHub main and deployed successfully to Vercel on 1 November. Deployment: https://vercel.com/sidants-projects/sidant-chaturbedi/5fzD6gFDq5cktDNi1N2FxKiFUTVj .
- Ownership of the URL-prefix property `https://sidant-chaturbedi.vercel.app/` was verified with the HTML meta tag in the owner's existing Google account.
- Sitemap submission succeeded on 1 November. Rechecked on 2 November: status **Success**, **2 discovered pages**. Evidence retained locally in `artifacts/review/google-sitemap-success.png` (ignored, not public).
- URL inspection on 2 November reports **Discovered - currently not indexed** for both the homepage and `/profile`. Both are associated with the submitted sitemap. Discovery is not indexing.
- Manual indexing requests and the homepage live test returned generic Google errors. The profile request additionally reported that the browser could not connect to the reCAPTCHA service. A normal reload and bounded retry produced no success confirmation. No CAPTCHA was solved, no browser protections were disabled, and no successful manual request is claimed. Leave these requests pending for a later Search Console retry once verification connectivity works.
- Production HTTP checks on 2 November: homepage, profile, robots, sitemap all return 200; both pages have the intended canonical URLs, no noindex meta tag and no X-Robots-Tag restriction. The preceding release check also verified the favicon and a real 404 for a missing page.
- The site is ready for crawling; Google controls whether/when it indexes or ranks the pages. Do not promise first place or describe the pages as already indexed.
