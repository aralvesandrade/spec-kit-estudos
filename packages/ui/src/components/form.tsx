import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  children: ReactNode
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error && <FormMessage variant="error">{error}</FormMessage>}
    </div>
  )
}

interface FormMessageProps {
  children: ReactNode
  variant: "error" | "description"
}

export function FormMessage({ children, variant }: FormMessageProps) {
  return (
    <p
      className={cn(
        "text-xs",
        variant === "error" ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {children}
    </p>
  )
}
