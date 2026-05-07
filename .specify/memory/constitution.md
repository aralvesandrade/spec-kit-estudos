# vite-monorepo Constitution

## Core Principles

### I. Monorepo Module Boundaries
Code belongs to exactly one module. `packages/ui` exports shared components, hooks, and utilities consumed by `apps/*`. Apps never export to other apps. Packages never import from apps. Dependency direction: `apps/web` → `@workspace/ui` only — never reversed.

### II. TypeScript Strict
All code is TypeScript. No `any` without explicit justification comment. `tsc --noEmit` must pass before merge. Shared types live in `packages/ui/src/lib/` or a dedicated `packages/types/` package — never duplicated across modules.

### III. Component Ownership
UI primitives (buttons, inputs, layout) live in `packages/ui/src/components/`. App-specific compositions (pages, feature components) live in `apps/web/src/components/`. A component belongs in `packages/ui` only if it is reusable across more than one app.

### IV. Naming Conventions
- **Files/directories**: kebab-case (`theme-provider.tsx`, `use-toast.ts`)
- **Components**: PascalCase exports (`export function Button`)
- **Hooks**: camelCase with `use` prefix (`useTheme`, `useMediaQuery`)
- **Utilities**: camelCase (`cn`, `formatDate`)
- **CSS**: TailwindCSS utility classes only — no custom CSS files except `packages/ui/src/styles/globals.css`

### V. Quality Gates (NON-NEGOTIABLE)
All of the following must pass before a feature is considered complete:
- `npm run typecheck` — zero TypeScript errors
- `npm run lint` — zero ESLint errors
- `npm run build` — successful build for all affected packages
- `npm run format` — Prettier formatting applied (enforced via `prettier-plugin-tailwindcss`)

### VI. Testing
Vitest is the standard test framework for this project. Test files colocate with source: `button.test.tsx` next to `button.tsx`. Run with `vitest run`. Tests are not currently required for all code but must be added for any new shared utility in `packages/ui/src/lib/`.

### VII. Package Exports Contract
`packages/ui` exports are defined in `package.json#exports`. Adding a new export path requires updating `exports` in `packages/ui/package.json`. Consumers import via the declared paths only (e.g., `@workspace/ui/components/button`, `@workspace/ui/lib/utils`) — never via relative paths into the package.

## Dependency Rules

- **Allowed**: `apps/web` → `@workspace/ui`, external npm packages
- **Allowed**: `packages/ui` → external npm packages (React, Radix, Tailwind, CVA, etc.)
- **Forbidden**: `packages/ui` → `apps/*`
- **Forbidden**: `apps/web` → `apps/*`
- **Forbidden**: circular dependencies between packages

## Development Workflow

- Run `npm run dev` (root) to start all apps via Turborepo in parallel
- New shared components: create in `packages/ui/src/components/` as kebab-case `.tsx` file, add export to `package.json#exports`
- New app components: create in `apps/web/src/components/` — no export needed
- Use shadcn CLI (`npx shadcn add`) only within `packages/ui/` to add new primitives

## Governance

This constitution supersedes ad-hoc decisions. Amendments require updating this file with justification. All spec plans must include a Constitution Check section verifying compliance.

**Version**: 1.0.0 | **Ratified**: 2026-05-06 | **Last Amended**: 2026-05-06
