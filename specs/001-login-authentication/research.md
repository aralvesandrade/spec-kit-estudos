# Research: Login and Authentication Experience

## Decision 1: Keep implementation app-scoped in apps/web
- Decision: Implement the feature only in apps/web and avoid adding shared exports in packages/ui.
- Rationale: The login/auth flow is application-specific and does not currently provide proven cross-app reuse value.
- Alternatives considered: Move auth UI primitives to packages/ui; rejected to avoid premature shared API surface.

## Decision 2: Use SQLite-backed local persistence for credentials and auth records
- Decision: Use SQLite as the persistent local data store for user account, session, and auth attempt data.
- Rationale: The feature explicitly requires SQLite and local persistence without an external identity provider.
- Alternatives considered: In-memory-only auth store (rejected because it is non-persistent); external hosted database (rejected because out of scope).

## Decision 3: Email + password as the only login identifier in v1
- Decision: Authenticate using unique e-mail and password.
- Rationale: Clarified requirement; straightforward UX and consistent validation behavior.
- Alternatives considered: Username + password; email-or-username hybrid. Rejected to reduce ambiguity and complexity in v1.

## Decision 4: Session policy is inactivity-based expiration (30 minutes)
- Decision: Expire sessions after 30 minutes of inactivity.
- Rationale: Clarified requirement balances security and user continuity for a web app.
- Alternatives considered: 24-hour fixed expiry; no automatic expiry; 8-hour continuous session expiry. Rejected due to weaker security posture or less suitable UX.

## Decision 5: No automatic lockout for failed attempts in v1
- Decision: Allow unlimited failed attempts while recording each attempt for auditing.
- Rationale: Clarified requirement explicitly disables lockout in this version.
- Alternatives considered: Temporary lockout after N failures; CAPTCHA after repeated failures. Rejected due to explicit scope decision.

## Decision 6: Provision one initial account via seed data
- Decision: Create one active user through seed data.
- Rationale: Clarified requirement ensures immediate testability and operability without a registration flow.
- Alternatives considered: Manual DB insertion; file import. Rejected due to weaker repeatability for local setup.

## Decision 7: Define measurable non-functional targets for plan and validation
- Decision: Adopt explicit latency and scale targets for auth operations.
- Rationale: Resolves technical-context unknowns and supports objective acceptance in planning.
- Alternatives considered: Leave NFRs unspecified. Rejected because it weakens quality validation during implementation.

Selected targets:
- Login response p90 <= 300 ms
- Failed login response <= 400 ms
- Logout completion <= 100 ms
- Session validation on app load <= 150 ms
- Expected scale for v1: 1-10 concurrent sessions, single-role usage
