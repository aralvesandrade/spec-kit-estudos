# Implementation Plan: Integração shadcn/ui — Biblioteca de Componentes Admin

**Branch**: `003-add-shadcn` | **Date**: 2026-05-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-add-shadcn/spec.md`

## Summary

Completar a integração do shadcn/ui no `packages/ui`, adicionando 8 novos componentes reutilizáveis (`DataTable`, `Input`, `Label`, `FormField`, `FormMessage`, `Card`, `Badge`, `Alert`, `Skeleton`) e migrar as 3 páginas de clientes existentes para usar esses componentes via `@workspace/ui`. Inclui adição de `@tanstack/react-query` e `react-hook-form` em `apps/web`, paginação server-side na API `/api/customers` (com `LIMIT`/`OFFSET` no SQLite), formulário com validação por zod e alternância de tema claro/escuro no `AppShell`.

## Technical Context

**Language/Version**: TypeScript 5.x (strict)
**Primary Dependencies**: React 19, Vite 7, TailwindCSS 4, Turborepo 2
**UI Library**: `@workspace/ui` — `radix-ui@1.4.3`, `class-variance-authority@0.7.1`, `zod@3.x`, `shadcn@4.7.0`
**New Dependencies (apps/web)**: `@tanstack/react-query`, `react-hook-form`, `zod`
**Testing**: Vitest (run: `vitest run`) — sem novos utilitários em `packages/ui/src/lib/`, portanto sem novos testes requeridos
**Target Platform**: Web browser (SPA), React Router v7
**Project Type**: Monorepo — React SPA (`apps/web`) + shared UI lib (`packages/ui`)
**Performance Goals**: Alternância de tema < 100ms (CS-003); listagem com paginação máx 20 registros/página
**Constraints**: Node ≥ 20; npm workspaces; fronteira de pacotes enforced pela constituição; `packages/ui` NÃO pode importar de `apps/*`
**Scale/Scope**: Médio — 8 novos componentes em `packages/ui`, 3 páginas migradas + 1 novo componente + 2 modificações de feature em `apps/web`, 2 arquivos de servidor modificados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Observação |
|-----------|--------|------------|
| I. Module Boundaries | ✅ PASS | Novos primitivos em `packages/ui`; páginas em `apps/web`; `packages/ui` não importa de `apps/*` |
| II. TypeScript Strict | ✅ PASS | Todo código novo é TypeScript strict; `DataTable<TData>` e `Column<TData>` são genéricos tipados |
| III. Component Ownership | ✅ PASS | `DataTable`, `Input`, `Label`, `FormField`, `FormMessage`, `Card`, `Badge`, `Alert`, `Skeleton` são primitivos reutilizáveis → `packages/ui`; `ThemeToggle` é app-specific (usa contexto de `ThemeProvider` de `apps/web`) → `apps/web` |
| IV. Naming Conventions | ✅ PASS | Todos os arquivos em kebab-case; componentes PascalCase; nenhum hook novo em `packages/ui` |
| V. Quality Gates | ✅ PASS | `typecheck`, `lint`, `build`, `format` serão executados antes de merge |
| VI. Testing | ✅ PASS | Nenhum novo utilitário em `packages/ui/src/lib/` — sem novos testes obrigatórios |
| VII. Package Exports Contract | ✅ PASS | Export wildcard `"./components/*": "./src/components/*.tsx"` já cobre todos os novos componentes automaticamente |

**Resultado pós-design**: Sem violações. Pode prosseguir para tasks.

## Project Structure

### Documentation (this feature)

```
specs/003-add-shadcn/
├── plan.md              # Este arquivo (/speckit.plan output)
├── research.md          # Phase 0 output — decisões técnicas e pesquisa
├── data-model.md        # Phase 1 output — entidades, props de componentes, diagramas de estado
├── quickstart.md        # Phase 1 output — guia de implementação em ordem
├── contracts/
│   └── customers-api-contract.md  # Contrato da API atualizado com paginação
└── tasks.md             # Phase 2 output (/speckit.tasks — ainda não criado)
```

### Source Code (repository root)

```
# Option C: Both — novos primitivos em packages/ui consumidos por apps/web

packages/ui/src/components/
├── button.tsx           # EXISTENTE — não modificado
├── data-table.tsx       # NOVO — DataTable<TData> genérico com paginação (manual)
├── form.tsx             # NOVO — FormField + FormMessage sem dep de react-hook-form (manual)
├── input.tsx            # NOVO — via shadcn CLI
├── label.tsx            # NOVO — via shadcn CLI
├── card.tsx             # NOVO — via shadcn CLI
├── badge.tsx            # NOVO — via shadcn CLI
├── alert.tsx            # NOVO — via shadcn CLI
└── skeleton.tsx         # NOVO — via shadcn CLI

apps/web/src/
├── main.tsx                         # MODIFICADO — adiciona QueryClientProvider + ThemeProvider
├── components/
│   ├── theme-provider.tsx           # EXISTENTE — não modificado (já completo)
│   └── theme-toggle.tsx             # NOVO — botão Sun/Moon com useTheme()
├── features/auth/
│   └── app-shell.tsx                # MODIFICADO — adiciona <ThemeToggle /> no header
└── features/customers/
    ├── customer-schema.ts           # NOVO — schema Zod para o formulário
    ├── customers-types.ts           # MODIFICADO — adiciona PaginatedCustomersResponse
    ├── customers-api.ts             # MODIFICADO — adiciona page/limit params
    ├── customers-page.tsx           # MIGRADO — DataTable + useQuery + useSearchParams
    ├── create-customer-page.tsx     # MIGRADO — FormField + react-hook-form + useMutation
    └── customer-detail-page.tsx     # MIGRADO — Card + Skeleton + useQuery

apps/web/server/customers/
├── customer-controller.ts           # MODIFICADO — lê page/limit, retorna paginado
└── customer-repository.ts           # MODIFICADO — findCustomersByUserIdPaginated com LIMIT/OFFSET
```

**Structure Decision**: Option C — shared primitives no `packages/ui` consumidos por `apps/web`. `ThemeToggle` fica em `apps/web/src/components/` por ser específico da aplicação (usa `useTheme()` do `ThemeProvider` que é de `apps/web`). `form.tsx` criado manualmente para evitar adicionar `react-hook-form` como dependência de `packages/ui`.

## Complexity Tracking

> Sem violações de constituição identificadas — sem entradas necessárias.
