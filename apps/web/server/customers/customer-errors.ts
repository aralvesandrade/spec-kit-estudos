import type { CustomerErrorCode } from "./customer-types.ts"

export const CUSTOMER_ERRORS: Record<CustomerErrorCode, string> = {
  "duplicate-email": "Já existe um cliente com este e-mail",
  "validation-error": "Dados inválidos",
  "not-found": "Cliente não encontrado",
  "unauthorized": "Sessão inválida ou expirada",
  "internal-error": "Erro interno. Tente novamente.",
}

export function makeCustomerError(code: CustomerErrorCode) {
  return {
    code,
    message: CUSTOMER_ERRORS[code],
  }
}
