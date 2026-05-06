import { v4 as uuidv4 } from "uuid"
import {
  createSession,
  findSessionById,
  updateSessionActivity,
  revokeSession,
  expireSession,
} from "./auth-repository.ts"
import type { SessionRow } from "./auth-repository.ts"

const INACTIVITY_MINUTES = 30

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

export function createNewSession(userId: string): SessionRow {
  const now = new Date()
  const session: SessionRow = {
    id: uuidv4(),
    user_id: userId,
    created_at: now.toISOString(),
    last_activity_at: now.toISOString(),
    expires_at: addMinutes(now, INACTIVITY_MINUTES).toISOString(),
    status: "active",
  }
  createSession(session)
  return session
}

export function validateAndRefreshSession(sessionId: string): SessionRow | null {
  const session = findSessionById(sessionId)
  if (!session) return null
  if (session.status !== "active") return null

  const now = new Date()
  const expiresAt = new Date(session.expires_at)

  if (now > expiresAt) {
    expireSession(sessionId)
    return null
  }

  const newLastActivityAt = now.toISOString()
  const newExpiresAt = addMinutes(now, INACTIVITY_MINUTES).toISOString()
  updateSessionActivity(sessionId, newLastActivityAt, newExpiresAt)

  return {
    ...session,
    last_activity_at: newLastActivityAt,
    expires_at: newExpiresAt,
  }
}

export function revokeUserSession(sessionId: string): void {
  revokeSession(sessionId)
}
