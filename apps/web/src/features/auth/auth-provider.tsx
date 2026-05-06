import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { AuthState, AuthUser, AuthSession } from "./auth-types.ts"
import { getMeApi, loginApi, logoutApi } from "./auth-api.ts"

interface AuthContextValue {
  state: AuthState
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; errorCode?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" })

  useEffect(() => {
    getMeApi()
      .then((result) => {
        if (result.authenticated) {
          setState({
            status: "authenticated",
            user: result.user,
            session: result.session,
          })
        } else {
          setState({ status: "unauthenticated" })
        }
      })
      .catch(() => {
        setState({ status: "unauthenticated" })
      })
  }, [])

  async function login(
    email: string,
    password: string
  ): Promise<{ success: boolean; errorCode?: string }> {
    const result = await loginApi(email, password)
    if (result.authenticated) {
      setState({
        status: "authenticated",
        user: result.user as AuthUser,
        session: result.session as AuthSession,
      })
      return { success: true }
    } else {
      return { success: false, errorCode: result.error.code }
    }
  }

  async function logout(): Promise<void> {
    await logoutApi()
    setState({ status: "unauthenticated" })
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
