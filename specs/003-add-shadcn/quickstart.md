# Quickstart: Integração shadcn/ui — Biblioteca de Componentes Admin

**Feature**: 003-add-shadcn
**Data**: 2026-05-12

## Pré-requisitos

- Node.js ≥ 20 instalado
- `npm install` executado na raiz do monorepo
- Servidor de desenvolvimento rodando: `npm run dev`

---

## Ordem de Implementação

### Etapa 1 — Instalar dependências em `apps/web`

```bash
npm install @tanstack/react-query react-hook-form zod --workspace=web
```

Verifica instalação:
```bash
cat apps/web/package.json | grep -E "react-query|react-hook-form|\"zod\""
```

---

### Etapa 2 — Adicionar componentes primitivos via shadcn CLI

O `components.json` em `packages/ui` configura o destino correto automaticamente:

```bash
cd packages/ui && npx shadcn add input label card badge alert skeleton
```

Verifica arquivos gerados:
```bash
ls packages/ui/src/components/
# Esperado: button.tsx, input.tsx, label.tsx, card.tsx, badge.tsx, alert.tsx, skeleton.tsx
```

---

### Etapa 3 — Criar componentes manuais em `packages/ui`

Crie os seguintes arquivos (seguem o padrão do `button.tsx` existente):

- `packages/ui/src/components/data-table.tsx` — DataTable genérico com paginação
- `packages/ui/src/components/form.tsx` — FormField + FormMessage (sem dep de react-hook-form)

Referência de estrutura: [packages/ui/src/components/button.tsx](../../packages/ui/src/components/button.tsx)

---

### Etapa 4 — Configurar TanStack Query em `apps/web`

Em `apps/web/src/main.tsx`, adicionar `QueryClientProvider` envolvendo o componente raiz:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// Dentro do createRoot render:
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

### Etapa 5 — Configurar ThemeProvider e criar ThemeToggle

1. Em `apps/web/src/main.tsx`, adicionar `ThemeProvider` com `defaultTheme="system"` e `storageKey="ui-theme"`:

```tsx
import { ThemeProvider } from './components/theme-provider'

// Wrapping do App:
<ThemeProvider defaultTheme="system" storageKey="ui-theme">
  <App />
</ThemeProvider>
```

2. Criar `apps/web/src/components/theme-toggle.tsx`:
   - Usa `useTheme()` do ThemeProvider
   - Botão com ícone `Sun`/`Moon` de `lucide-react`
   - `Button` variant `"ghost"` size `"icon"` de `@workspace/ui/components/button`

3. Adicionar `<ThemeToggle />` ao header do `AppShell` em `apps/web/src/features/auth/app-shell.tsx`

---

### Etapa 6 — Adicionar paginação no servidor

**`apps/web/server/customers/customer-repository.ts`**:
- Adicionar `findCustomersByUserIdPaginated(userId, page, limit)` com `COUNT(*)` e `LIMIT ? OFFSET ?`

**`apps/web/server/customers/customer-controller.ts`**:
- `handleListCustomers` lê `req.query.page` e `req.query.limit`
- Retorna `{ customers, total, page, totalPages }`

**`apps/web/src/features/customers/customers-api.ts`**:
- `listCustomersApi({ page, limit })` — adicionar parâmetros à query string

**`apps/web/src/features/customers/customers-types.ts`**:
- Adicionar `PaginatedCustomersResponse` e atualizar `ListCustomersResult`

---

### Etapa 7 — Migrar páginas de clientes

**`customers-page.tsx`**:
- Substituir `useState/useEffect` por `useQuery` + `useSearchParams`
- Substituir `<table>` HTML por `<DataTable>` do `@workspace/ui`
- Adicionar `Skeleton` e `Alert` para estados de loading/erro

**`create-customer-page.tsx`**:
- Substituir `useState` manual por `useForm` com `zodResolver`
- Substituir `<input>` HTML por `<FormField>` + `<Input>` do `@workspace/ui`
- Substituir `fetch` manual por `useMutation` do TanStack Query
- Adicionar `<Alert>` para erros globais

**`customer-detail-page.tsx`**:
- Substituir `useState/useEffect` por `useQuery`
- Substituir `<dl>/<dt>/<dd>` HTML por `<Card>` do `@workspace/ui`
- Adicionar `<Skeleton>` para estado de loading

---

## Verificação Final

```bash
# Typecheck em todos os pacotes
npm run typecheck

# Lint em todos os pacotes
npm run lint

# Build de produção
npm run build

# Formatação
npm run format
```

### Smoke tests manuais

| Cenário | URL | Resultado esperado |
|---------|-----|--------------------|
| Lista de clientes | `http://localhost:5173/clientes` | Tabela paginada com colunas Nome, E-mail, Telefone, Ações |
| Paginação | `http://localhost:5173/clientes?page=2` | Página 2 carregada diretamente |
| Lista vazia | (sem clientes cadastrados) | Mensagem "Nenhum cliente cadastrado" |
| Novo cliente | `http://localhost:5173/clientes/novo` | Formulário com validação visual |
| Submit vazio | Clicar Salvar sem preencher | Erros por campo com borda vermelha |
| Detalhe | `http://localhost:5173/clientes/:id` | Card com dados do cliente |
| Tema escuro | Clicar botão de tema | Interface muda < 100ms |
| Persistência | Recarregar após mudar tema | Tema mantido via localStorage |
| Tema do sistema | Acessar sem preferência salva | Segue `prefers-color-scheme` |
