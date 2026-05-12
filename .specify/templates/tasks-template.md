---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend feature**: `apps/web/src/features/<feature>/` (kebab-case files)
- **App-level component**: `apps/web/src/components/`
- **Shared UI primitive**: `packages/ui/src/components/`, `packages/ui/src/hooks/`, `packages/ui/src/lib/`
- **Backend domain**: `apps/web/server/<domain>/` (controller, service, repository, types, errors)
- **SQLite schema**: `apps/web/server/db/schema.sql`
- **Test files (when Vitest is installed)**: colocated next to source (`button.test.tsx` next to `button.tsx`)
- **Build verify**: `npm run build --filter=[web|@workspace/ui]`
- **Type check**: `npm run typecheck`
- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **Tests**: only include if Vitest is installed (`vitest run`)

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and structure for this feature

- [ ] T001 Identify target module(s) per plan.md (Option A / B / C / D)
- [ ] T002 [P] Run `npm install` if new dependencies added to any package.json
- [ ] T003 [P] Verify `npm run typecheck && npm run lint` pass on clean branch

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, exports, schema changes, and cross-cutting setup that user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [packages/ui only] Add new export path to `packages/ui/package.json#exports` if needed
- [ ] T005 [P] Define shared TypeScript types/interfaces in `packages/ui/src/lib/` or `apps/web/src/features/<feature>/`
- [ ] T006 [backend only] Update `apps/web/server/db/schema.sql` if new tables/columns needed
- [ ] T007 [backend only] Update `apps/web/server/db/seed.ts` if seed data needed for new entities
- [ ] T008 Verify `npm run build --filter=@workspace/ui` succeeds (if packages/ui changed)

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: Backend - [Domain] *(include only if feature touches `apps/web/server/`)*

**Purpose**: Express domain layer following the layered pattern (controller → service → repository)

- [ ] T009 [P] Create `apps/web/server/<domain>/<domain>-types.ts` — TypeScript types for the domain
- [ ] T010 [P] Create `apps/web/server/<domain>/<domain>-errors.ts` — domain error classes/constants
- [ ] T011 Create `apps/web/server/<domain>/<domain>-repository.ts` — SQLite queries using `db` from `server/db/client.ts`
- [ ] T012 Create `apps/web/server/<domain>/<domain>-service.ts` — business logic, imports repository
- [ ] T013 Create `apps/web/server/<domain>/<domain>-controller.ts` — Express handlers, imports service
- [ ] T014 Register new routes in `apps/web/server/index.ts` (`app.[method]("/api/[resource]", handler)`)
- [ ] T015 Verify `npm run typecheck --filter=web` passes

**Checkpoint**: Backend domain functional — can be tested via `curl` or API client

---

## Phase 4: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Implementation for User Story 1

- [ ] T016 [P] [US1] Create `packages/ui/src/components/[name].tsx` (kebab-case, PascalCase export) if shared primitive needed
- [ ] T017 [P] [US1] Create `packages/ui/src/hooks/use-[name].ts` if shared hook needed
- [ ] T018 [US1] Add export to `packages/ui/package.json#exports` for new files (if packages/ui changed)
- [ ] T019 [P] [US1] Create `apps/web/src/features/<feature>/<feature>-api.ts` — TanStack Query hooks + fetch calls to `/api/[resource]`
- [ ] T020 [US1] Create `apps/web/src/features/<feature>/[page-name]-page.tsx` — React page component
- [ ] T021 [US1] Register route in `apps/web/src/App.tsx` if new page
- [ ] T022 [US1] Run `npm run format` to apply Prettier + tailwindcss plugin
- [ ] T023 [US1] Verify `npm run typecheck && npm run lint && npm run build`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 5: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Implementation for User Story 2

- [ ] T024 [P] [US2] Create or extend component in `packages/ui/src/components/[name].tsx` or `apps/web/src/features/<feature>/`
- [ ] T025 [US2] Implement feature logic
- [ ] T026 [US2] Run `npm run format && npm run typecheck && npm run lint`
- [ ] T027 [US2] Integrate with User Story 1 components if needed

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 6: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Implementation for User Story 3

- [ ] T028 [P] [US3] Create or extend component in `packages/ui/src/components/[name].tsx` or `apps/web/src/features/<feature>/`
- [ ] T029 [US3] Implement feature logic
- [ ] T030 [US3] Run `npm run format && npm run typecheck && npm run lint`

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates and final validation

- [ ] TXXX [P] Run `npm run format` across all modified packages
- [ ] TXXX Run `npm run typecheck && npm run lint && npm run build` — all must pass
- [ ] TXXX Verify `@workspace/ui` exports match what `apps/web` imports (no broken imports)
- [ ] TXXX [backend] Verify all new endpoints return correct HTTP status codes and `{ error: string }` on failure
- [ ] TXXX Code cleanup and dead-code removal

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **Backend (Phase 3)**: Depends on Foundational completion - can run in parallel with frontend user stories if no data dependency
- **User Stories (Phase 4+)**: Depend on Foundational + Backend (if applicable) completion
  - User stories can proceed in parallel (if staffed) or sequentially by priority (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Within Each User Story

- `packages/ui` changes before `apps/web` consumption
- Backend domain before frontend API client
- API client before React page components
- Core implementation before route registration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Backend domain tasks (types, errors) marked [P] can run in parallel
- Once Foundational + Backend phases complete, all user stories can start in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: Backend (if full-stack feature)
4. Complete Phase 4: User Story 1
5. **STOP and VALIDATE**: Test User Story 1 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational + Backend → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies — can be done in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Do NOT reference `vitest run` unless Vitest is declared in package.json
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
