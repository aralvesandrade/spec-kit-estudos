import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { findUserByEmail, recordAuthAttempt } from "./auth-repository.ts"
import { createNewSession } from "./session-service.ts"
import { makeError } from "./auth-errors.ts"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function loginUser(rawEmail: string, rawPassword: string) {
  if (!rawEmail || !rawPassword) {
    return {
      authenticated: false as const,
      error: makeError("validation-error"),
    }
  }

  const email = normalizeEmail(rawEmail)

  if (!EMAIL_REGEX.test(email)) {
    recordAuthAttempt({
      id: uuidv4(),
      attempted_email: email,
      user_id: null,
      outcome: "failure",
      failure_reason: "validation-error",
      attempted_at: new Date().toISOString(),
    })
    return {
      authenticated: false as const,
      error: makeError("validation-error"),
    }
  }

  let user
  try {
    user = findUserByEmail(email)
  } catch {
    recordAuthAttempt({
      id: uuidv4(),
      attempted_email: email,
      user_id: null,
      outcome: "failure",
      failure_reason: "storage-unavailable",
      attempted_at: new Date().toISOString(),
    })
    return {
      authenticated: false as const,
      error: makeError("storage-unavailable"),
    }
  }

  if (!user) {
    recordAuthAttempt({
      id: uuidv4(),
      attempted_email: email,
      user_id: null,
      outcome: "failure",
      failure_reason: "invalid-credentials",
      attempted_at: new Date().toISOString(),
    })
    return {
      authenticated: false as const,
      error: makeError("invalid-credentials"),
    }
  }

  const passwordMatch = await bcrypt.compare(rawPassword, user.password_hash)
  if (!passwordMatch) {
    recordAuthAttempt({
      id: uuidv4(),
      attempted_email: email,
      user_id: user.id,
      outcome: "failure",
      failure_reason: "invalid-credentials",
      attempted_at: new Date().toISOString(),
    })
    return {
      authenticated: false as const,
      error: makeError("invalid-credentials"),
    }
  }

  const session = createNewSession(user.id)

  recordAuthAttempt({
    id: uuidv4(),
    attempted_email: email,
    user_id: user.id,
    outcome: "success",
    failure_reason: null,
    attempted_at: new Date().toISOString(),
  })

  return {
    authenticated: true as const,
    user: { id: user.id, email: user.email },
    session: {
      id: session.id,
      expiresAt: session.expires_at,
      lastActivityAt: session.last_activity_at,
    },
  }
}
