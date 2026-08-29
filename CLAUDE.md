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
- Auth state is held in `useAuthStore` (zustand + `persist` middleware, key `auth-store`): `token`, `refreshToken` and the signed-in `user`.
- **Sign-in is admin-only.** `src/modules/auth` posts email + password to `POST /auth/admin/login`; the backend rejects anything that is not an `ADMIN` account. The stored token alone does *not* open a route — `Protected` (in `app/router/router.tsx`) calls `useAdminSession`, which re-checks the token against `GET /auth/admin/me`. That endpoint is role-gated, so a patient's mobile token gets 403 and is bounced to `/sign-in`. Never gate a route on `token` presence alone.
- `axiosInstance` has a response interceptor that clears the session on any 401/403 (except the login call itself), so a dead token is never left in storage.
- There is no sign-up screen and there must not be one — the single admin account is provisioned on the backend with `npm run db:create-admin`.
- Forms use `formik` + `yup`. See `src/screens/sign-in/ui/sign-in-screen.tsx` for the canonical pattern.

### Check-ups module

`src/modules/checkups` is the catalogue editor for the mobile app's check-up tab. It is the
first module with write access, so it sets the pattern: one `useQuery` for the listing plus
`useMutation` hooks that all invalidate the same `['checkups']` key, so the table never shows
a row the server has already changed.

- The listing reads `GET /checkups/admin`, which — unlike the app-facing `GET /checkups` —
  also returns unpublished entries. Every write endpoint (`POST /checkups/admin`,
  `PATCH /checkups/admin/:id`, `DELETE /checkups/admin/:id`) is role-gated to `ADMIN` on the
  backend and audited there.
- Publishing is a `isActive` flag, not a delete: the row switch flips it with a `PATCH`, and
  the delete modal says so, because an unpublished check-up keeps working for anything that
  already links to it while a deleted one does not.
- `code` is a slug the backend enforces as unique — a collision comes back as `409`
  `CHECKUP_CODE_TAKEN`. `resolveCheckupErrorMessage` (in `data.ts`) turns that, and
  express-validator's `errors` array, into the message shown in the form.
- Services are edited as free text, one per line; `parseServices` also splits on `;` so a
  cell from the clinic's price list can be pasted in as-is.

### Paid-programs orders module

`src/modules/program-orders` is the operator queue for what patients buy on the mobile
app's paid-programs screen. Unlike the check-ups module it is not a catalogue editor: an
order is created by the backend when a payment settles, so the dashboard can move it
along but never create or delete one.

- The listing reads `GET /program-orders/admin` — paginated and filtered server-side
  (status, category, date range, and a search that matches patient name / IIN / phone or
  a program title inside the order). `totalAmount` covers the whole filtered set, not the
  visible page, which is what the summary tiles show.
- The "Ждут обработки" tile is a *separate* query pinned to `status=NEW` with `limit=1`,
  read only for its `total`: it is the queue an operator works down, so narrowing the
  table must not change it.
- `PATCH /program-orders/admin/:id` is the only write, and only `status` and `comment`
  go through it — amounts and the programs in an order belong to the payment behind it
  and are immutable by design. The mutation invalidates the whole `['program-orders']`
  key so the table and the counter both follow.
- The details drawer's editor is mounted under `key={order.id}` so its local state is
  rebuilt per order — otherwise a half-typed note would follow the admin to the next row.

### Appointments module

`src/modules/appointments` is the clinic-wide list of visits patients booked in the
mobile app. It is read-only: the appointment itself lives in MIS, so the dashboard shows
what was booked and the ids needed to find it there, and never mutates it — there is no
mutation hook in this module by design.

- The listing reads `GET /appointments/admin` — paginated and filtered server-side
  (status, telemedicine flag, day range, and a search that matches patient name / IIN /
  phone, or a MIS appointment / patient / doctor id pasted in whole).
- `doctorName`, `doctorSpecialty` and `doctorBranch` are resolved from MIS per request and
  come back `null` when MIS is down, so every render falls back to `doctorId`.
- The patient columns describe the **account** that booked the visit. A visit booked for a
  relative carries `isForFamilyMember`, shown as a badge — the name on the row is the
  account owner's, not the person being seen.
- The two right-hand tiles ("Сегодня", "Предстоящие") are separate queries with
  `limit=1`, read only for their `total`: they answer what the clinic has on today, so
  narrowing the table must not change them.
- Day filters are sent as `YYYY-MM-DD` and the backend reads them as clinic days
  (Asia/Almaty), which is why an evening slot stays inside a range that ends on its date.

## Conventions

- **Path alias**: `@/` resolves to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`). Prefer `@/modules/foo` over deep relative paths.
- **File naming**: kebab-case for files and folders (`metrics-chart.tsx`, `use-metrics.ts`, `sign-in-screen.tsx`).
- **Dates**: use `dayjs` — already a dependency.
- **UI is Mantine** (`@mantine/core`, `@mantine/hooks`, `@tabler/icons-react`), wired in `app/providers`. Build screens from Mantine primitives and its `theme` (`shared/lib/theme.ts`) rather than hand-rolled CSS; inline `style={{}}` is for one-off layout touches only.
- **TypeScript** is strict-ish: `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax` are on. Use `import type` for type-only imports.
