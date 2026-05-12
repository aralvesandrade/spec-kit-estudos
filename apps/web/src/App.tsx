import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom"
import { LoginPage } from "@/features/auth/login-page.tsx"
import { ProtectedRoute } from "@/features/auth/protected-route.tsx"
import { AppShell } from "@/features/auth/app-shell.tsx"
import { useAuth } from "@/features/auth/auth-provider.tsx"
import { CustomersPage } from "@/features/customers/customers-page.tsx"
import { CreateCustomerPage } from "@/features/customers/create-customer-page.tsx"
import { CustomerDetailPage } from "@/features/customers/customer-detail-page.tsx"

function PublicLoginRoute() {
  const { state } = useAuth()

  if (state.status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <span className="text-sm text-muted-foreground">Carregando…</span>
      </div>
    )
  }

  if (state.status === "authenticated") {
    return <Navigate to="/" replace />
  }

  return <LoginPage />
}

function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Início</h1>
      <p className="text-sm text-muted-foreground">
        Bem-vindo! Você está autenticado.
      </p>
    </div>
  )
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Outlet />
      </AppShell>
    </ProtectedRoute>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicLoginRoute />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<CustomersPage />} />
          <Route path="/clientes/novo" element={<CreateCustomerPage />} />
          <Route path="/clientes/:id" element={<CustomerDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
