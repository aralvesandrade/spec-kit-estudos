# vite-monorepo Constitution

## Core Principles

### I. Monorepo Module Boundaries
Code belongs to exactly one module. `packages/ui` exports shared components, hooks, and utilities consumed by `apps/*`. Apps never export to other apps. Packages never import from apps. Dependency direction: `apps/web` → `@workspace/ui` only — never reversed.

### II. TypeScript Strict
All code is TypeScript. No `any` without explicit justification comment. `tsc --noEmit` must pass before merge. Shared types live in `packages/ui/src/lib/` or a dedicated `packages/types/` package — never duplicated across modules.

### III. Component Ownership
UI primitives (buttons, inputs, layout) live in `packages/ui/src/components/`. App-specific compositions (pages, feature components) live in `apps/web/src/components/` or `apps/web/src/features/<feature>/`. A component belongs in `packages/ui` only if it is reusable across more than one app.

### IV. Naming Conventions
- **Files/directories**: kebab-case (`theme-provider.tsx`, `use-toast.ts`, `auth-controller.ts`)
- **Components**: PascalCase exports (`export function Button`)
- **Hooks**: camelCase with `use` prefix (`useTheme`, `useMediaQuery`)
- **Utilities**: camelCase (`cn`, `formatDate`)
- **CSS**: TailwindCSS utility classes only — no custom CSS files except `packages/ui/src/styles/globals.css`
- **Feature directories**: kebab-case under `apps/web/src/features/<feature>/`

### V. Quality Gates (NON-NEGOTIABLE)
All of the following must pass before a feature is considered complete:
- `npm run typecheck` — zero TypeScript errors
- `npm run lint` — zero ESLint errors
- `npm run build` — successful build for all affected packages
- `npm run format` — Prettier formatting applied (enforced via `prettier-plugin-tailwindcss`)

### VI. Testing
There is **no test framework currently installed** in this project. Do not reference `vitest run` or any test runner in specs or tasks until Vitest is explicitly added as a dependency. When tests are added, they must colocate with source (`button.test.tsx` next to `button.tsx`) and use Vitest.

### VII. Package Exports Contract
`packages/ui` exports are defined in `package.json#exports`. Adding a new export path requires updating `exports` in `packages/ui/package.json`. Consumers import via the declared paths only (e.g., `@workspace/ui/components/button`, `@workspace/ui/lib/utils`) — never via relative paths into the package.

### VIII. Backend Architecture (BFF)
The backend lives exclusively in `apps/web/server/`. It is an Express REST API using Node.js native SQLite (`node:sqlite` — Node 22+). There is **no ORM** and **no automated migration system**. Schema is defined in `apps/web/server/db/schema.sql` and applied on startup. The backend follows a layered pattern:

```
server/<domain>/
  <domain>-controller.ts   ← Express route handlers (req/res)
  <domain>-service.ts      ← Business logic
  <domain>-repository.ts   ← SQLite queries
  <domain>-types.ts        ← TypeScript types for the domain
  <domain>-errors.ts       ← Domain-specific error classes/constants
```

New backend domains must follow this pattern. Controllers import services, services import repositories — never the other way.

### IX. API Contract
All REST endpoints follow the pattern `/api/<resource>` and are registered in `apps/web/server/index.ts`. The Vite dev server proxies `/api` to `http://localhost:3001`. Any new endpoint must be declared in the contract document (`specs/<feature>/contracts/<feature>-api-contract.md`).

### X. Commit Conventions
All commits must follow Conventional Commits format: `<type>(<scope>): <description>`. Valid types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`. Scope is optional but recommended for monorepo clarity (e.g., `feat(auth):`, `fix(customers):`).

## Dependency Rules

- **Allowed**: `apps/web` → `@workspace/ui`, external npm packages
- **Allowed**: `packages/ui` → external npm packages (React, Radix, Tailwind, CVA, etc.)
- **Forbidden**: `packages/ui` → `apps/*`
- **Forbidden**: `apps/web` → `apps/*`
- **Forbidden**: circular dependencies between packages
- **Forbidden**: importing from `packages/ui/src/` internal paths — use declared `#exports` only

## Development Workflow

- Run `npm run dev` (root) to start frontend (Vite :5173) + backend (Express :3001) in parallel via Turborepo
- New shared components: create in `packages/ui/src/components/` as kebab-case `.tsx` file, add export to `package.json#exports`
- New app components: create in `apps/web/src/components/` or `apps/web/src/features/<feature>/` — no export needed
- Use shadcn CLI (`npx shadcn add -c apps/web`) only targeting `packages/ui/` to add new primitives
- New backend domain: add directory `apps/web/server/<domain>/` following the layered pattern (VIII), register routes in `apps/web/server/index.ts`
- SQLite schema changes: edit `apps/web/server/db/schema.sql` and update seed in `apps/web/server/db/seed.ts`

## Governance

This constitution supersedes ad-hoc decisions. Amendments require updating this file with justification. All spec plans must include a Constitution Check section verifying compliance.

**Version**: 1.1.0 | **Ratified**: 2026-05-06 | **Last Amended**: 2026-05-12
