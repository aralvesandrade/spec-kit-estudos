import type {
  Customer,
  CustomerError,
  ListCustomersResult,
  ListCustomersParams,
  PaginatedCustomersResponse,
  CreateCustomerResult,
  GetCustomerResult,
  CustomerFormData,
} from "./customers-types.ts"

export async function listCustomersApi(
  params: ListCustomersParams = {}
): Promise<ListCustomersResult> {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.set("page", String(params.page))
  if (params.limit !== undefined) query.set("limit", String(params.limit))
  const qs = query.toString()
  const res = await fetch(`/api/customers${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  })
  const data = (await res.json()) as {
    customers?: Customer[]
    total?: number
    page?: number
    totalPages?: number
    error?: CustomerError
  }
  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? {
        code: String(res.status),
        message: "Erro ao carregar clientes",
      },
    }
  }
  const paginatedData: PaginatedCustomersResponse = {
    customers: data.customers ?? [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    totalPages: data.totalPages ?? 1,
  }
  return { success: true, data: paginatedData }
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
  const data = (await res.json()) as {
    customer?: Customer
    error?: CustomerError
  }
  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? {
        code: String(res.status),
        message: "Erro ao criar cliente",
      },
    }
  }
  return { success: true, customer: data.customer! }
}

export async function getCustomerApi(id: string): Promise<GetCustomerResult> {
  const res = await fetch(`/api/customers/${id}`, {
    credentials: "include",
  })
  const data = (await res.json()) as {
    customer?: Customer
    error?: CustomerError
  }
  if (!res.ok) {
    return {
      success: false,
      error: data.error ?? {
        code: String(res.status),
        message: "Erro ao carregar cliente",
      },
    }
  }
  return { success: true, customer: data.customer! }
}
