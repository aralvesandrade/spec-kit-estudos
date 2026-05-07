import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getCustomerApi } from "./customers-api.ts"
import type { Customer } from "./customers-types.ts"

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    void (async () => {
      const result = await getCustomerApi(id)
      if (result.success) {
        setCustomer(result.customer)
      } else {
        setError(result.error.message)
      }
      setIsLoading(false)
    })()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-muted-foreground text-sm">Carregando…</span>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-4">
        <Link to="/clientes" className="text-muted-foreground hover:text-foreground text-sm">
          ← Voltar para clientes
        </Link>
        <p className="text-destructive text-sm">
          {error ?? "Cliente não encontrado."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/clientes" className="text-muted-foreground hover:text-foreground text-sm">
        ← Voltar para clientes
      </Link>

      <h1 className="text-xl font-semibold">{customer.name}</h1>

      <dl className="divide-y rounded-md border">
        <div className="grid grid-cols-3 px-4 py-3">
          <dt className="text-muted-foreground text-sm font-medium">Nome</dt>
          <dd className="col-span-2 text-sm">{customer.name}</dd>
        </div>
        <div className="grid grid-cols-3 px-4 py-3">
          <dt className="text-muted-foreground text-sm font-medium">E-mail</dt>
          <dd className="col-span-2 text-sm">{customer.email}</dd>
        </div>
        <div className="grid grid-cols-3 px-4 py-3">
          <dt className="text-muted-foreground text-sm font-medium">Telefone</dt>
          <dd className="col-span-2 text-sm">
            {customer.phone ?? <span className="text-muted-foreground">Não informado</span>}
          </dd>
        </div>
        <div className="grid grid-cols-3 px-4 py-3">
          <dt className="text-muted-foreground text-sm font-medium">Data de cadastro</dt>
          <dd className="col-span-2 text-sm">{formatDate(customer.createdAt)}</dd>
        </div>
      </dl>
    </div>
  )
}
