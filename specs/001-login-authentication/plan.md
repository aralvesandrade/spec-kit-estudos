# Implementation Plan: Login and Authentication Experience

**Branch**: `001-add-login-auth-sqlite` | **Date**: 2026-05-06 | **Spec**: `/specs/001-login-authentication/spec.md`
**Input**: Feature specification from `/specs/001-login-authentication/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement an app-scoped authentication flow in `apps/web` with a dedicated login screen, SQLite-backed credential validation, 30-minute inactivity session expiration, logout support, protected-route enforcement, audit logging of login attempts, and one seeded initial user for immediate usage in local environments.

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
**Performance Goals**: p90 login response <= 300 ms; failed-login response <= 400 ms; logout completion <= 100 ms; session validation on app load <= 150 ms
**Constraints**: Node ≥ 20; npm workspaces; package boundaries enforced by constitution
**Scale/Scope**: v1 single-role authentication with seeded initial user; expected low concurrency (1-10 active sessions); no self-registration, password reset, or external identity provider

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Pre-Phase 0 gate assessment (PASS):

- Boundary rule: PASS. Feature implementation remains in `apps/web` and does not require reverse dependency from `packages/ui`.
- Ownership rule: PASS. Auth pages, route guards, and app-level providers are app-specific and belong to `apps/web/src`.
- Naming rule: PASS. Planned files use kebab-case naming.
- Exports contract: PASS (not applicable). No new shared `packages/ui` export planned.
- Quality gates: PASS by plan. Implementation completion requires `turbo typecheck`, `turbo lint`, `turbo build`, and `turbo format`.

Post-Phase 1 design re-check (PASS):

- Data model and contracts introduce no boundary violations.
- Project structure and contracts stay app-scoped.
- No constitution waivers required.

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

**Structure Decision**: Option A (app-only feature). The requested authentication flow is specific to `apps/web`, and no reusable primitive with cross-app value was identified for `packages/ui` in this iteration.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | Not applicable | Not applicable |
