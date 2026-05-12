# Contrato de Interface: API de Clientes

**Feature**: 003-add-shadcn
**Data**: 2026-05-12
**Versão**: 2.0 (paginação adicionada ao GET /api/customers)

---

## Base URL

`/api/customers` — relativo ao servidor Express em `apps/web/server/`

## Autenticação

Todas as rotas requerem sessão válida via cookie `auth_session`. Requisição sem sessão retorna `401 Unauthorized`.

---

## Endpoints

### GET /api/customers

**Descrição**: Lista clientes do usuário autenticado com paginação server-side.

**Query Params**:

| Param | Tipo | Default | Restrições |
|-------|------|---------|------------|
| `page` | `integer` | `1` | ≥ 1 |
| `limit` | `integer` | `20` | 1–100 |

**Resposta de sucesso** `200 OK`:

```json
{
  "customers": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "phone": "+55 11 99999-9999",
      "createdAt": "2026-05-12T10:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 3
}
```

**Respostas de erro**:

| Status | Código | Quando |
|--------|--------|--------|
| `401` | `unauthorized` | Cookie de sessão ausente ou expirado |
| `500` | `internal-error` | Erro inesperado no servidor |

---

### POST /api/customers

**Descrição**: Cria um novo cliente para o usuário autenticado.

**Request Body** (`Content-Type: application/json`):

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "+55 11 99999-9999"
}
```

| Campo | Tipo | Obrigatório | Restrições |
|-------|------|-------------|------------|
| `name` | `string` | ✅ | 2–120 caracteres |
| `email` | `string` | ✅ | Formato email válido |
| `phone` | `string` | — | Qualquer string; pode ser vazio |

**Resposta de sucesso** `201 Created`:

```json
{
  "customer": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "+55 11 99999-9999",
    "createdAt": "2026-05-12T10:00:00.000Z"
  }
}
```

**Respostas de erro**:

| Status | Código | Quando |
|--------|--------|--------|
| `400` | `validation-error` | Dados inválidos (inclui `fields[]`) |
| `401` | `unauthorized` | Sem sessão |
| `409` | `duplicate-email` | E-mail já cadastrado para este usuário |
| `500` | `internal-error` | Erro inesperado |

Exemplo `400 validation-error`:

```json
{
  "error": {
    "code": "validation-error",
    "message": "Dados inválidos",
    "fields": [
      { "field": "email", "message": "Formato de e-mail inválido" },
      { "field": "name", "message": "Nome é obrigatório" }
    ]
  }
}
```

---

### GET /api/customers/:id

**Descrição**: Retorna detalhes de um cliente específico do usuário autenticado.

**Path Params**: `id` (UUID do cliente)

**Resposta de sucesso** `200 OK`:

```json
{
  "customer": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "+55 11 99999-9999",
    "createdAt": "2026-05-12T10:00:00.000Z"
  }
}
```

**Respostas de erro**:

| Status | Código | Quando |
|--------|--------|--------|
| `401` | `unauthorized` | Sem sessão |
| `404` | `not-found` | Cliente não existe ou não pertence ao usuário |
| `500` | `internal-error` | Erro inesperado |

---

## Mudanças em relação à versão 1.0 (feature 002-customer-registration)

| Endpoint | Alteração |
|----------|-----------|
| `GET /api/customers` | ✅ Adicionados query params `page` e `limit`; response inclui `total` e `totalPages`; implementação usa `LIMIT`/`OFFSET` no SQLite |
| `POST /api/customers` | Sem alterações |
| `GET /api/customers/:id` | Sem alterações |

---

## Implementação no Servidor

**customer-repository.ts** — nova função:
```typescript
findCustomersByUserIdPaginated(userId: string, page: number, limit: number):
  { customers: Customer[]; total: number }
```

**customer-controller.ts** — `handleListCustomers` atualizado:
- Lê `req.query.page` (parseInt, default `1`, mínimo `1`)
- Lê `req.query.limit` (parseInt, default `20`, máximo `100`)
- Retorna `{ customers, total, page, totalPages: Math.ceil(total / limit) }`
