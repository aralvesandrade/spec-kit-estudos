# Agent Boundaries — vite-monorepo

## Overview

This monorepo has two modules with distinct responsibilities. Agents must respect module ownership and the dependency direction enforced by the constitution: `apps/web` → `@workspace/ui`, never reversed.

---

## Agent: `ui-lib`

**Owns**: `packages/ui/`

**Responsibilities**:
- Shared React components (`packages/ui/src/components/`)
- Shared hooks (`packages/ui/src/hooks/`)
- Shared utilities (`packages/ui/src/lib/`)
- Global CSS (`packages/ui/src/styles/globals.css`)
- Package exports contract (`packages/ui/package.json#exports`)

**Can import from**:
- External npm packages (React, Radix UI, CVA, Tailwind, Zod, etc.)

**Cannot import from**:
- `apps/*`

**Build command**: `turbo build --filter=@workspace/ui`
**Type check**: `turbo typecheck --filter=@workspace/ui`
**Lint**: `turbo lint --filter=@workspace/ui`

**File naming convention**: kebab-case (e.g., `use-media-query.ts`, `dialog.tsx`)

---

## Agent: `web-app`

**Owns**: `apps/web/`

**Responsibilities**:
- React SPA entry point and routing
- App-specific pages and feature components (`apps/web/src/components/`)
- App-level configuration (`vite.config.ts`, `tsconfig.app.json`)

**Can import from**:
- `@workspace/ui` (via declared exports only)
- External npm packages

**Cannot import from**:
- Internal paths of `packages/ui` (e.g., `../../packages/ui/src/...`)
- Other `apps/*`

**Build command**: `turbo build --filter=web`
**Type check**: `turbo typecheck --filter=web`
**Lint**: `turbo lint --filter=web`
**Dev server**: `npm run dev` (root) or `turbo dev --filter=web`

**File naming convention**: kebab-case (e.g., `theme-provider.tsx`, `app.tsx`)

---

## Inter-Agent Communication

When a feature requires both agents:

1. `ui-lib` agent implements the shared primitive first
2. `ui-lib` agent adds the export to `packages/ui/package.json#exports`
3. `web-app` agent imports via the new export path
4. Both agents run their respective quality gates before the feature is considered done

## Root-Level Ownership

The following files are **not owned by either agent** and require explicit cross-agent coordination:

| File/Dir | Purpose |
|----------|---------|
| `package.json` | npm workspaces root — touch only for workspace-level deps |
| `turbo.json` | Task pipeline — touch only when adding new turbo tasks |
| `tsconfig.json` | Root TS config — touch only for path aliases or strict settings |
| `.prettierrc` | Formatting config — shared across all modules |
