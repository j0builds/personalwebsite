# AGENTS.md

## Cursor Cloud specific instructions

This repo contains two separate frontend apps:

- Root (`/`): the primary personal website — Vite + React 18 + React Router. This is what deploys per `vercel.json`. Dev server: `npm run dev` (http://localhost:5173). Build: `npm run build`. Preview: `npm run preview`. There is no lint script for the root app.
- `next-app/`: a Next.js 16 (Turbopack) + React 19 + Tailwind v4 rewrite. Commands must be run from `next-app/`: `npm run dev` (http://localhost:3000), `npm run build`, `npm run lint`.

Notes / gotchas:
- Dependencies for the two apps are independent; run `npm install` in both `/` and `next-app/`.
- `next-app` has its own `package-lock.json`, so Next.js prints a "Detected additional lockfiles" warning during dev/build — this is harmless.
- `next-app` `npm run lint` currently reports pre-existing errors (unescaped entities in `src/components/about/BioSection.tsx` and an unused-var warning in `TextScramble.tsx`). These are existing code issues, not environment problems; `npm run build` still succeeds.
- Node 22 is used (works fine). The root `vite.config.js` has a duplicate `build` key which triggers a harmless esbuild warning.
