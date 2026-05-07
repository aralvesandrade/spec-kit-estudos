# Plano de Implementação: Cadastro de Clientes

**Branch**: `002-customer-registration` | **Data**: 2026-05-06 | **Spec**: [specs/002-customer-registration/spec.md](./spec.md)  
**Input**: Especificação da feature em `specs/002-customer-registration/spec.md`

## Resumo

Implementação de CRUD parcial (criação + listagem + detalhes) de clientes vinculados ao usuário autenticado. O backend expõe três endpoints REST em Express (SQLite), seguindo o mesmo padrão da feature de autenticação: repository → service → controller → route. O frontend adiciona três rotas protegidas (`/clientes`, `/clientes/novo`, `/clientes/:id`) com uma feature folder `apps/web/src/features/customers/`.

## Contexto Técnico

**Linguagem/Versão**: TypeScript 5.9 (strict)  
**Dependências principais**: React 19, React Router DOM 7, Vite 7, TailwindCSS 4, Turborepo 2  
**Biblioteca UI**: `@workspace/ui` — `Button` disponível; sem componentes de tabela/form ainda  
**Testes**: Vitest (`vitest run`) — não obrigatório para feature code, apenas para novos utilitários em `packages/ui/src/lib/`  
**Plataforma alvo**: Web browser (SPA)  
**Tipo de projeto**: Monorepo — React SPA (`apps/web`) + lib compartilhada (`packages/ui`)  
**Metas de performance**: Listagem simples sem paginação (v1); tempo de resposta do servidor < 200ms para operações em SQLite local  
**Constraints**: Node ≥ 22 (usa `node:sqlite`); npm workspaces; fronteiras de pacote aplicadas pela constituição  
**Escopo/Escala**: Feature de app (`apps/web`) apenas — nenhum componente novo em `packages/ui` necessário para v1

## Constitution Check

*GATE: Deve passar antes da pesquisa da Fase 0. Reavaliado após design da Fase 1.*

| Princípio | Status | Observação |
|-----------|--------|------------|
| I. Boundaries de módulo | ✅ PASSA | Feature é app-only; nenhum import de `apps/web` em `packages/ui` |
| II. TypeScript strict | ✅ PASSA | Todos os arquivos novos em `.ts`/`.tsx` com strict ativo |
| III. Propriedade de componente | ✅ PASSA | Componentes específicos da feature vão para `apps/web/src/features/customers/` |
| IV. Convenção de nomes | ✅ PASSA | Todos os arquivos em kebab-case; componentes em PascalCase |
| V. Quality Gates | ✅ PASSA | `turbo typecheck && turbo lint && turbo build` deve passar |
| VI. Testes | ✅ PASSA | Sem novos utilitários em `packages/ui`; testes de feature são opcionais |
| VII. Exports contract | N/A | Nenhum novo export em `packages/ui` necessário |

**Resultado do gate**: APROVADO — sem violações.

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/002-customer-registration/
├── plan.md              # Este arquivo (saída do /speckit.plan)
├── research.md          # Saída da Fase 0 (já existe da feature 001, atualizado)
├── data-model.md        # Saída da Fase 1 (/speckit.plan)
├── quickstart.md        # Saída da Fase 1 (/speckit.plan)
├── contracts/           # Saída da Fase 1 (/speckit.plan)
└── tasks.md             # Saída da Fase 2 (/speckit.tasks — NÃO criado pelo /speckit.plan)
```

### Código-Fonte (raiz do repositório)

**Decisão de estrutura: Opção A — feature app-only**

Nenhum componente novo é necessário em `packages/ui` para v1. Toda a implementação fica em `apps/web/`.

```text
apps/web/
├── server/
│   └── customers/
│       ├── customer-controller.ts     # handlers Express (list, create, getById)
│       ├── customer-repository.ts     # queries SQLite
│       ├── customer-service.ts        # lógica de negócio + validação
│       ├── customer-errors.ts         # códigos e mensagens de erro
│       └── customer-types.ts          # tipos TypeScript (interfaces)
└── src/
    └── features/
        └── customers/
            ├── index.ts               # barrel exports
            ├── customers-types.ts     # tipos frontend (Customer, CustomerForm, etc.)
            ├── customers-api.ts       # fetch calls para /api/customers
            ├── customers-page.tsx     # listagem com empty state
            ├── create-customer-page.tsx # formulário de criação
            └── customer-detail-page.tsx # detalhes de um cliente
```

**Rotas a adicionar em `App.tsx`**:
- `GET /clientes` → `CustomersPage` (protegida)
- `GET /clientes/novo` → `CreateCustomerPage` (protegida)
- `GET /clientes/:id` → `CustomerDetailPage` (protegida)

**Endpoints a adicionar em `server/index.ts`**:
- `GET /api/customers` → `handleListCustomers`
- `POST /api/customers` → `handleCreateCustomer`
- `GET /api/customers/:id` → `handleGetCustomer`
