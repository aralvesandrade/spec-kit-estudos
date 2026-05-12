# Research: Integração shadcn/ui — Biblioteca de Componentes Admin

**Feature**: 003-add-shadcn
**Fase**: Phase 0 — Research
**Data**: 2026-05-12

---

## Contexto

Fase de pesquisa para resolver os itens "NEEDS CLARIFICATION" do Technical Context e consolidar decisões técnicas antes da fase de design.

---

## 1. Performance Goals

**Decisão**: Dois targets identificados na spec:
- Alternância de tema: < 100ms (CS-003)
- Paginação da listagem: máximo 20 registros por página (RF-001); sem SLA de latência explícito além do que Express + SQLite entregam em ambiente local (< 50ms típico)

**Rationale**: CS-003 é explícito. O limite de 20/página é definido em RF-001 e nos edge cases. Nenhum outro requisito de performance foi identificado.

**Alternativas consideradas**: Nenhuma — requisitos já definidos na spec.

---

## 2. Scale/Scope

**Decisão**:
- **Componentes novos em `packages/ui`**: 8 — `data-table`, `input`, `label`, `form`, `card`, `badge`, `alert`, `skeleton`
- **Páginas migradas em `apps/web`**: 3 — `customers-page`, `create-customer-page`, `customer-detail-page`
- **Componentes novos em `apps/web`**: 1 — `theme-toggle`
- **Novas dependências em `apps/web`**: 2 — `@tanstack/react-query`, `react-hook-form`; `zod` também instalado em `apps/web` (já existe em `packages/ui` mas não é re-exportado)
- **Novas dependências em `packages/ui`**: 0 — todas já presentes
- **Modificações no servidor**: 2 arquivos — `customer-controller.ts`, `customer-repository.ts`
- **Modificações na API client**: 1 arquivo — `customers-api.ts`

**Rationale**: Escopo médio. Nenhuma nova dependência de runtime para `packages/ui`.

---

## 3. TanStack Query — Padrão de Integração

**Decisão**:
- Instalar `@tanstack/react-query` em `apps/web`
- Configurar `QueryClient` + `QueryClientProvider` em `apps/web/src/main.tsx` (wrapping o `App`)
- `CustomersPage` usa `useQuery({ queryKey: ['customers', page], queryFn: () => listCustomersApi({ page, limit: 20 }) })`
- `CreateCustomerPage` usa `useMutation` + `queryClient.invalidateQueries({ queryKey: ['customers'] })` após criação bem-sucedida
- `CustomerDetailPage` usa `useQuery({ queryKey: ['customer', id], queryFn: () => getCustomerApi(id) })`
- Estado de página controlado via `useSearchParams` (bookmarkable, survives refresh)

**Rationale**: Pattern padrão TanStack Query v5. Cache automático, deduplicação de requisições e estados de loading/error eliminam boilerplate de `useState/useEffect`.

**Alternativas consideradas**: SWR — descartado pois TanStack Query tem melhor suporte a mutações e maior adoção no ecossistema shadcn/ui.

---

## 4. react-hook-form + zod — Padrão de Formulário

**Decisão**:
- Instalar `react-hook-form` e `zod` em `apps/web`
- Schema Zod definido em novo arquivo: `apps/web/src/features/customers/customer-schema.ts`
- `packages/ui` exporta primitivos de UI (`Input`, `Label`, `FormField`, `FormMessage`) **sem** dependência de react-hook-form — recebem error state via props
- Integração react-hook-form ↔ componentes UI feita em `apps/web/src/features/customers/create-customer-page.tsx`

**Rationale**: Separação de responsabilidades — `packages/ui` provê apenas a UI; lógica de validação fica em `apps/web`. Evita adicionar react-hook-form como dep de `packages/ui`.

**Alternativas consideradas**: Formik — descartado (mais verbose, menos tipado). tanstack-form — descartado (menor adoção no ecossistema shadcn).

---

## 5. DataTable — Padrão de Implementação

**Decisão**:
- Implementar `DataTable` em `packages/ui/src/components/data-table.tsx` usando `<table>` nativo com classes Tailwind (padrão shadcn)
- Interface de colunas customizada: `Column<TData> = { key: string; header: string; cell: (row: TData) => React.ReactNode; className?: string }`
- Props de paginação opcionais: `page?`, `totalPages?`, `onPageChange?`
- Estado loading exibe linhas de `Skeleton` no lugar dos dados
- Sem dependência de `@tanstack/react-table` (seria over-engineering para o escopo atual)

**Rationale**: Simples, zero novas dependências em `packages/ui`. Atende RF-001 completamente. TanStack Table pode ser adotado em feature futura se sortable/filterable forem necessários.

**Alternativas consideradas**: `@tanstack/react-table` — descartado (adiciona ~25KB de dep; funcionalidades de sorting/filtering fora do escopo).

---

## 6. Server-Side Pagination

**Decisão**:
- `customer-repository.ts`: adicionar `findCustomersByUserIdPaginated(userId, page, limit)` com dois statements SQLite: `SELECT COUNT(*)` e `SELECT * ... LIMIT ? OFFSET ?`
- `customer-controller.ts`: `handleListCustomers` lê `req.query.page` (default: `1`) e `req.query.limit` (default: `20`, máx: `100`), retorna `{ customers, total, page, totalPages }`
- `customers-api.ts`: `listCustomersApi({ page?: number; limit?: number })` com defaults aplicados no cliente
- Paginação em `customers-page.tsx` via `useSearchParams` — `?page=1` na URL

**Rationale**: Paginação no servidor conforme decidido na sessão de clarificação. `useSearchParams` torna a página atual bookmarkable e preserva o estado no refresh.

**Alternativas consideradas**: Estado local `useState` para página — descartado (não bookmarkable, perde estado no refresh).

---

## 7. Alternância de Tema

**Decisão**:
- `ThemeProvider` já existe completo em `apps/web/src/components/theme-provider.tsx` com suporte a `localStorage` e `prefers-color-scheme`
- `ThemeProvider` ainda não está sendo aplicado — adicionar ao `main.tsx` envolvendo o `App`
- Criar `apps/web/src/components/theme-toggle.tsx` com botão Sun/Moon usando `lucide-react` e `Button` do `@workspace/ui`
- Adicionar `ThemeToggle` ao header do `AppShell` (`app-shell.tsx`)

**Rationale**: A infraestrutura de tema já está pronta. Apenas conectar `ThemeProvider` e criar o botão de toggle resolve RF-008 com o mínimo de código.

**Alternativas consideradas**: Criar novo ThemeProvider — descartado (já existe um completo e funcional).

---

## 8. Componentes via shadcn CLI vs. Manual

**Decisão**:
- **Via CLI**: `input`, `label`, `card`, `badge`, `alert`, `skeleton`
  ```bash
  cd packages/ui && npx shadcn add input label card badge alert skeleton
  ```
- **Manual**: `data-table.tsx`, `form.tsx` (FormField + FormMessage)
  - `DataTable` é um componente custom sem equivalente no CLI
  - `form.tsx` do CLI depende de react-hook-form como dep de `packages/ui` — evitado com versão custom simplificada

**Rationale**: CLI garante consistência de estilo e tokens CSS. Componentes custom permitem controle total sobre dependências.

**Alternativas consideradas**: Criar todos manualmente — descartado (mais lento, propenso a inconsistência de estilo com os tokens do shadcn).
