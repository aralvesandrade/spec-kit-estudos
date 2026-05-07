import { Navigate } from "react-router-dom"
import { useAuth } from "./auth-provider.tsx"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()

  if (state.status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <span className="text-sm text-muted-foreground">Carregando…</span>
      </div>
    )
  }

  if (state.status === "unauthenticated") {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
