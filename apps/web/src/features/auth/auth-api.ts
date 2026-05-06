import type { LoginResult, SessionResult, LogoutResult } from "./auth-types.ts"

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResult> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })
  return response.json() as Promise<LoginResult>
}

export async function getMeApi(): Promise<SessionResult> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  })
  return response.json() as Promise<SessionResult>
}

export async function logoutApi(): Promise<LogoutResult> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })
  return response.json() as Promise<LogoutResult>
}
