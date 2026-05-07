import type { Request, Response } from "express"
import { loginUser } from "./login-service.ts"
import {
  validateAndRefreshSession,
  revokeUserSession,
} from "./session-service.ts"
import { findUserById } from "./auth-repository.ts"
import { makeError } from "./auth-errors.ts"

const COOKIE_NAME = "auth_session"
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res
      .status(400)
      .json({ authenticated: false, error: makeError("validation-error") })
    return
  }

  try {
    const result = await loginUser(email, password)
    if (result.authenticated) {
      res.cookie(COOKIE_NAME, result.session.id, COOKIE_OPTIONS)
      res.json(result)
    } else {
      res.status(401).json(result)
    }
  } catch {
    res
      .status(503)
      .json({ authenticated: false, error: makeError("storage-unavailable") })
  }
}

export function handleMe(req: Request, res: Response): void {
  const sessionId = (req.cookies as Record<string, string>)[COOKIE_NAME]

  if (!sessionId) {
    res.json({ authenticated: false, error: makeError("session-invalid") })
    return
  }

  try {
    const session = validateAndRefreshSession(sessionId)
    if (!session) {
      res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS)
      res.json({ authenticated: false, error: makeError("session-expired") })
      return
    }

    const user = findUserById(session.user_id)
    if (!user) {
      res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS)
      res.json({ authenticated: false, error: makeError("session-invalid") })
      return
    }

    res.json({
      authenticated: true,
      user: { id: user.id, email: user.email },
      session: {
        id: session.id,
        expiresAt: session.expires_at,
        lastActivityAt: session.last_activity_at,
      },
    })
  } catch {
    res
      .status(503)
      .json({ authenticated: false, error: makeError("storage-unavailable") })
  }
}

export function handleLogout(req: Request, res: Response): void {
  const sessionId = (req.cookies as Record<string, string>)[COOKIE_NAME]

  if (sessionId) {
    try {
      revokeUserSession(sessionId)
    } catch {
      // best-effort: clear cookie anyway
    }
  }

  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS)
  res.json({ loggedOut: true })
}
