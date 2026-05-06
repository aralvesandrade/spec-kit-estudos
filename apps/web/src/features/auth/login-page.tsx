import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { useAuth } from "./auth-provider.tsx"

const ERROR_MESSAGES: Record<string, string> = {
  "invalid-credentials": "E-mail ou senha inválidos.",
  "validation-error": "Preencha todos os campos corretamente.",
  "storage-unavailable":
    "Serviço temporariamente indisponível. Tente novamente em instantes.",
  "internal-error": "Erro interno. Tente novamente.",
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("Admin@123")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStorageUnavailable, setIsStorageUnavailable] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsStorageUnavailable(false)

    if (!email.trim() || !password) {
      setError("Preencha o e-mail e a senha.")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await login(email.trim(), password)
      if (result.success) {
        void navigate("/")
      } else {
        const code = result.errorCode ?? "internal-error"
        setError(ERROR_MESSAGES[code] ?? ERROR_MESSAGES["internal-error"])
        if (code === "storage-unavailable") {
          setIsStorageUnavailable(true)
        }
      }
    } catch {
      setError(ERROR_MESSAGES["internal-error"])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Entrar</h1>
          <p className="text-muted-foreground text-sm">
            Use suas credenciais para acessar o sistema.
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              aria-invalid={
                error !== null && !isStorageUnavailable ? true : undefined
              }
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring aria-invalid:border-destructive w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              aria-invalid={
                error !== null && !isStorageUnavailable ? true : undefined
              }
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring aria-invalid:border-destructive w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              role="alert"
              className={`rounded-lg border px-3 py-2 text-sm ${
                isStorageUnavailable
                  ? "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
                  : "border-destructive/20 bg-destructive/5 text-destructive"
              }`}
            >
              {error}
              {isStorageUnavailable && (
                <p className="mt-1 text-xs opacity-75">
                  Verifique sua conexão e tente novamente.
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}
