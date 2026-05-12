import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { getCustomerApi } from "./customers-api.ts"

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerApi(id!),
    enabled: !!id,
  })

  const customer = data?.success ? data.customer : null
  const apiError = data && !data.success ? data.error.message : null

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="col-span-2 h-4 w-40" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || apiError || !customer) {
    return (
      <div className="space-y-4">
        <Link
          to="/clientes"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar para clientes
        </Link>
        <Alert variant="destructive">
          <AlertDescription>
            {apiError ?? "Cliente não encontrado."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        to="/clientes"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Voltar para clientes
      </Link>

      <h1 className="text-xl font-semibold">{customer.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações</CardTitle>
        </CardHeader>
        <CardContent className="divide-y p-0">
          <div className="grid grid-cols-3 px-6 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              Nome
            </span>
            <span className="col-span-2 text-sm">{customer.name}</span>
          </div>
          <div className="grid grid-cols-3 px-6 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              E-mail
            </span>
            <span className="col-span-2 text-sm">{customer.email}</span>
          </div>
          <div className="grid grid-cols-3 px-6 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              Telefone
            </span>
            <span className="col-span-2 text-sm">
              {customer.phone ?? (
                <span className="text-muted-foreground">Não informado</span>
              )}
            </span>
          </div>
          <div className="grid grid-cols-3 px-6 py-3">
            <span className="text-sm font-medium text-muted-foreground">
              Data de cadastro
            </span>
            <span className="col-span-2 text-sm">
              {formatDate(customer.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
