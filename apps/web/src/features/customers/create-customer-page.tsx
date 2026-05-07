import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import { createCustomerApi } from "./customers-api.ts"
import type { CustomerFormData } from "./customers-types.ts"

export function CreateCustomerPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFieldErrors({})
    setGlobalError(null)
    setIsSubmitting(true)

    try {
      const result = await createCustomerApi(formData)
      if (result.success) {
        void navigate("/clientes")
      } else {
        const { error } = result
        if (error.code === "validation-error" && error.fields) {
          const errors: Record<string, string> = {}
          for (const fe of error.fields) {
            errors[fe.field] = fe.message
          }
          setFieldErrors(errors)
        } else if (error.code === "duplicate-email") {
          setFieldErrors({ email: error.message })
        } else {
          setGlobalError(error.message)
        }
      }
    } catch {
      setGlobalError("Erro inesperado. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Novo cliente</h1>

      <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nome <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none disabled:opacity-50"
          />
          {fieldErrors.name && (
            <p className="text-xs text-destructive">{fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none disabled:opacity-50"
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium">
            Telefone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none disabled:opacity-50"
          />
          {fieldErrors.phone && (
            <p className="text-xs text-destructive">{fieldErrors.phone}</p>
          )}
        </div>

        {globalError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <p>{globalError}</p>
            <button
              type="button"
              onClick={() => setGlobalError(null)}
              className="mt-1 underline"
            >
              Tente novamente
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando…" : "Salvar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => void navigate("/clientes")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
