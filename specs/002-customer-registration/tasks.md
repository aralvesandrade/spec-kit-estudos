---
description: "Lista de tarefas para implementação do Cadastro de Clientes"
---

# Tasks: Cadastro de Clientes

**Input**: Artefatos de design de `specs/002-customer-registration/`  
**Pré-requisitos**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅ · quickstart.md ✅

**Testes**: Não solicitados nesta feature.  
**Organização**: Tarefas agrupadas por user story para implementação e teste independentes.

## Formato: `[ID] [P?] [Story?] Descrição`

- **[P]**: Pode ser executado em paralelo (arquivos diferentes, sem dependências incompletas)
- **[Story]**: User story correspondente (US1, US2, US3)
- Todos os caminhos são relativos à raiz do repositório

---

## Fase 1: Setup

**Objetivo**: Verificar linha de base limpa antes de qualquer implementação

- [X] T001 Verificar que `turbo typecheck && turbo lint` passam na branch atual (linha de base limpa)

**Checkpoint**: Linha de base confirmada — implementação pode começar

---

## Fase 2: Fundação — Backend (Pré-requisito para todas as user stories)

**Objetivo**: Infraestrutura de dados e endpoints REST que todas as user stories dependem

**⚠️ CRÍTICO**: Nenhuma user story pode começar antes desta fase estar completa

- [X] T002 Adicionar DDL da tabela `customers` + índice `idx_customers_user_id` ao final de `apps/web/server/db/schema.sql`
- [X] T003 [P] Criar `apps/web/server/customers/customer-types.ts` com interfaces: `Customer`, `CreateCustomerInput`, `CustomerValidationError`, `CustomerErrorCode`, `CustomerError`
- [X] T004 [P] Criar `apps/web/server/customers/customer-errors.ts` com objeto `CUSTOMER_ERRORS` (constantes de mensagens PT-BR para todos os `CustomerErrorCode`)
- [X] T005 Criar `apps/web/server/customers/customer-repository.ts` com funções: `findCustomersByUserId(userId)`, `findCustomerById(id, userId)`, `createCustomer(customer)` — usando `db` de `../db/client.ts`
- [X] T006 Criar `apps/web/server/customers/customer-service.ts` com funções: `validateCreateCustomerInput(input)` → `CustomerValidationError[]`, `listCustomers(userId)`, `createCustomer(userId, input)`, `getCustomer(userId, customerId)` — recebe `userId` já extraído pelo controller; sem dependência de `session-service.ts`
- [X] T007 Criar `apps/web/server/customers/customer-controller.ts` com handlers Express: `handleListCustomers`, `handleCreateCustomer`, `handleGetCustomer` — cada um valida sessão via cookie `auth_session` e delega ao service
- [X] T008 Registrar as 3 rotas em `apps/web/server/index.ts`: `GET /api/customers`, `POST /api/customers`, `GET /api/customers/:id`

**Checkpoint**: Backend pronto — `npm run server` inicia sem erros; rotas respondem 401 sem sessão; verificar isolamento: criar clientes com usuário A e confirmar que chamada a `GET /api/customers` com sessão do usuário B não os retorna (CS-003)

---

## Fase 3: User Story 1 — Listar Clientes (P1) 🎯 MVP

**Objetivo**: Usuário autenticado vê a lista de seus clientes com nome, e-mail e data de cadastro; lista vazia exibe empty state

**Teste Independente**: Autenticar com `admin@example.com` / `Admin@123`, acessar `/clientes` — sem clientes: exibe empty state com botão "Adicionar cliente"; com clientes (via seed manual): exibe tabela com 3 colunas

- [X] T009 [P] Criar `apps/web/src/features/customers/customers-types.ts` com interfaces: `Customer`, `CustomerFormData`, `CustomerError`, `ListCustomersResult`, `CreateCustomerResult`, `GetCustomerResult`
- [X] T010 [P] Criar `apps/web/src/features/customers/customers-api.ts` com funções: `listCustomersApi()`, `createCustomerApi(data)`, `getCustomerApi(id)` — todas usando `credentials: "include"` e fetch para `/api/customers`
- [X] T011 Criar `apps/web/src/features/customers/customers-page.tsx` — exibe lista com colunas nome, e-mail e data de cadastro (RF-012); quando lista vazia, exibe empty state com mensagem e botão "Adicionar cliente" → `/clientes/novo` (RF-014); usa `listCustomersApi()` em `useEffect`
- [X] T012 Criar `apps/web/src/features/customers/index.ts` com barrel exports apenas do que já existe: `CustomersPage` de `./customers-page.tsx`, tipos de `./customers-types.ts` — `CreateCustomerPage` e `CustomerDetailPage` serão adicionados em T016 e T020 respectivamente
- [X] T013 Adicionar rota `/clientes` em `apps/web/src/App.tsx` encapsulada em `<ProtectedRoute><AppShell><CustomersPage /></AppShell></ProtectedRoute>`
- [X] T014 Executar `turbo typecheck && turbo lint && turbo build` — todos devem passar

**Checkpoint**: US1 completamente funcional — listagem e empty state funcionam de forma independente

---

## Fase 4: User Story 2 — Criar Novo Cliente (P1)

**Objetivo**: Usuário autenticado preenche formulário, cria cliente e é redirecionado para `/clientes`; botão desabilitado durante envio; e-mail duplicado exibe erro

**Teste Independente**: Na rota `/clientes/novo`, preencher nome e e-mail válidos → submit → cliente aparece na lista; tentar mesmo e-mail → erro "Já existe um cliente com este e-mail"

- [X] T015 [US2] Criar `apps/web/src/features/customers/create-customer-page.tsx` — formulário com campos nome (obrigatório), e-mail (obrigatório) e telefone (opcional); botão "Salvar" desabilitado enquanto `isSubmitting` (RF-013); ao sucesso redireciona para `/clientes` via `useNavigate`; exibe erros de campo (ex: e-mail duplicado, RF-010) e, para erros não-validação (ex: servidor indisponível), exibe mensagem com botão ou texto "Tente novamente" (RF-007)
- [X] T016 [US2] Atualizar `apps/web/src/features/customers/index.ts` — adicionar export de `CreateCustomerPage` de `./create-customer-page.tsx`
- [X] T017 [US2] Adicionar rota `/clientes/novo` em `apps/web/src/App.tsx` encapsulada em `<ProtectedRoute><AppShell><CreateCustomerPage /></AppShell></ProtectedRoute>` — posicionar **antes** da rota `/clientes/:id`
- [X] T018 [US2] Executar `turbo typecheck && turbo lint && turbo build` — todos devem passar

**Checkpoint**: US1 + US2 funcionam — criação e listagem operam de forma independente

---

## Fase 5: User Story 3 — Ver Detalhes do Cliente (P2)

**Objetivo**: Usuário clica em um cliente da lista e é levado a `/clientes/:id` com todos os dados; acesso a ID de outro usuário retorna 404

**Teste Independente**: Na listagem, clicar em um cliente existente → exibe tela de detalhes com nome, e-mail, telefone e data de cadastro; navegar diretamente para `/clientes/id-inexistente` → exibe mensagem de não encontrado

- [X] T019 [US3] Criar `apps/web/src/features/customers/customer-detail-page.tsx` — lê `id` via `useParams`, chama `getCustomerApi(id)`, exibe todos os campos do cliente (nome, e-mail, telefone, data de cadastro); exibe mensagem de erro se 404; inclui link "← Voltar para clientes"
- [X] T020 [US3] Atualizar `apps/web/src/features/customers/index.ts` — adicionar export de `CustomerDetailPage` de `./customer-detail-page.tsx`
- [X] T021 [US3] Atualizar `apps/web/src/features/customers/customers-page.tsx` — cada linha da tabela deve ser um link navegável para `/clientes/:id` via `<Link>` do React Router
- [X] T022 [US3] Adicionar rota `/clientes/:id` em `apps/web/src/App.tsx` encapsulada em `<ProtectedRoute><AppShell><CustomerDetailPage /></AppShell></ProtectedRoute>`
- [X] T023 [US3] Executar `turbo typecheck && turbo lint && turbo build` — todos devem passar

**Checkpoint**: Todas as 3 user stories funcionam — fluxo completo de listagem, criação e detalhes

---

## Fase 6: Polimento e Verificação Final

**Objetivo**: Quality gates finais e limpeza de código

- [X] T024 [P] Executar `turbo format` em todos os pacotes modificados (`apps/web`, `packages/ui` se tocado)
- [X] T025 Executar `turbo typecheck && turbo lint && turbo build` — validação final completa; todos devem passar com zero erros
- [X] T026 [P] Remover `console.log`s de debug, código morto e imports não utilizados nos arquivos modificados

---

## Dependências e Ordem de Execução

### Dependências entre Fases

- **Setup (Fase 1)**: Sem dependências — iniciar imediatamente
- **Fundação (Fase 2)**: Depende da conclusão do Setup — **bloqueia todas as user stories**
- **US1 (Fase 3)**: Depende da Fundação — sem dependência de US2 ou US3
- **US2 (Fase 4)**: Depende da Fundação — sem dependência de US1 (mas US1 primeiro por MVP)
- **US3 (Fase 5)**: Depende da Fundação + US1 (necessita link na listagem)
- **Polimento (Fase 6)**: Depende de todas as user stories desejadas estarem completas

### Dependências entre User Stories

- **US1 (P1)**: Pode iniciar após Fundação — independente
- **US2 (P1)**: Pode iniciar após Fundação — independente; integra com US1 via redirect
- **US3 (P2)**: Pode iniciar após Fundação — requer atualização de `customers-page.tsx` de US1

### Dentro de Cada User Story

- Types/API antes de componentes de página
- Core do componente antes de integração de rotas
- Integração de rota antes de quality gate

### Oportunidades de Paralelismo

- T003 e T004 (Fase 2): arquivos diferentes — paralelizáveis
- T009 e T010 (Fase 3): arquivos diferentes — paralelizáveis
- T024 e T026 (Fase 6): independentes — paralelizáveis
- Com dois desenvolvedores: US2 e US3 podem avançar em paralelo após US1

---

## Exemplo de Paralelismo — Fase 2

```bash
# Executar em paralelo (arquivos diferentes):
Tarefa: "Criar customer-types.ts em apps/web/server/customers/customer-types.ts"
Tarefa: "Criar customer-errors.ts em apps/web/server/customers/customer-errors.ts"

# Aguardar conclusão, depois continuar em sequência:
Tarefa: "Criar customer-repository.ts em apps/web/server/customers/customer-repository.ts"
Tarefa: "Criar customer-service.ts em apps/web/server/customers/customer-service.ts"
Tarefa: "Criar customer-controller.ts em apps/web/server/customers/customer-controller.ts"
```

## Exemplo de Paralelismo — Fase 3 (US1)

```bash
# Executar em paralelo (arquivos diferentes):
Tarefa: "Criar customers-types.ts em apps/web/src/features/customers/customers-types.ts"
Tarefa: "Criar customers-api.ts em apps/web/src/features/customers/customers-api.ts"

# Aguardar conclusão, depois continuar:
Tarefa: "Criar customers-page.tsx em apps/web/src/features/customers/customers-page.tsx"
```

---

## Estratégia de Implementação

### MVP Primeiro (apenas US1 + US2)

1. Concluir Fase 1: Setup
2. Concluir Fase 2: Fundação (CRÍTICO — bloqueia tudo)
3. Concluir Fase 3: US1 — Listagem
4. Concluir Fase 4: US2 — Criação
5. **PARAR E VALIDAR**: Fluxo completo de criação e listagem funcionando
6. Prosseguir para US3 somente se aprovado

### Entrega Incremental

1. Setup + Fundação → Backend pronto para todos os endpoints
2. US1 → Listagem funcional → Validar independentemente
3. US2 → Criação funcional → Validar fluxo criação→listagem
4. US3 → Detalhes funcionais → Validar fluxo completo
5. Polimento final → Quality gates 100%

---

## Notas

- `[P]` = tarefas diferentes arquivos, sem dependências incompletas entre si
- Label `[USN]` mapeia cada tarefa à user story correspondente para rastreabilidade
- Cada user story deve ser completamente testável de forma independente ao finalizar sua fase
- Commit após cada fase ou grupo lógico de tarefas
- Parar em cada checkpoint para validar a story antes de avançar
- Evitar: tarefas vagas, conflitos no mesmo arquivo entre tarefas paralelas, dependências entre stories que quebrem a independência
