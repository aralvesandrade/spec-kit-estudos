import { v4 as uuidv4 } from "uuid"
import {
  findCustomersByUserId,
  findCustomersByUserIdPaginated,
  findCustomerById,
  createCustomer as createCustomerInDb,
} from "./customer-repository.ts"
import type {
  Customer,
  CreateCustomerInput,
  CustomerValidationError,
} from "./customer-types.ts"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateCreateCustomerInput(
  input: CreateCustomerInput
): CustomerValidationError[] {
  const errors: CustomerValidationError[] = []

  const name = input.name?.trim() ?? ""
  if (!name) {
    errors.push({ field: "name", message: "Nome é obrigatório" })
  } else if (name.length < 2) {
    errors.push({
      field: "name",
      message: "Nome deve ter pelo menos 2 caracteres",
    })
  } else if (name.length > 100) {
    errors.push({
      field: "name",
      message: "Nome deve ter no máximo 100 caracteres",
    })
  }

  const email = input.email?.trim().toLowerCase() ?? ""
  if (!email) {
    errors.push({ field: "email", message: "E-mail é obrigatório" })
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: "email", message: "E-mail inválido" })
  } else if (email.length > 254) {
    errors.push({
      field: "email",
      message: "E-mail deve ter no máximo 254 caracteres",
    })
  }

  if (input.phone !== undefined && input.phone !== "") {
    const phone = input.phone.trim()
    if (phone.length > 20) {
      errors.push({
        field: "phone",
        message: "Telefone deve ter no máximo 20 caracteres",
      })
    }
  }

  return errors
}

export function listCustomers(userId: string): Customer[] {
  return findCustomersByUserId(userId)
}

export function listCustomersPaginated(
  userId: string,
  page: number,
  limit: number
): { customers: Customer[]; total: number } {
  return findCustomersByUserIdPaginated(userId, page, limit)
}

export function createCustomer(
  userId: string,
  input: CreateCustomerInput
): Customer {
  const customer: Customer = {
    id: uuidv4(),
    userId,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    createdAt: new Date().toISOString(),
  }
  return createCustomerInDb(customer)
}

export function getCustomer(
  userId: string,
  customerId: string
): Customer | undefined {
  return findCustomerById(customerId, userId)
}
