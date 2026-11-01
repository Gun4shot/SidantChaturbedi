# Sidant Chaturbedi — A Painted Journey

A scroll-driven portfolio through a painted landscape: introduction, apple/Newton journey, interactive project journal, honors grove, research library, community garden, and contact veranda.

**Start with [PROJECT_HANDBOOK.md](PROJECT_HANDBOOK.md)** for the complete guidelines, scene history, source map, current local versus deployed status, verification steps, and GitHub/Vercel publishing instructions.

- Live: https://sidant-chaturbedi.vercel.app/
- Repository: https://github.com/Gun4shot/SidantChaturbedi
- Hosting: Vercel, GitHub production branch `main`.
- Local edits do not update production automatically. Publish a reviewed batch when requested.

## Development

Node 24 matches the development environment (24.2.0 at the latest review).

```sh
npm ci
npm run dev
npm test
npm run build
```

Open the URL printed by Vite, normally http://127.0.0.1:5173/. `/?view=still` provides the ordinary-scrolling reduced-motion experience. The production build goes to `dist`; Vercel builds it from source.

## Editing

Personal content is in `src/profile.ts`, `src/projects.ts`, `src/publications.ts`, `src/research-source.json`, and `src/community.ts`. Preserve the 14-project curation, real project screenshots, research statuses, accessible links, and reversible camera transitions.

Original art is under `assets/source/`, runtime exports under `public/art/`, and provenance in `assets/manifest.json`. Detailed scene notes are in `docs/`; older plans may describe superseded designs. The handbook identifies active versions and rejected experiments.
