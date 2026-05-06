import express from "express"
import cookieParser from "cookie-parser"
import { seed } from "./db/seed.ts"
import {
  handleLogin,
  handleMe,
  handleLogout,
} from "./auth/auth-controller.ts"

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cookieParser())

app.post("/api/auth/login", handleLogin)
app.get("/api/auth/me", handleMe)
app.post("/api/auth/logout", handleLogout)

seed()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] Servidor rodando em http://localhost:${PORT}`)
    })
  })
  .catch((err: unknown) => {
    console.error("[server] Erro ao inicializar:", err)
    process.exit(1)
  })
