export interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
}

export interface CustomerFormData {
  name: string
  email: string
  phone: string
}

export interface CustomerError {
  code: string
  message: string
  fields?: { field: string; message: string }[]
}

export type ListCustomersResult =
  | { success: true; customers: Customer[] }
  | { success: false; error: CustomerError }

export type CreateCustomerResult =
  | { success: true; customer: Customer }
  | { success: false; error: CustomerError }

export type GetCustomerResult =
  | { success: true; customer: Customer }
  | { success: false; error: CustomerError }
