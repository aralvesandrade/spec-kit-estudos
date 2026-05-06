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
**Primary Dependencies**: React 19, Vite 7, TailwindCSS 4, Turborepo 2
**UI Library**: `@workspace/ui` (Radix UI + shadcn/ui + CVA)
**Testing**: Vitest (run: `vitest run`)
**Target Platform**: Web browser (SPA)
**Project Type**: Monorepo — React SPA (`apps/web`) + shared UI lib (`packages/ui`)
**Performance Goals**: NEEDS CLARIFICATION
**Constraints**: Node ≥ 20; npm workspaces; package boundaries enforced by constitution
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
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Option A: App-only feature (no new shared primitives)
apps/web/src/
├── components/        # app-specific React components (kebab-case files)
└── [feature-name]/    # optional: feature folder for complex features

# Option B: Shared UI primitive (new component/hook/utility for packages/ui)
packages/ui/src/
├── components/[component-name].tsx   # new shared component
├── hooks/[use-hook-name].ts          # new shared hook
└── lib/[util-name].ts                # new utility

# Option C: Both (new shared primitive consumed by the app)
packages/ui/src/components/[component-name].tsx   # step 1: add to lib
apps/web/src/components/[feature-component].tsx   # step 2: consume in app
```

**Structure Decision**: [Document selected option — A, B, or C — with rationale]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
