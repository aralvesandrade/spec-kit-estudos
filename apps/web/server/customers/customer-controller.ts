import type { Request, Response } from "express"
import { validateAndRefreshSession } from "../auth/session-service.ts"
import {
  validateCreateCustomerInput,
  listCustomersPaginated,
  createCustomer,
  getCustomer,
} from "./customer-service.ts"
import { makeCustomerError } from "./customer-errors.ts"
import type { CreateCustomerInput } from "./customer-types.ts"

const COOKIE_NAME = "auth_session"

function getAuthenticatedUserId(req: Request): string | null {
  const sessionId = (req.cookies as Record<string, string>)[COOKIE_NAME]
  if (!sessionId) return null
  const session = validateAndRefreshSession(sessionId)
  return session ? session.user_id : null
}

export function handleListCustomers(req: Request, res: Response): void {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    res.status(401).json({ error: makeCustomerError("unauthorized") })
    return
  }

  try {
    const rawPage = Number((req.query as Record<string, string>).page ?? "1")
    const rawLimit = Number((req.query as Record<string, string>).limit ?? "20")
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 20 : Math.min(rawLimit, 100)
    const { customers, total } = listCustomersPaginated(userId, page, limit)
    const totalPages = Math.ceil(total / limit)
    res.json({ customers, total, page, totalPages })
  } catch {
    res.status(500).json({ error: makeCustomerError("internal-error") })
  }
}

export function handleCreateCustomer(req: Request, res: Response): void {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    res.status(401).json({ error: makeCustomerError("unauthorized") })
    return
  }

  const input = req.body as CreateCustomerInput

  const validationErrors = validateCreateCustomerInput(input)
  if (validationErrors.length > 0) {
    res.status(400).json({
      error: {
        ...makeCustomerError("validation-error"),
        fields: validationErrors,
      },
    })
    return
  }

  try {
    const customer = createCustomer(userId, input)
    res.status(201).json({ customer })
  } catch (err: unknown) {
    const isDuplicateEmail =
      err instanceof Error && err.message.includes("UNIQUE constraint failed")
    if (isDuplicateEmail) {
      res.status(409).json({ error: makeCustomerError("duplicate-email") })
      return
    }
    res.status(500).json({ error: makeCustomerError("internal-error") })
  }
}

export function handleGetCustomer(req: Request, res: Response): void {
  const userId = getAuthenticatedUserId(req)
  if (!userId) {
    res.status(401).json({ error: makeCustomerError("unauthorized") })
    return
  }

  const { id } = req.params as { id: string }

  try {
    const customer = getCustomer(userId, id)
    if (!customer) {
      res.status(404).json({ error: makeCustomerError("not-found") })
      return
    }
    res.json({ customer })
  } catch {
    res.status(500).json({ error: makeCustomerError("internal-error") })
  }
}
