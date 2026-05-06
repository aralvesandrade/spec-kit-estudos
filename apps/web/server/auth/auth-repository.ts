import { db } from "../db/client.ts"

export interface UserRow {
  id: string
  email: string
  password_hash: string
  status: string
  source: string
  created_at: string
  updated_at: string
}

export interface SessionRow {
  id: string
  user_id: string
  created_at: string
  last_activity_at: string
  expires_at: string
  status: string
}

export interface AuthAttemptRow {
  id: string
  attempted_email: string
  user_id: string | null
  outcome: string
  failure_reason: string | null
  attempted_at: string
}

export function findUserByEmail(email: string): UserRow | undefined {
  return db
    .prepare("SELECT * FROM users WHERE email = ? AND status = ?")
    .get(email, "active") as UserRow | undefined
}

export function findUserById(id: string): UserRow | undefined {
  return db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(id) as UserRow | undefined
}

export function findSessionById(id: string): SessionRow | undefined {
  return db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(id) as SessionRow | undefined
}

export function createSession(session: SessionRow): void {
  db.prepare(
    "INSERT INTO sessions (id, user_id, created_at, last_activity_at, expires_at, status) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    session.id,
    session.user_id,
    session.created_at,
    session.last_activity_at,
    session.expires_at,
    session.status
  )
}

export function updateSessionActivity(
  sessionId: string,
  lastActivityAt: string,
  expiresAt: string
): void {
  db.prepare(
    "UPDATE sessions SET last_activity_at = ?, expires_at = ? WHERE id = ?"
  ).run(lastActivityAt, expiresAt, sessionId)
}

export function revokeSession(sessionId: string): void {
  db.prepare("UPDATE sessions SET status = 'revoked' WHERE id = ?").run(
    sessionId
  )
}

export function expireSession(sessionId: string): void {
  db.prepare("UPDATE sessions SET status = 'expired' WHERE id = ?").run(
    sessionId
  )
}

export function recordAuthAttempt(attempt: AuthAttemptRow): void {
  db.prepare(
    "INSERT INTO auth_attempts (id, attempted_email, user_id, outcome, failure_reason, attempted_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    attempt.id,
    attempt.attempted_email,
    attempt.user_id ?? null,
    attempt.outcome,
    attempt.failure_reason ?? null,
    attempt.attempted_at
  )
}
