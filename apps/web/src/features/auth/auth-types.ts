export type AuthErrorCode =
  | "invalid-credentials"
  | "validation-error"
  | "session-expired"
  | "session-invalid"
  | "storage-unavailable"
  | "internal-error"

export interface AuthError {
  code: AuthErrorCode
  message: string
}

export interface AuthUser {
  id: string
  email: string
}

export interface AuthSession {
  id: string
  expiresAt: string
  lastActivityAt: string
}

export type LoginResult =
  | { authenticated: true; user: AuthUser; session: AuthSession }
  | { authenticated: false; error: AuthError }

export type SessionResult =
  | { authenticated: true; user: AuthUser; session: AuthSession }
  | { authenticated: false; error: AuthError }

export type LogoutResult =
  | { loggedOut: true }
  | { loggedOut: false; error: AuthError }

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

export type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: AuthUser; session: AuthSession }
  | { status: "unauthenticated" }
