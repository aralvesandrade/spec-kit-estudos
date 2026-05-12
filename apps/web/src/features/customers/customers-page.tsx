import { useSearchParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { DataTable } from "@workspace/ui/components/data-table"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import type { Column } from "@workspace/ui/components/data-table"
import { listCustomersApi } from "./customers-api.ts"
import type { Customer } from "./customers-types.ts"

const columns: Column<Customer>[] = [
  {
    key: "name",
    header: "Nome",
    cell: (customer) => (
      <Link
        to={`/clientes/${customer.id}`}
        className="font-medium text-primary hover:underline"
      >
        {customer.name}
      </Link>
    ),
  },
  {
    key: "email",
    header: "E-mail",
    cell: (customer) => customer.email,
  },
  {
    key: "phone",
    header: "Telefone",
    cell: (customer) => customer.phone ?? "—",
  },
  {
    key: "actions",
    header: "Ações",
    cell: (customer) => (
      <Link
        to={`/clientes/${customer.id}`}
        className="text-xs text-primary hover:underline"
      >
        Ver detalhes
      </Link>
    ),
  },
]

export function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get("page") ?? "1")

  const { data, isLoading, error } = useQuery({
    queryKey: ["customers", page],
    queryFn: () => listCustomersApi({ page }),
  })

  const paginatedData = data?.success ? data.data : null
  const apiError = data && !data.success ? data.error.message : null

  function handlePageChange(newPage: number) {
    setSearchParams({ page: String(newPage) })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <Button asChild size="sm">
          <Link to="/clientes/novo">Adicionar cliente</Link>
        </Button>
      </div>

      {(error || apiError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {apiError ?? "Erro ao carregar clientes."}
          </AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={paginatedData?.customers ?? []}
        isLoading={isLoading}
        emptyMessage="Nenhum cliente cadastrado ainda."
        page={paginatedData?.page ?? page}
        totalPages={paginatedData?.totalPages ?? 1}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
