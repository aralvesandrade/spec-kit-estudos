# Modelo de Dados: Cadastro de Clientes

**Feature**: `002-customer-registration`  
**Data**: 2026-05-06

---

## Entidades

### Cliente (`customers`)

| Campo | Tipo SQL | Tipo TS | Obrigatório | Regras |
|-------|----------|---------|-------------|--------|
| `id` | `TEXT PRIMARY KEY` | `string` | ✅ | UUID v4, gerado pelo servidor |
| `user_id` | `TEXT NOT NULL` | `string` | ✅ | FK → `users(id)`; isolamento de dados |
| `name` | `TEXT NOT NULL` | `string` | ✅ | trim; mínimo 2 chars; máximo 100 chars |
| `email` | `TEXT NOT NULL` | `string` | ✅ | trim + lowercase; regex e-mail; máximo 254 chars |
| `phone` | `TEXT` | `string \| null` | ❌ | opcional; dígitos/espaços/hífen/parênteses; máximo 20 chars |
| `created_at` | `TEXT NOT NULL` | `string` | ✅ | ISO 8601, gerado pelo servidor |

**Constraints**:
- `UNIQUE(user_id, email)` — e-mail único por usuário
- `REFERENCES users(id)` — integridade referencial com a tabela de usuários

---

## DDL (SQL)

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
```

> Adicionar ao final de `apps/web/server/db/schema.sql` (após tabela `auth_attempts`).

---

## Relacionamentos

```
users (1) ──────────────── (N) customers
  │                                  │
  id ◄─────────────────── user_id   │
  email, ...                         │
                                  id, name, email, phone, created_at
```

- Um `User` pode ter 0..N `Customer`s.
- Um `Customer` pertence a exatamente 1 `User`.
- Exclusão de usuário: comportamento não definido para v1 (sem CASCADE definido).

---

## Tipos TypeScript — Servidor (`apps/web/server/customers/`)

```typescript
// customer-types.ts (server)

export interface Customer {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  createdAt: string  // ISO 8601
}

export interface CreateCustomerInput {
  name: string
  email: string
  phone?: string
}

export interface CustomerValidationError {
  field: "name" | "email" | "phone"
  message: string
}

export type CustomerErrorCode =
  | "duplicate-email"
  | "validation-error"
  | "not-found"
  | "unauthorized"
  | "internal-error"

export interface CustomerError {
  code: CustomerErrorCode
  message: string
  fields?: CustomerValidationError[]
}
```

---

## Tipos TypeScript — Frontend (`apps/web/src/features/customers/`)

```typescript
// customers-types.ts (frontend)

export interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string  // ISO 8601
}

export interface CustomerFormData {
  name: string
  email: string
  phone: string
}

export interface CustomerError {
  code: string
  message: string
  fields?: { field: string; message: string }[]
}

export type ListCustomersResult =
  | { success: true; customers: Customer[] }
  | { success: false; error: CustomerError }

export type CreateCustomerResult =
  | { success: true; customer: Customer }
  | { success: false; error: CustomerError }

export type GetCustomerResult =
  | { success: true; customer: Customer }
  | { success: false; error: CustomerError }
```

---

## Transições de Estado

```
[Formulário vazio]
       │
       │ usuário preenche campos
       ▼
[Formulário preenchido]
       │
       │ usuário clica "Salvar"
       ▼
[Enviando] ← botão desabilitado
       │
       ├── sucesso ──► [Redirecionado para /clientes]
       │
       └── erro ──────► [Formulário com mensagem de erro]
                              │
                              │ usuário corrige e tenta novamente
                              ▼
                        [Enviando] ← loop
```

---

## Regras de Validação

| Campo | Regra | Mensagem de Erro |
|-------|-------|-----------------|
| `name` | Obrigatório | "Nome é obrigatório" |
| `name` | Mínimo 2 chars (após trim) | "Nome deve ter pelo menos 2 caracteres" |
| `name` | Máximo 100 chars | "Nome deve ter no máximo 100 caracteres" |
| `email` | Obrigatório | "E-mail é obrigatório" |
| `email` | Formato válido (regex) | "E-mail inválido" |
| `email` | Máximo 254 chars | "E-mail muito longo" |
| `email` | Único por usuário | "Já existe um cliente com este e-mail" |
| `phone` | Se fornecido: apenas `[0-9\s\-\(\)\+]` | "Telefone inválido" |
| `phone` | Máximo 20 chars | "Telefone muito longo" |

---

## Índices Recomendados

```sql
-- Consulta principal: listar clientes por usuário
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
```

> Necessário para performance quando um usuário tiver muitos clientes.
