import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { FormField, FormMessage } from "@workspace/ui/components/form"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { createCustomerApi } from "./customers-api.ts"
import { customerSchema, type CustomerSchema } from "./customer-schema.ts"

export function CreateCustomerPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: CustomerSchema) =>
      createCustomerApi({
        name: data.name,
        email: data.email,
        phone: data.phone ?? "",
      }),
    onSuccess: (result) => {
      if (result.success) {
        void queryClient.invalidateQueries({ queryKey: ["customers"] })
        void navigate("/clientes")
      }
    },
  })

  const serverError =
    mutation.data && !mutation.data.success ? mutation.data.error : null

  async function onSubmit(data: CustomerSchema) {
    await mutation.mutateAsync(data)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Novo cliente</h1>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError.message}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-md space-y-4"
      >
        <FormField
          label="Nome"
          htmlFor="name"
          required
          error={errors.name?.message}
        >
          <Input
            id="name"
            type="text"
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>

        <FormField
          label="E-mail"
          htmlFor="email"
          required
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Telefone"
          htmlFor="phone"
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            disabled={isSubmitting}
            {...register("phone")}
          />
          <FormMessage variant="description">Opcional</FormMessage>
        </FormField>

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
