---
description: "Task list for 003-add-shadcn"
---

# Tasks: Integração shadcn/ui — Biblioteca de Componentes Admin

**Input**: Design documents from `/specs/003-add-shadcn/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Organização**: Tarefas agrupadas por user story para permitir implementação e teste independentes.
**Testes**: Não solicitados na spec — sem tasks de teste geradas.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências incompletas)
- **[Story]**: A qual user story esta task pertence (US1, US2, US3)
- Paths exatos incluídos nas descrições

---

## Phase 1: Setup

**Objetivo**: Instalar dependências e verificar pré-requisitos

- [X] T001 Instalar `@tanstack/react-query`, `react-hook-form` e `zod` em `apps/web` com `npm install @tanstack/react-query react-hook-form zod --workspace=web`
- [X] T002 [P] Confirmar que `packages/ui/package.json#exports` possui wildcard `"./components/*": "./src/components/*.tsx"` cobrindo todos os novos componentes (leitura — sem modificação necessária)

**Checkpoint**: Dependências instaladas; exports confirmados

---

## Phase 2: Foundational (Primitivos shadcn CLI)

**Objetivo**: Adicionar componentes primitivos ao `packages/ui` que serão compartilhados por todas as user stories

**⚠️ CRÍTICO**: Nenhum trabalho de user story pode iniciar antes desta fase estar completa

- [X] T003 Adicionar primitivos via CLI: `cd packages/ui && npx shadcn add input label card badge alert skeleton` — gera `packages/ui/src/components/{input,label,card,badge,alert,skeleton}.tsx`
- [X] T004 Verificar que `npm run build --filter=@workspace/ui` passa com zero erros após T003

**Checkpoint**: Primitivos disponíveis em `packages/ui`; build verde — implementação de user stories pode iniciar

---

## Phase 3: User Story 1 — Listagem com DataTable (Prioridade: P1) 🎯 MVP

**Objetivo**: Administrador acessa `/clientes` e vê tabela paginada com colunas padronizadas, estados de loading/erro e controles de navegação entre páginas

**Teste independente**: Acessar `/clientes` após login → tabela com colunas Nome, E-mail, Telefone, Ações; skeleton durante loading; mensagem "Nenhum cliente" quando vazio; `?page=2` carrega página correta

### Servidor — paginação (paralelo com UI)

- [X] T005 [P] [US1] Adicionar função `findCustomersByUserIdPaginated(userId, page, limit)` em `apps/web/server/customers/customer-repository.ts` com `SELECT COUNT(*) WHERE user_id = ?` e `SELECT * WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
- [X] T006 [P] [US1] Atualizar `handleListCustomers` em `apps/web/server/customers/customer-controller.ts` para ler `req.query.page` (default `1`) e `req.query.limit` (default `20`, máx `100`) e retornar `{ customers, total, page, totalPages: Math.ceil(total/limit) }`

### Tipos e API client (paralelo com servidor e UI)

- [X] T007 [P] [US1] Adicionar `PaginatedCustomersResponse` e `ListCustomersParams` a `apps/web/src/features/customers/customers-types.ts`; atualizar `ListCustomersResult` para `{ success: true; data: PaginatedCustomersResponse } | { success: false; error: CustomerError }`
- [X] T008 [P] [US1] Atualizar `listCustomersApi` em `apps/web/src/features/customers/customers-api.ts` para aceitar `{ page?: number; limit?: number }` e incluir `?page=N&limit=N` na query string do fetch

### Componente DataTable (paralelo com servidor)

- [X] T009 [P] [US1] Criar `packages/ui/src/components/data-table.tsx` com tipo genérico `Column<TData>` (`key`, `header`, `cell`, `className?`) e componente `DataTable<TData>` com props `columns`, `data`, `isLoading?` (exibe 5 linhas `Skeleton`), `emptyMessage?`, `page?`, `totalPages?`, `onPageChange?` (botões Anterior/Próximo)

### Integração na app

- [X] T010 [US1] Adicionar `QueryClient` + `QueryClientProvider` envolvendo `<App />` em `apps/web/src/main.tsx`
- [X] T011 [US1] Migrar `apps/web/src/features/customers/customers-page.tsx`: substituir `useState/useEffect` por `useQuery(['customers', page])` com `listCustomersApi`; ler `page` de `useSearchParams`; substituir `<table>` HTML por `<DataTable>` de `@workspace/ui/components/data-table`; adicionar `<Alert variant="destructive">` para erros; coluna Ações com `Link` para detalhe
- [X] T012 [US1] Executar `npm run format && npm run typecheck && npm run lint` — zero erros
- [X] T013 [US1] Executar `npm run build --filter=web` — build de produção verde

**Checkpoint US1**: US1 completamente funcional e testável de forma independente

---

## Phase 4: User Story 2 — Formulário com validação visual (Prioridade: P2)

**Objetivo**: Administrador preenche `/clientes/novo` e recebe feedback visual imediato por campo inválido; erros do servidor exibidos como Alert; submit bem-sucedido redireciona para a lista

**Teste independente**: Acessar `/clientes/novo` → submit vazio exibe erros por campo com borda vermelha; e-mail duplicado exibe Alert; dados válidos criam cliente e redirecionam

### Componentes e schema (paralelo entre si)

- [X] T014 [P] [US2] Criar `packages/ui/src/components/form.tsx` com `FormField` (props: `label`, `htmlFor`, `required?`, `error?`, `children`) e `FormMessage` (props: `children`, `variant: 'error' | 'description'`) — sem dependência de `react-hook-form`
- [X] T015 [P] [US2] Criar `apps/web/src/features/customers/customer-schema.ts` com schema Zod: `name` (min 2, max 120), `email` (email válido), `phone` (opcional); exportar `CustomerSchema = z.infer<typeof customerSchema>`

### Migração da página

- [X] T016 [US2] Migrar `apps/web/src/features/customers/create-customer-page.tsx`: substituir `useState` manual por `useForm<CustomerSchema>` com `zodResolver`; substituir `<input>` HTML por `<FormField>` + `<Input>` + `<Label>` de `@workspace/ui`; substituir fetch manual por `useMutation` (TanStack Query) com `invalidateQueries(['customers'])` no `onSuccess`; adicionar `<Alert variant="destructive">` para erros de servidor (email duplicado, erro interno)
- [X] T017 [US2] Verificar `npm run build --filter=@workspace/ui` — build verde com `form.tsx`
- [X] T018 [US2] Executar `npm run format && npm run typecheck && npm run lint` — zero erros

**Checkpoint US2**: US2 completamente funcional e testável de forma independente

---

## Phase 5: User Story 3 — Alternância de tema claro/escuro (Prioridade: P3)

**Objetivo**: Botão de tema no header alterna claro/escuro em < 100ms; preferência persiste via `localStorage`; respeita `prefers-color-scheme` no primeiro acesso

**Teste independente**: Clicar botão de tema → interface muda instantaneamente; recarregar → tema mantido; primeiro acesso com SO em dark mode → aplica dark automaticamente

- [X] T019 [US3] Adicionar `ThemeProvider` (de `apps/web/src/components/theme-provider.tsx`) envolvendo `QueryClientProvider` em `apps/web/src/main.tsx` com `defaultTheme="system"` e `storageKey="ui-theme"`
- [X] T020 [P] [US3] Criar `apps/web/src/components/theme-toggle.tsx`: usa `useTheme()` do ThemeProvider; `Button` variant `"ghost"` size `"icon"` de `@workspace/ui/components/button`; ícone `Sun` (tema escuro ativo) / `Moon` (tema claro ativo) de `lucide-react`; `aria-label` adequado para acessibilidade
- [X] T021 [US3] Adicionar `<ThemeToggle />` ao header de `apps/web/src/features/auth/app-shell.tsx` no `div` de ações (ao lado do e-mail e botão Sair)
- [X] T022 [US3] Executar `npm run format && npm run typecheck && npm run lint` — zero erros

**Checkpoint US3**: US3 completamente funcional e testável de forma independente

---

## Phase 6: Polish & Cross-Cutting

**Objetivo**: Migrar página de detalhe restante (completa CS-001) e executar quality gates finais em todos os pacotes

- [X] T023 [P] Migrar `apps/web/src/features/customers/customer-detail-page.tsx`: substituir `useState/useEffect` por `useQuery(['customer', id], () => getCustomerApi(id))`; substituir `<dl>/<dt>/<dd>` HTML por `<Card>/<CardHeader>/<CardContent>` de `@workspace/ui/components/card`; adicionar `<Skeleton>` para estado de loading (completa CS-001 — zero HTML ad-hoc nas páginas de clientes)
- [X] T024 Executar `npm run typecheck` em todos os pacotes — zero erros TypeScript
- [X] T025 Executar `npm run lint` em todos os pacotes — zero erros ESLint
- [X] T026 Executar `npm run build` — build de produção bem-sucedido em `@workspace/ui` e `web`
- [X] T027 Executar `npm run format` — Prettier + `prettier-plugin-tailwindcss` aplicados

---

## Dependency Graph (ordem de conclusão de fases)

```
Phase 1 (Setup)
    │
    ▼
Phase 2 (Foundational — CLI primitives)
    │
    ├──────────────────────────┐
    ▼                          ▼
Phase 3 (US1 — P1)        Phase 4 (US2 — P2)  ← paralelo com US1 após Phase 2
    │                          │
    └──────────────────────────┘
                │
                ▼
           Phase 5 (US3 — P3)
                │
                ▼
           Phase 6 (Polish)
```

**Notas**:
- US2 (Phase 4) pode iniciar assim que Phase 2 concluir — não depende de US1
- T005–T009 dentro de US1 podem rodar em paralelo (arquivos diferentes)
- T014–T015 dentro de US2 podem rodar em paralelo
- T019 e T020 podem rodar em paralelo (arquivos diferentes); T021 depende de T020

---

## Parallel Execution Examples

### US1 — 5 tarefas paralelas após Phase 2

```
Paralelo A: T005 (customer-repository.ts)  +  T006 (customer-controller.ts)
Paralelo B: T007 (customers-types.ts)      +  T008 (customers-api.ts)
Paralelo C: T009 (data-table.tsx)
Sequencial: T010 → T011 → T012 → T013
```

### US2 — 2 tarefas paralelas

```
Paralelo: T014 (form.tsx)  +  T015 (customer-schema.ts)
Sequencial: T016 → T017 → T018
```

### US3 — partial paralelo

```
Sequencial: T019 (main.tsx com ThemeProvider)
Paralelo:   T020 (theme-toggle.tsx) — rodar junto com T019
Sequencial: T021 → T022
```

---

## Implementation Strategy

**MVP (entrega mínima)**: Phase 1 + Phase 2 + Phase 3 (US1)
→ Listagem funcional com DataTable paginado + design system operacional

**Incremento 2**: Phase 4 (US2)
→ Formulário de criação com validação visual

**Incremento 3**: Phase 5 (US3) + Phase 6
→ Tema claro/escuro + migração completa + quality gates finais

---

## Summary

| Métrica | Valor |
|---------|-------|
| Total de tasks | 27 |
| Phase 1 Setup | 2 tasks |
| Phase 2 Foundational | 2 tasks |
| Phase 3 US1 (P1) | 9 tasks |
| Phase 4 US2 (P2) | 5 tasks |
| Phase 5 US3 (P3) | 4 tasks |
| Phase 6 Polish | 5 tasks |
| Tasks paralelas identificadas | 9 tasks com [P] |
| Testes gerados | 0 (não solicitados na spec) |
| Escopo MVP | Phase 1 + 2 + 3 (US1) — 13 tasks |
