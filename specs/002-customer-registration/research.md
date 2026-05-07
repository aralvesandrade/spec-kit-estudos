# Pesquisa: Cadastro de Clientes

**Feature**: `002-customer-registration`  
**Data**: 2026-05-06  
**Status**: Completo — nenhum NEEDS CLARIFICATION pendente

---

## Decisões Técnicas

### 1. Isolamento de dados por usuário no SQLite

**Decisão**: Usar `user_id` como coluna de partição na tabela `customers`; todas as queries incluem `WHERE user_id = ?` com o ID extraído da sessão.

**Racional**: O banco usa SQLite via `node:sqlite` (Node ≥ 22). Não há ORM — as queries são preparadas diretamente (`db.prepare(sql).run(...)`), seguindo o padrão do `auth-repository.ts`. A restrição de isolamento é aplicada no servidor; o cliente nunca envia `user_id` no body.

**Alternativas consideradas**:
- Row-Level Security (PostgreSQL) — descartada: projeto usa SQLite.
- Validar `user_id` no frontend — descartada: violação de princípio de segurança (validação só no cliente não tem valor).

---

### 2. Unicidade de e-mail por usuário (UNIQUE constraint composta)

**Decisão**: `UNIQUE(user_id, email)` na tabela `customers`.

**Racional**: Permite que dois usuários diferentes cadastrem o mesmo e-mail de cliente, mas impede duplicatas para o mesmo usuário. Implementado via constraint SQL composta — mais eficiente que validação manual no service.

**Tratamento**: O servidor captura `SQLITE_CONSTRAINT_UNIQUE` e retorna `{ error: { code: "duplicate-email", message: "..." } }` com HTTP 409.

**Alternativas consideradas**:
- `UNIQUE(email)` global — descartada: restrição desnecessária para um CRM multi-usuário.
- Validação somente no service (SELECT antes do INSERT) — descartada: race condition possível; constraint SQL é atômica.

---

### 3. Extração do `user_id` da sessão

**Decisão**: Reutilizar `validateAndRefreshSession(sessionId)` de `session-service.ts`; o service retorna `{ userId }` que é passado adiante para o controller.

**Racional**: Reutiliza 100% da lógica de sessão já testada da feature 001. Evita duplicação de código. A função já faz refresh de `last_activity_at`, mantendo o comportamento de inatividade consistente.

**Implementação**:
```typescript
// customer-controller.ts
const sessionId = req.cookies[COOKIE_NAME]
const session = await validateAndRefreshSession(sessionId)
if (!session) return res.status(401).json({ error: { code: "unauthorized" } })
// session.userId disponível
```

---

### 4. Validação de campos no servidor

**Decisão**: Validação manual com funções puras em `customer-service.ts` — sem biblioteca externa.

**Racional**: O projeto não usa Zod no backend ainda (apenas no frontend se necessário). Adicionar Zod seria over-engineering para 3 campos simples. A validação de auth já usa regex manual — manter consistência.

**Regras**:
- `name`: obrigatório, trim, mínimo 2 chars, máximo 100 chars
- `email`: obrigatório, regex de e-mail básico, trim + lowercase, máximo 254 chars
- `phone`: opcional; se fornecido, apenas dígitos/espaços/hífen/parênteses, máximo 20 chars

---

### 5. Estrutura de rotas REST

**Decisão**: Rotas convencionais REST sob `/api/customers`.

| Método | Rota | Ação |
|--------|------|------|
| `GET` | `/api/customers` | Lista clientes do usuário autenticado |
| `POST` | `/api/customers` | Cria novo cliente |
| `GET` | `/api/customers/:id` | Retorna detalhes de um cliente (verifica posse) |

**Racional**: Padrão RESTful mínimo para a feature v1. Consistente com o padrão `/api/auth/*` existente.

---

### 6. Formato de datas

**Decisão**: `created_at` armazenado como ISO 8601 string no SQLite (mesmo padrão da feature de auth).

**Racional**: SQLite não tem tipo DATE nativo; o projeto já usa `new Date().toISOString()` em toda base de auth. Manter consistência.

**Exibição no frontend**: `new Date(created_at).toLocaleDateString('pt-BR')` — sem biblioteca de datas extra.

---

### 7. IDs dos registros

**Decisão**: UUIDs v4 gerados pelo servidor (`uuid` package, já instalado).

**Racional**: Mesmo padrão de `users` e `sessions` — UUID string como PRIMARY KEY TEXT.

---

### 8. Estrutura frontend — feature folder

**Decisão**: `apps/web/src/features/customers/` com barrel `index.ts`.

**Racional**: Segue o padrão da feature `auth` (`apps/web/src/features/auth/`). Agrupa componentes, tipos e chamadas de API da feature em um único diretório. Facilita localização e manutenção.

**Padrão de API calls**: Mesmo padrão de `auth-api.ts` — funções async com `fetch` + `credentials: "include"`.

---

### 9. Roteamento frontend — React Router 7

**Decisão**: Três rotas novas em `App.tsx`, todas encapsuladas em `<ProtectedRoute>`.

```tsx
<Route path="/clientes" element={
  <ProtectedRoute>
    <AppShell>
      <CustomersPage />
    </AppShell>
  </ProtectedRoute>
} />
<Route path="/clientes/novo" element={
  <ProtectedRoute>
    <AppShell>
      <CreateCustomerPage />
    </AppShell>
  </ProtectedRoute>
} />
<Route path="/clientes/:id" element={
  <ProtectedRoute>
    <AppShell>
      <CustomerDetailPage />
    </AppShell>
  </ProtectedRoute>
} />
```

**Racional**: Reutiliza `ProtectedRoute` e `AppShell` existentes — sem novos wrappers de rota necessários. O `AppShell` já provê header com email e logout.

---

### 10. Gerenciamento de estado no frontend

**Decisão**: Estado local com `useState` + `useEffect` por página — sem Context/Redux para v1.

**Racional**: A feature é simples (3 páginas, fluxo linear). Context seria over-engineering. Se o estado precisar ser compartilhado no futuro, pode ser extraído para um `CustomersProvider`.

---

## Perguntas Resolvidas (Clarificações da Spec)

| Pergunta | Resposta | Impacto |
|----------|----------|---------|
| Unicidade de e-mail | Único por usuário (`UNIQUE(user_id, email)`) | RF-010, schema SQL |
| Ponto de entrada do formulário | Página separada `/clientes/novo` | RF-011, App.tsx |
| Campos na listagem | Nome, e-mail, data de cadastro | RF-012, CustomersPage |
| Prevenção de duplo envio | Desabilitar botão durante requisição | RF-013, CreateCustomerPage |
| Empty state da listagem | Mensagem + botão "Adicionar cliente" | RF-014, CustomersPage |

---

## Riscos Identificados

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| CORS cookies entre portas 5173/3001 | Baixa | Proxy Vite já configurado em `vite.config.ts` |
| SQLite bloqueio de escrita concorrente | Muito baixa | Aplicação single-user local; WAL não necessário para v1 |
| Tipos TypeScript duplicados entre server e client | Média | Definir tipos no server; frontend usa tipos próprios compatíveis (sem shared package para v1) |
