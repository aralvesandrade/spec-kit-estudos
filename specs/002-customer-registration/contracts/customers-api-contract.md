# Contrato de Interface: API de Clientes

**Feature**: `002-customer-registration`  
**Versão**: v1  
**Data**: 2026-05-06  
**Base URL**: `/api/customers` (proxy Vite → `http://localhost:3001`)

---

## Autenticação

Todos os endpoints requerem sessão válida via cookie `auth_session` (httpOnly).  
Requisições sem sessão ou com sessão expirada retornam `401 Unauthorized`.

---

## Endpoints

### GET `/api/customers`

Lista todos os clientes pertencentes ao usuário autenticado.

**Autenticação**: Obrigatória

**Request**:
```
GET /api/customers
Cookie: auth_session=<session_id>
```

**Response 200 — Sucesso**:
```json
{
  "customers": [
    {
      "id": "uuid-v4",
      "name": "João da Silva",
      "email": "joao@example.com",
      "phone": "(11) 91234-5678",
      "createdAt": "2026-05-06T12:00:00.000Z"
    }
  ]
}
```

**Response 200 — Lista vazia**:
```json
{
  "customers": []
}
```

**Response 401 — Não autenticado**:
```json
{
  "error": {
    "code": "unauthorized",
    "message": "Sessão inválida ou expirada"
  }
}
```

---

### POST `/api/customers`

Cria um novo cliente associado ao usuário autenticado.

**Autenticação**: Obrigatória

**Request**:
```
POST /api/customers
Cookie: auth_session=<session_id>
Content-Type: application/json

{
  "name": "João da Silva",
  "email": "joao@example.com",
  "phone": "(11) 91234-5678"
}
```

**Campos**:
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | ✅ | Nome completo; 2–100 chars |
| `email` | string | ✅ | E-mail válido; único por usuário |
| `phone` | string | ❌ | Telefone; máximo 20 chars |

**Response 201 — Criado com sucesso**:
```json
{
  "customer": {
    "id": "uuid-v4",
    "name": "João da Silva",
    "email": "joao@example.com",
    "phone": "(11) 91234-5678",
    "createdAt": "2026-05-06T12:00:00.000Z"
  }
}
```

**Response 400 — Erro de validação**:
```json
{
  "error": {
    "code": "validation-error",
    "message": "Dados inválidos",
    "fields": [
      { "field": "name", "message": "Nome é obrigatório" },
      { "field": "email", "message": "E-mail inválido" }
    ]
  }
}
```

**Response 409 — E-mail duplicado**:
```json
{
  "error": {
    "code": "duplicate-email",
    "message": "Já existe um cliente com este e-mail"
  }
}
```

**Response 401 — Não autenticado**:
```json
{
  "error": {
    "code": "unauthorized",
    "message": "Sessão inválida ou expirada"
  }
}
```

---

### GET `/api/customers/:id`

Retorna os detalhes de um cliente específico. Verifica que o cliente pertence ao usuário autenticado.

**Autenticação**: Obrigatória

**Parâmetros de rota**:
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | string (UUID) | ID do cliente |

**Request**:
```
GET /api/customers/uuid-v4
Cookie: auth_session=<session_id>
```

**Response 200 — Sucesso**:
```json
{
  "customer": {
    "id": "uuid-v4",
    "name": "João da Silva",
    "email": "joao@example.com",
    "phone": "(11) 91234-5678",
    "createdAt": "2026-05-06T12:00:00.000Z"
  }
}
```

**Response 404 — Não encontrado ou sem permissão**:
```json
{
  "error": {
    "code": "not-found",
    "message": "Cliente não encontrado"
  }
}
```

> **Nota de segurança**: O servidor retorna 404 (e não 403) quando o cliente existe mas pertence a outro usuário. Isso evita vazamento de informação sobre a existência de registros de outros usuários.

**Response 401 — Não autenticado**:
```json
{
  "error": {
    "code": "unauthorized",
    "message": "Sessão inválida ou expirada"
  }
}
```

---

## Tabela de Códigos de Erro

| Código | HTTP Status | Descrição |
|--------|-------------|-----------|
| `unauthorized` | 401 | Sessão ausente, inválida ou expirada |
| `validation-error` | 400 | Um ou mais campos falharam na validação |
| `duplicate-email` | 409 | E-mail já cadastrado para este usuário |
| `not-found` | 404 | Cliente não encontrado ou não pertence ao usuário |
| `internal-error` | 500 | Erro interno do servidor |
