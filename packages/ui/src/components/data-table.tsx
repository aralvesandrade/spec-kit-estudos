import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"

export interface Column<TData> {
  key: string
  header: string
  cell: (row: TData) => ReactNode
  className?: string
}

interface DataTableProps<TData> {
  columns: Column<TData>[]
  data: TData[]
  isLoading?: boolean
  emptyMessage?: string
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado.",
  page = 1,
  totalPages = 1,
  onPageChange,
}: DataTableProps<TData>) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b last:border-b-0 hover:bg-muted/25"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${col.className ?? ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  )
}
