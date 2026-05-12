import { db } from "../db/client.ts"
import type { Customer } from "./customer-types.ts"

interface CustomerRow {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  created_at: string
}

function rowToCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
  }
}

export function findCustomersByUserId(userId: string): Customer[] {
  const rows = db
    .prepare(
      "SELECT * FROM customers WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(userId) as unknown as CustomerRow[]
  return rows.map(rowToCustomer)
}

export function findCustomersByUserIdPaginated(
  userId: string,
  page: number,
  limit: number
): { customers: Customer[]; total: number } {
  const offset = (page - 1) * limit
  const total = (
    db
      .prepare("SELECT COUNT(*) as count FROM customers WHERE user_id = ?")
      .get(userId) as { count: number }
  ).count
  const rows = db
    .prepare(
      "SELECT * FROM customers WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
    )
    .all(userId, limit, offset) as unknown as CustomerRow[]
  return { customers: rows.map(rowToCustomer), total }
}

export function findCustomerById(
  id: string,
  userId: string
): Customer | undefined {
  const row = db
    .prepare("SELECT * FROM customers WHERE id = ? AND user_id = ?")
    .get(id, userId) as CustomerRow | undefined
  return row ? rowToCustomer(row) : undefined
}

export function createCustomer(customer: Customer): Customer {
  db.prepare(
    "INSERT INTO customers (id, user_id, name, email, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    customer.id,
    customer.userId,
    customer.name,
    customer.email,
    customer.phone,
    customer.createdAt
  )
  return customer
}
