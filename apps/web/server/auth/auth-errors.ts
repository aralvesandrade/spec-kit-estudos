import type { AuthErrorCode } from "../../src/features/auth/auth-types.ts"

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  "invalid-credentials": "E-mail ou senha inválidos.",
  "validation-error": "Campos obrigatórios ausentes ou inválidos.",
  "session-expired": "Sua sessão expirou. Faça login novamente.",
  "session-invalid": "Sessão inválida. Faça login novamente.",
  "storage-unavailable":
    "Serviço temporariamente indisponível. Tente novamente.",
  "internal-error": "Erro interno. Tente novamente.",
}

export function makeError(code: AuthErrorCode) {
  return {
    code,
    message: AUTH_ERROR_MESSAGES[code],
  }
}
