import { type ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { useAuth } from "./auth-provider.tsx"

export function AppShell({ children }: { children: ReactNode }) {
  const { state, logout } = useAuth()

  const email =
    state.status === "authenticated" ? state.user.email : undefined

  function handleLogout() {
    void logout()
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
          <span className="text-sm font-medium">App</span>
          <div className="flex items-center gap-3">
            {email && (
              <span className="text-muted-foreground text-xs">{email}</span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  )
}
