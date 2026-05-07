import type {
  Customer,
  CustomerError,
  ListCustomersResult,
  CreateCustomerResult,
  GetCustomerResult,
  CustomerFormData,
} from "./customers-types.ts"

export async function listCustomersApi(): Promise<ListCustomersResult> {
  const res = await fetch("/api/customers", {
    credentials: "include",
  })
  const data = (await res.json()) as { customers?: Customer[]; error?: CustomerError }
  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? { code: String(res.status), message: "Erro ao carregar clientes" },
    }
  }
  return { success: true, customers: data.customers ?? [] }
}

export async function createCustomerApi(
  formData: CustomerFormData
): Promise<CreateCustomerResult> {
  const res = await fetch("/api/customers", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
  const data = (await res.json()) as { customer?: Customer; error?: CustomerError }
  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? { code: String(res.status), message: "Erro ao criar cliente" },
    }
  }
  return { success: true, customer: data.customer! }
}

export async function getCustomerApi(id: string): Promise<GetCustomerResult> {
  const res = await fetch(`/api/customers/${id}`, {
    credentials: "include",
  })
  const data = (await res.json()) as { customer?: Customer; error?: CustomerError }
  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? { code: String(res.status), message: "Erro ao carregar cliente" },
    }
  }
  return { success: true, customer: data.customer! }
}
