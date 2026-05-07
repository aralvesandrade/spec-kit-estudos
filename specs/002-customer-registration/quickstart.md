# Guia de Início Rápido: Cadastro de Clientes

**Feature**: `002-customer-registration`  
**Data**: 2026-05-06

---

## Pré-requisitos

- Feature `001-login-authentication` implementada e funcionando
- Node ≥ 22 instalado
- Dependências instaladas: `npm install` na raiz

---

## 1. Adicionar tabela `customers` ao banco de dados

Abra `apps/web/server/db/schema.sql` e adicione ao final:

```sql
CREATE TABLE IF NOT EXISTS customers (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  created_at  TEXT NOT NULL,
  UNIQUE(user_id, email)
);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
```

> O banco é recriado ao iniciar o servidor (`db.exec(schema)`). Se o banco `auth.db` já existir, o `CREATE TABLE IF NOT EXISTS` é seguro — não sobrescreve dados.

---

## 2. Implementar o backend

### 2.1 Criar `apps/web/server/customers/customer-types.ts`

Definir interfaces: `Customer`, `CreateCustomerInput`, `CustomerError`, `CustomerErrorCode`.

### 2.2 Criar `apps/web/server/customers/customer-errors.ts`

```typescript
export const CUSTOMER_ERRORS = {
  DUPLICATE_EMAIL: "Já existe um cliente com este e-mail",
  NOT_FOUND: "Cliente não encontrado",
  UNAUTHORIZED: "Sessão inválida ou expirada",
  VALIDATION_ERROR: "Dados inválidos",
  INTERNAL: "Erro interno do servidor",
} as const
```

### 2.3 Criar `apps/web/server/customers/customer-repository.ts`

Queries SQL usando `db` de `../db/client.ts`:
- `findCustomersByUserId(userId: string): Customer[]`
- `findCustomerById(id: string, userId: string): Customer | null`
- `createCustomer(input: Customer): void`

### 2.4 Criar `apps/web/server/customers/customer-service.ts`

Lógica de validação e orquestração:
- `validateCreateCustomerInput(input)` — retorna erros de campo
- `createCustomer(userId, input)` — valida + chama repository
- `listCustomers(userId)` — delega ao repository
- `getCustomer(userId, customerId)` — verifica posse

### 2.5 Criar `apps/web/server/customers/customer-controller.ts`

Handlers Express que:
1. Leem `req.cookies[COOKIE_NAME]`
2. Chamam `validateAndRefreshSession(sessionId)`
3. Chamam o service
4. Retornam JSON

```typescript
export async function handleListCustomers(req: Request, res: Response) { ... }
export async function handleCreateCustomer(req: Request, res: Response) { ... }
export async function handleGetCustomer(req: Request, res: Response) { ... }
```

### 2.6 Registrar rotas em `apps/web/server/index.ts`

```typescript
import { handleListCustomers, handleCreateCustomer, handleGetCustomer } from "./customers/customer-controller.ts"

app.get("/api/customers", handleListCustomers)
app.post("/api/customers", handleCreateCustomer)
app.get("/api/customers/:id", handleGetCustomer)
```

---

## 3. Implementar o frontend

### 3.1 Criar `apps/web/src/features/customers/customers-types.ts`

Tipos frontend: `Customer`, `CustomerFormData`, `ListCustomersResult`, `CreateCustomerResult`, `GetCustomerResult`.

### 3.2 Criar `apps/web/src/features/customers/customers-api.ts`

```typescript
export async function listCustomersApi(): Promise<ListCustomersResult> {
  const res = await fetch("/api/customers", { credentials: "include" })
  return res.json()
}

export async function createCustomerApi(data: CustomerFormData): Promise<CreateCustomerResult> {
  const res = await fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  return res.json()
}

export async function getCustomerApi(id: string): Promise<GetCustomerResult> {
  const res = await fetch(`/api/customers/${id}`, { credentials: "include" })
  return res.json()
}
```

### 3.3 Criar componentes de página

- `customers-page.tsx` — lista com empty state (botão "Adicionar cliente")
- `create-customer-page.tsx` — formulário com validação e botão desabilitado durante envio
- `customer-detail-page.tsx` — exibição de todos os campos do cliente

### 3.4 Criar `apps/web/src/features/customers/index.ts`

```typescript
export { CustomersPage } from "./customers-page.tsx"
export { CreateCustomerPage } from "./create-customer-page.tsx"
export { CustomerDetailPage } from "./customer-detail-page.tsx"
export type { Customer, CustomerFormData } from "./customers-types.ts"
```

### 3.5 Adicionar rotas em `apps/web/src/App.tsx`

```tsx
import { CustomersPage, CreateCustomerPage, CustomerDetailPage } from "./features/customers"

// Dentro de <Routes>:
<Route path="/clientes" element={
  <ProtectedRoute><AppShell><CustomersPage /></AppShell></ProtectedRoute>
} />
<Route path="/clientes/novo" element={
  <ProtectedRoute><AppShell><CreateCustomerPage /></AppShell></ProtectedRoute>
} />
<Route path="/clientes/:id" element={
  <ProtectedRoute><AppShell><CustomerDetailPage /></AppShell></ProtectedRoute>
} />
```

---

## 4. Verificar e testar

```bash
# Iniciar servidor + frontend
npm run dev

# Em outro terminal — verificar TypeScript
npx turbo typecheck

# Verificar lint
npx turbo lint

# Build de produção
npx turbo build
```

**Fluxo de teste manual**:
1. Acesse `http://localhost:5173/login` e autentique com `admin@example.com` / `Admin@123`
2. Acesse `/clientes` — deve exibir empty state com botão "Adicionar cliente"
3. Clique em "Adicionar cliente" → deve navegar para `/clientes/novo`
4. Preencha o formulário com dados válidos → deve criar e redirecionar para `/clientes`
5. O cliente criado deve aparecer na lista com nome, e-mail e data
6. Clique no cliente → deve abrir `/clientes/:id` com todos os campos
7. Tente criar outro cliente com o mesmo e-mail → deve exibir erro "Já existe um cliente com este e-mail"
8. Abra outra sessão com outro usuário (se disponível) → não deve ver os clientes do primeiro usuário

---

## Estrutura de Arquivos Final

```
apps/web/
├── server/
│   ├── customers/
│   │   ├── customer-controller.ts
│   │   ├── customer-errors.ts
│   │   ├── customer-repository.ts
│   │   ├── customer-service.ts
│   │   └── customer-types.ts
│   ├── db/
│   │   └── schema.sql          ← adicionar tabela customers
│   └── index.ts                ← adicionar rotas /api/customers
└── src/
    ├── App.tsx                 ← adicionar 3 rotas /clientes
    └── features/
        └── customers/
            ├── index.ts
            ├── customers-api.ts
            ├── customers-types.ts
            ├── customers-page.tsx
            ├── create-customer-page.tsx
            └── customer-detail-page.tsx
```
