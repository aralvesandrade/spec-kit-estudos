import { Navigate } from "react-router-dom"
import { useAuth } from "./auth-provider.tsx"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()

  if (state.status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <span className="text-muted-foreground text-sm">Carregando…</span>
      </div>
    )
  }

  if (state.status === "unauthenticated") {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
