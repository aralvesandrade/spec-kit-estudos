# Data Model: Login and Authentication Experience

## Entity: User Account
Description: Represents a person allowed to authenticate.

Fields:
- id: string (primary identifier)
- email: string (required, unique, normalized)
- passwordHash: string (required)
- status: enum (active, suspended, archived)
- source: enum (seeded, managed)
- createdAt: datetime
- updatedAt: datetime

Validation rules:
- email must be syntactically valid and stored in normalized format.
- passwordHash must exist for active accounts.
- exactly one seeded initial active account must exist after initial seed execution.

Relationships:
- one User Account can own many Authenticated Sessions.
- one User Account can be associated with many Authentication Attempts.

## Entity: Authenticated Session
Description: Represents active access state after successful login.

Fields:
- id: string (session identifier)
- userId: string (foreign key to User Account)
- createdAt: datetime
- lastActivityAt: datetime
- expiresAt: datetime (derived from inactivity policy)
- status: enum (active, expired, revoked)

Validation rules:
- session is valid only when status is active and inactivity window is less than or equal to 30 minutes.
- logout action transitions status to revoked.

State transitions:
- active -> expired (after 30 minutes inactivity)
- active -> revoked (explicit logout)
- expired/revoked -> active (new successful login creates a new session)

Relationships:
- many Authenticated Sessions belong to one User Account.

## Entity: Authentication Attempt
Description: Represents each login attempt for audit and troubleshooting.

Fields:
- id: string
- attemptedEmail: string
- userId: string (optional; present when account is matched)
- outcome: enum (success, failure)
- failureReason: enum (invalid-credentials, validation-error, storage-unavailable, none)
- attemptedAt: datetime

Validation rules:
- outcome is required for every attempt.
- failureReason is required when outcome is failure.
- attemptedAt must always be recorded.

Relationships:
- many Authentication Attempts may reference one User Account.
