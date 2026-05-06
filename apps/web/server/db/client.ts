import { DatabaseSync } from "node:sqlite"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { readFileSync } from "node:fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DB_PATH = join(__dirname, "..", "..", "auth.db")
const SCHEMA_PATH = join(__dirname, "schema.sql")

const db = new DatabaseSync(DB_PATH)

const schema = readFileSync(SCHEMA_PATH, "utf-8")
db.exec(schema)

export { db }
