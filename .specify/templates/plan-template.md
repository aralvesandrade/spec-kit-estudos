# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x (strict)
**Frontend**: React 19, Vite 7, TailwindCSS 4, React Router DOM 7, TanStack Query 5, React Hook Form 7 + Zod
**UI Library**: `@workspace/ui` (shadcn/ui `radix-nova` style — Radix UI + CVA + Lucide)
**Backend**: Express 4, Node.js native SQLite (`node:sqlite` — requires Node ≥ 22), bcryptjs, uuid
**Testing**: Not installed — do NOT include test tasks unless Vitest is added as a dependency
**Target Platform**: Web browser (SPA) + REST API (BFF on port 3001, proxied via Vite `/api`)
**Project Type**: Monorepo — React SPA (`apps/web/src/`) + BFF Express (`apps/web/server/`) + shared UI lib (`packages/ui/`)
**Performance Goals**: NEEDS CLARIFICATION
**Constraints**: Node ≥ 20 (≥ 22 for native SQLite); npm workspaces; package boundaries enforced by constitution
**Scale/Scope**: NEEDS CLARIFICATION

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── [feature]-api-contract.md  # Required if feature adds REST endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Option A: Frontend-only feature (no new shared primitives, no backend changes)
apps/web/src/features/<feature>/   # kebab-case files, feature components + api + types
apps/web/src/components/           # app-level shared components if needed

# Option B: Shared UI primitive (new component/hook/utility for packages/ui)
packages/ui/src/
├── components/[component-name].tsx   # new shared component
├── hooks/[use-hook-name].ts          # new shared hook
└── lib/[util-name].ts                # new utility

# Option C: Full-stack feature (frontend + backend, no new shared primitives)
apps/web/src/features/<feature>/      # React components, API client, types
apps/web/server/<domain>/             # controller + service + repository + types + errors
apps/web/server/db/schema.sql         # updated if schema changes needed

# Option D: Full-stack + shared UI primitive (all layers)
packages/ui/src/components/           # step 1: add shared primitive to lib
apps/web/src/features/<feature>/      # step 2: consume in frontend
apps/web/server/<domain>/             # step 3: backend domain (layered)
```

**Structure Decision**: [Document selected option — A, B, C, or D — with rationale]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
