# Contract: Authentication Interface

## Purpose
Define the interaction contract between the web application authentication UI and the authentication service boundary.

## Commands and Queries

## Login
- Intent: authenticate a user with e-mail and password.
- Input:
  - email: string (required, normalized)
  - password: string (required)
- Success result:
  - authenticated: true
  - user: { id, email }
  - session: { id, expiresAt, lastActivityAt }
- Failure result:
  - authenticated: false
  - error: { code, message }

## Get Current Session
- Intent: resolve current auth state for route protection and app bootstrap.
- Input:
  - current session token/context
- Success result:
  - authenticated: true
  - user: { id, email }
  - session: { id, expiresAt, lastActivityAt }
- Failure result:
  - authenticated: false
  - error: { code: session-expired | session-invalid, message }

## Logout
- Intent: terminate current authenticated session.
- Input:
  - current session token/context
- Success result:
  - loggedOut: true
- Failure result:
  - loggedOut: false
  - error: { code, message }

## Error Taxonomy
- invalid-credentials: credentials do not authenticate
- validation-error: required input missing or malformed
- session-expired: inactivity exceeded 30 minutes
- session-invalid: session token/state not valid
- storage-unavailable: persistence layer unavailable
- internal-error: unexpected failure

## Behavioral Rules
- Login identifier is e-mail only.
- Session expires after 30 minutes of inactivity.
- Failed login attempts are not lock-limited in v1.
- Every login attempt outcome must be auditable.
- One seeded active account must be available after initial setup.
