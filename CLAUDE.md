# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then produce a production bundle in `dist/`
- `npm run lint` — run ESLint over the repo
- `npm run preview` — serve the built bundle locally

There is no test runner configured yet.

## Purpose

This is an **analytics / admin dashboard** for a separate mobile application. It reads from an existing backend; this codebase is the web frontend only. Data visualization (charts, diagrams, tables) is a primary concern, so `recharts` and `@tanstack/react-table` are first-class dependencies.

## Architecture

The codebase follows a **modular layered architecture** with strict directional dependencies. Layers import only downward:

```
screens → modules → shared / api
```

- **`src/api/`** — `axiosInstance` (base URL from `VITE_API_BASE_URL`) with a request interceptor that injects `Bearer <token>` from `localStorage`. All HTTP calls go through this instance.
- **`src/app/`** — composition root only. `providers/` wires `QueryClientProvider` + `BrowserRouter`; `router/` declares routes and the `Protected` wrapper that gates routes on the zustand auth store. `main.tsx` mounts `<App />` from here.
- **`src/modules/<feature>/`** — self-contained feature units. Each module follows this convention (not every folder is required, but the names are fixed when present):
  - `components/` — feature-internal React components
  - `hooks/` — react-query hooks and other feature hooks
  - `forms/` — formik form definitions + yup schemas
  - `context/` — feature-scoped React contexts
  - `data.ts` — static/mock data and constants
  - `types.ts` — feature types
  - `index.tsx` — the module's public entry component (what screens import)
- **`src/screens/<screen>/`** — route-level views. Convention: a `ui/<screen-name>-screen.tsx` file plus an `index.ts` barrel that re-exports it. Screens compose modules; they should stay thin.
- **`src/shared/`** — cross-feature primitives: `config/env.ts` (typed env access), `lib/` (`queryClient`, `useAuthStore`), plus `ui/`, `hooks/`, `types/` for shared building blocks.

### Why this matters

- A screen pulls a module's public surface via its `index.*` barrel — do **not** reach into a module's `components/` or `hooks/` from outside the module.
- Modules must not import from `screens/` or from sibling modules. If two modules need to share something, lift it into `shared/`.
- New features → add a module under `src/modules/`, expose a single component from its `index.tsx`, then mount it from a screen.

### Data & auth flow

- All server state goes through `@tanstack/react-query`. The shared client is at `src/shared/lib/query-client.ts` (60s `staleTime`, `refetchOnWindowFocus: false`, `retry: 1`).
- All HTTP requests use `axiosInstance` from `src/api/`. Don't import `axios` directly — go through the instance so the auth interceptor applies.
- Auth state is held in `useAuthStore` (zustand + `persist` middleware, key `auth-store`). Setting `token` here is what flips `Protected` routes from redirecting to rendering.
- Forms use `formik` + `yup`. See `src/screens/sign-in/ui/sign-in-screen.tsx` for the canonical pattern.

## Conventions

- **Path alias**: `@/` resolves to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`). Prefer `@/modules/foo` over deep relative paths.
- **File naming**: kebab-case for files and folders (`metrics-chart.tsx`, `use-metrics.ts`, `sign-in-screen.tsx`).
- **Dates**: use `dayjs` — already a dependency.
- **No UI/styling library is installed.** Existing components use inline `style={{}}` props as placeholders. When adding one (Tailwind, MUI, etc.), do it explicitly rather than reaching for arbitrary CSS.
- **TypeScript** is strict-ish: `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax` are on. Use `import type` for type-only imports.
