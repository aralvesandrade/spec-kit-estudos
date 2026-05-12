# Data Model: Integração shadcn/ui — Biblioteca de Componentes Admin

**Feature**: 003-add-shadcn
**Fase**: Phase 1 — Design
**Data**: 2026-05-12

---

## Entidades de Domínio

### 1. Customer (existente — sem alterações no schema)

| Campo | Tipo | Restrições | Observação |
|-------|------|------------|------------|
| `id` | `string` | NOT NULL, UUID v4 | PK, gerado no servidor |
| `userId` | `string` | NOT NULL, FK → User.id | Dono do registro |
| `name` | `string` | NOT NULL, 2–120 chars | Nome completo |
| `email` | `string` | NOT NULL, formato email, UNIQUE por userId | E-mail de contato |
| `phone` | `string \| null` | — | Telefone opcional |
| `createdAt` | `string` | NOT NULL, ISO 8601 | Timestamp de criação |

**Sem alterações estruturais** — tabela SQLite permanece inalterada.

---

### 2. CustomerFormData (existente — sem alterações)

| Campo | Tipo | Validação |
|-------|------|-----------|
| `name` | `string` | Obrigatório |
| `email` | `string` | Obrigatório |
| `phone` | `string` | Opcional |

---

### 3. CustomerSchema — novo (apps/web)

Schema Zod a ser criado em `apps/web/src/features/customers/customer-schema.ts`:

```typescript
import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(120, 'Nome muito longo'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
})

export type CustomerSchema = z.infer<typeof customerSchema>
```

---

### 4. ListCustomersParams — novo (API request)

Parâmetros da query string para `GET /api/customers`:

| Campo | Tipo | Default | Restrições |
|-------|------|---------|------------|
| `page` | `number` | `1` | ≥ 1, inteiro positivo |
| `limit` | `number` | `20` | 1–100, inteiro positivo |

---

### 5. PaginatedCustomersResponse — novo (API response)

Resposta de `GET /api/customers` após a feature:

| Campo | Tipo | Observação |
|-------|------|------------|
| `customers` | `Customer[]` | Fatia da página atual |
| `total` | `number` | Total de registros do usuário |
| `page` | `number` | Página atual (1-based) |
| `totalPages` | `number` | `Math.ceil(total / limit)` |

Tipo TypeScript a ser adicionado em `apps/web/src/features/customers/customers-types.ts`:

```typescript
export interface PaginatedCustomersResponse {
  customers: Customer[]
  total: number
  page: number
  totalPages: number
}

export type ListCustomersResult =
  | { success: true; data: PaginatedCustomersResponse }
  | { success: false; error: CustomerError }
```

---

## Componentes de UI — packages/ui

### DataTable\<TData\>

**Arquivo**: `packages/ui/src/components/data-table.tsx`
**Dependências**: nenhuma nova (usa HTML nativo + Tailwind)

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `columns` | `Column<TData>[]` | ✅ | Definição das colunas |
| `data` | `TData[]` | ✅ | Dados da tabela |
| `isLoading` | `boolean` | — | Exibe linhas Skeleton durante fetch |
| `emptyMessage` | `string` | — | Texto quando `data.length === 0` |
| `page` | `number` | — | Página atual (para controles de paginação) |
| `totalPages` | `number` | — | Total de páginas disponíveis |
| `onPageChange` | `(page: number) => void` | — | Callback de navegação entre páginas |

**Column\<TData\>**:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `key` | `string` | ✅ | Chave única da coluna (para React key) |
| `header` | `string` | ✅ | Texto do cabeçalho |
| `cell` | `(row: TData) => React.ReactNode` | ✅ | Renderizador da célula |
| `className` | `string` | — | Classes CSS extras para a célula |

---

### Input

**Arquivo**: `packages/ui/src/components/input.tsx` (via shadcn CLI)
**Props**: estende `React.ComponentProps<"input">`.
Adiciona variante visual de erro via `aria-invalid` nativo.

---

### Label

**Arquivo**: `packages/ui/src/components/label.tsx` (via shadcn CLI)
**Props**: estende `React.ComponentProps<"label">`. Padrão Radix/shadcn.

---

### FormField + FormMessage

**Arquivo**: `packages/ui/src/components/form.tsx` (criado manualmente — sem dep de react-hook-form)

**FormField**:

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `label` | `string` | ✅ | Texto do label |
| `htmlFor` | `string` | ✅ | Atributo `for` do label |
| `required` | `boolean` | — | Exibe marcador `*` vermelho |
| `error` | `string \| undefined` | — | Mensagem de erro (também define `aria-invalid` no slot) |
| `children` | `React.ReactNode` | ✅ | Elemento input |

**FormMessage**:

| Prop | Tipo | Valores | Descrição |
|------|------|---------|-----------|
| `children` | `React.ReactNode` | — | Texto da mensagem |
| `variant` | `string` | `'error' \| 'description'` | Variante visual (vermelho vs muted) |

---

### Card / CardHeader / CardContent / CardTitle

**Arquivo**: `packages/ui/src/components/card.tsx` (via shadcn CLI)
**Props**: estendem `React.ComponentProps<"div">`. Padrão shadcn.

---

### Badge

**Arquivo**: `packages/ui/src/components/badge.tsx` (via shadcn CLI)

| Prop | Tipo | Valores |
|------|------|---------|
| `variant` | `string` | `'default' \| 'secondary' \| 'destructive' \| 'outline'` |

---

### Alert / AlertTitle / AlertDescription

**Arquivo**: `packages/ui/src/components/alert.tsx` (via shadcn CLI)

| Prop | Tipo | Valores |
|------|------|---------|
| `variant` | `string` | `'default' \| 'destructive'` |

---

### Skeleton

**Arquivo**: `packages/ui/src/components/skeleton.tsx` (via shadcn CLI)
**Props**: `className?: string`. Renderiza `<div>` com `animate-pulse`.

---

## Componentes — apps/web

### ThemeToggle

**Arquivo**: `apps/web/src/components/theme-toggle.tsx`
**Props**: nenhuma
**Dependências**: `useTheme` do `ThemeProvider`; `Button` de `@workspace/ui/components/button`; `Sun`, `Moon` de `lucide-react`

---

## Diagrama de Fluxo — Estado da Paginação

```
[URL: /clientes?page=1]
        │
        ▼
[useSearchParams → page=1]
        │
        ▼
[useQuery(['customers', 1])]
    ├── isLoading → DataTable isLoading=true (Skeleton rows)
    ├── error     → Alert destructive + botão retry
    └── data      → DataTable com customers + controles de paginação
                         │
                    [onPageChange(2)]
                         │
                    [navigate to ?page=2]
```

## Diagrama de Fluxo — Estado do Formulário

```
[/clientes/novo]
      │
      ▼
[useForm com zodResolver]
      │
  [submit]
      ├── validação falha → erros nos FormField (aria-invalid + FormMessage)
      └── validação ok → useMutation
                │
                ├── sucesso → invalidate ['customers'] → redirect /clientes
                ├── email duplicado → setError('email', ...)
                └── erro servidor → Alert destructive global
```
