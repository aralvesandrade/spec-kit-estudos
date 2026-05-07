import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { listCustomersApi } from "./customers-api.ts"
import type { Customer } from "./customers-types.ts"

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("pt-BR")
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const result = await listCustomersApi()
      if (result.success) {
        setCustomers(result.customers)
      } else {
        setError(result.error.message)
      }
      setIsLoading(false)
    })()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-sm text-muted-foreground">Carregando…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <Button asChild size="sm">
          <Link to="/clientes/novo">Adicionar cliente</Link>
        </Button>
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum cliente cadastrado ainda.
          </p>
          <Button asChild size="sm">
            <Link to="/clientes/novo">Adicionar cliente</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Data de cadastro</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b last:border-b-0 hover:bg-muted/25"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/clientes/${customer.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">
                    {formatDate(customer.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
