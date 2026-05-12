import { z } from "zod"

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(120, "Nome deve ter no máximo 120 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .optional()
    .or(z.literal("")),
})

export type CustomerSchema = z.infer<typeof customerSchema>
