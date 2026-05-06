import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { db } from "./client.ts"

const SEED_EMAIL = "admin@example.com"
const SEED_PASSWORD = "Admin@123"

export async function seed(): Promise<void> {
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? AND source = 'seeded'")
    .get(SEED_EMAIL)

  if (existing) return

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10)
  const now = new Date().toISOString()

  db.prepare(
    "INSERT INTO users (id, email, password_hash, status, source, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(uuidv4(), SEED_EMAIL, passwordHash, "active", "seeded", now, now)

  console.log(
    `[seed] Usuário inicial criado: ${SEED_EMAIL} / ${SEED_PASSWORD}`
  )
}
