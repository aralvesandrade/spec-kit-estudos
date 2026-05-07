export interface Customer {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  createdAt: string
}

export interface CreateCustomerInput {
  name: string
  email: string
  phone?: string
}

export interface CustomerValidationError {
  field: "name" | "email" | "phone"
  message: string
}

export type CustomerErrorCode =
  | "duplicate-email"
  | "validation-error"
  | "not-found"
  | "unauthorized"
  | "internal-error"

export interface CustomerError {
  code: CustomerErrorCode
  message: string
  fields?: CustomerValidationError[]
}
