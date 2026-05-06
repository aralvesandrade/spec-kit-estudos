# Tasks: Login and Authentication Experience

**Input**: Design documents from `/specs/001-login-authentication/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No explicit TDD or mandatory automated test request was specified in the feature specification, so this task list focuses on implementation and independent functional validation per story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and feature scaffold for app + auth service

- [X] T001 Create auth feature directory scaffold in `apps/web/src/features/auth/.gitkeep`
- [X] T002 Create server auth scaffold in `apps/web/server/auth/.gitkeep`
- [X] T003 [P] Add auth/server dependencies in `apps/web/package.json`
- [X] T004 [P] Configure `/api` proxy and dev integration in `apps/web/vite.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared auth foundation required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create SQLite schema for users/sessions/auth attempts in `apps/web/server/db/schema.sql`
- [X] T006 Implement SQLite client in `apps/web/server/db/client.ts` — creates the database file on disk and runs schema migrations from `schema.sql` on server startup
- [X] T007 [P] Implement auth persistence repository in `apps/web/server/auth/auth-repository.ts`
- [X] T008 Define auth contract types and error codes in `apps/web/src/features/auth/auth-types.ts`
- [X] T009 Implement auth API client boundary in `apps/web/src/features/auth/auth-api.ts`
- [X] T010 Implement base auth context/provider and bootstrap session check in `apps/web/src/features/auth/auth-provider.tsx`
- [X] T011 Wire auth HTTP routes (`/api/auth/login`, `/api/auth/me`, `/api/auth/logout`) in `apps/web/server/index.ts`

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Authenticate with valid credentials (Priority: P1) 🎯 MVP

**Goal**: User logs in with valid e-mail/password and reaches protected area with active session continuity.

**Independent Test**: Seeded user can authenticate in login screen, gets redirected to protected area, and remains authenticated after app refresh.

### Implementation for User Story 1

- [X] T012 [US1] Create seeded initial account flow in `apps/web/server/db/seed.ts`
- [X] T013 [US1] Implement login success flow and credential verification in `apps/web/server/auth/login-service.ts`
- [X] T014 [P] [US1] Implement session creation and activity refresh behavior in `apps/web/server/auth/session-service.ts`
- [X] T015 [P] [US1] Build login page UI with e-mail/password submission in `apps/web/src/features/auth/login-page.tsx`
- [X] T016 [US1] Add protected route wrapper for authenticated content in `apps/web/src/features/auth/protected-route.tsx`
- [X] T017 [US1] Integrate login route, protected route, and success redirect in `apps/web/src/App.tsx`
- [X] T018 [US1] Initialize auth provider at app entrypoint in `apps/web/src/main.tsx`

**Checkpoint**: User Story 1 is independently functional and demo-ready (MVP)

---

## Phase 4: User Story 2 - Handle invalid authentication attempts (Priority: P2)

**Goal**: Invalid submissions are safely denied with clear and actionable feedback while attempts are audited.

**Independent Test**: Invalid credentials and empty fields are rejected with correct messages, and failed attempts are persisted for auditing.

### Implementation for User Story 2

- [X] T019 [US2] Enforce e-mail normalization and required-field validation in `apps/web/server/auth/login-service.ts`
- [X] T020 [US2] Implement auth error taxonomy mapping in `apps/web/server/auth/auth-errors.ts`
- [X] T021 [US2] Persist authentication attempt outcomes in `apps/web/server/auth/auth-repository.ts`
- [X] T022 [P] [US2] Render validation and invalid-credential feedback states in `apps/web/src/features/auth/login-page.tsx`
- [X] T023 [US2] Return storage-unavailable fallback response in `apps/web/server/auth/auth-controller.ts`
- [X] T024 [US2] Show retry guidance for storage-unavailable errors in `apps/web/src/features/auth/login-page.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently with robust error handling

---

## Phase 5: User Story 3 - End session securely (Priority: P3)

**Goal**: Authenticated user can logout and session expires after 30 minutes of inactivity.

**Independent Test**: User can logout explicitly and is forced to re-authenticate after inactivity-based expiration.

### Implementation for User Story 3

- [X] T025 [US3] Implement explicit logout and session revocation in `apps/web/server/auth/session-service.ts`
- [X] T026 [US3] Enforce 30-minute inactivity expiration in session validation in `apps/web/server/auth/session-service.ts`
- [X] T027 [US3] Return session-expired/session-invalid semantics in `apps/web/server/auth/auth-controller.ts`
- [X] T028 [P] [US3] Add logout action in authenticated shell UI in `apps/web/src/features/auth/app-shell.tsx`
- [X] T029 [US3] Handle expired/invalid session transitions in `apps/web/src/features/auth/auth-provider.tsx`
- [X] T030 [US3] Redirect already-authenticated users away from login route in `apps/web/src/App.tsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality gates and delivery hardening

- [X] T031 [P] Document local auth setup and seeded credentials usage in `specs/001-login-authentication/quickstart.md`
- [X] T032 [P] Run formatting and normalize auth imports/exports in `apps/web/src/features/auth/index.ts`
- [X] T033 Record quality gate results (`turbo typecheck && turbo lint && turbo build`) in `specs/001-login-authentication/checklists/implementation-checklist.md`
- [X] T034 Verify final auth route/proxy behavior for dev and build modes in `apps/web/vite.config.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on selected user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational; depends functionally on US1 login path to validate error behavior in same flow
- **User Story 3 (P3)**: Starts after Foundational; depends on US1 session lifecycle baseline

### Dependency Graph

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- Parallel branch availability after Phase 2: US1, US2, and US3 can be staffed in parallel, but recommended delivery order remains P1 -> P2 -> P3

### Within Each User Story

- Backend service behavior before UI integration
- Contract/error semantics before final UI messaging
- Story-level checkpoint validation before proceeding to next priority

### Parallel Opportunities

- Setup tasks `T003` and `T004` can run in parallel
- Foundational tasks `T006`, `T007`, `T008`, and `T009` can run in parallel after `T005`
- In US1, tasks `T014` and `T015` can run in parallel after `T013`
- In US2, task `T022` can run in parallel with `T023` after `T020`
- In US3, task `T028` can run in parallel with `T027` after `T026`
- In Polish, tasks `T031` and `T032` can run in parallel

---

## Parallel Example: User Story 1

```bash
# Parallelizable US1 tasks after login service baseline exists:
Task T014: Implement session creation and activity refresh behavior in apps/web/server/auth/session-service.ts
Task T015: Build login page UI with e-mail/password submission in apps/web/src/features/auth/login-page.tsx
```

## Parallel Example: User Story 2

```bash
# Parallelizable US2 tasks after error taxonomy exists:
Task T022: Render validation and invalid-credential feedback states in apps/web/src/features/auth/login-page.tsx
Task T023: Return storage-unavailable fallback response in apps/web/server/auth/auth-controller.ts
```

## Parallel Example: User Story 3

```bash
# Parallelizable US3 tasks after session expiration logic is implemented:
Task T027: Return session-expired/session-invalid semantics in apps/web/server/auth/auth-controller.ts
Task T028: Add logout action in authenticated shell UI in apps/web/src/features/auth/app-shell.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational)
3. Complete Phase 3 (US1)
4. Validate US1 independently against its checkpoint
5. Demo/deploy MVP

### Incremental Delivery

1. Deliver US1 for core authenticated access
2. Deliver US2 for safe failure handling and auditability
3. Deliver US3 for session termination and expiration controls
4. Finish with Phase 6 quality and release hardening

### Parallel Team Strategy

1. Team aligns on Setup + Foundational together
2. After foundational checkpoint:
   - Engineer A owns US1 flow completion
   - Engineer B owns US2 error-handling and auditing
   - Engineer C owns US3 session lifecycle and logout
3. Merge by story checkpoint, then execute final quality gates

---

## Notes

- All tasks use strict checklist format: checkbox + ID + optional [P] + optional [USx] + action with file path
- Story labels are only used in user story phases
- Task IDs are sequential in expected execution order
- Commands are captured in tasks where validation evidence is required
