# Feature Specification: Menu Admin para Clientes

**Feature Branch**: `004-add-admin-menu`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "add menu admin, incluir menu na tela de dashboard para listar os clientes"

## Module Placement

- [x] `apps/web/src/` — frontend: pages, feature components, or routes
- [ ] `apps/web/server/` — backend: new Express endpoint, domain, or schema change
- [ ] `packages/ui/` — reusable component or utility added to shared lib
- [ ] Both frontend and backend (full-stack feature)
- [ ] Both `packages/ui` and `apps/web` (requires new `@workspace/ui` export)

## Clarifications

### Session 2026-05-12

- Q: Quem deve visualizar o menu de clientes? → A: Todo usuário autenticado.
- Q: Como tratar indisponibilidade da listagem de clientes? → A: Permanecer na tela com mensagem de erro e ação para tentar novamente.
- Q: Como indicar contexto de navegação na seção de clientes? → A: Destacar o item "Clientes" como ativo no menu.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acessar Clientes pelo Menu (Priority: P1)

Como usuário autenticado no dashboard, quero ver uma opção de menu para clientes e acessá-la com um clique para abrir a tela de listagem de clientes.

**Why this priority**: É o objetivo central da solicitação e entrega valor imediato de navegação para a funcionalidade de clientes.

**Independent Test**: Pode ser testado de forma independente ao autenticar no dashboard, verificar a presença do item de menu e clicar para abrir a listagem de clientes.

**Acceptance Scenarios**:

1. **Given** usuário autenticado visualizando o dashboard, **When** o menu principal é exibido, **Then** a opção de clientes está visível no menu administrativo.
2. **Given** usuário autenticado visualizando o dashboard, **When** clica na opção de clientes, **Then** é direcionado para a tela de listagem de clientes.

---

### User Story 2 - Identificar Contexto de Navegação (Priority: P2)

Como usuário autenticado, quero saber que estou na seção correta ao navegar para clientes para reduzir erros de navegação.

**Why this priority**: Melhora a usabilidade e evita confusão em áreas com múltiplas opções administrativas.

**Independent Test**: Pode ser testado navegando para a listagem de clientes a partir do menu e verificando se o contexto da seção fica claro na interface.

**Acceptance Scenarios**:

1. **Given** usuário na tela de listagem de clientes, **When** a navegação do dashboard é exibida, **Then** a seção de clientes fica claramente identificável como destino selecionado.

---

### User Story 3 - Comportamento de Rotas Inválidas (Priority: P3)

Como usuário autenticado, quero que links inválidos não quebrem meu fluxo, para retornar a uma tela válida do dashboard.

**Why this priority**: Mantém a consistência de navegação e evita bloqueios de uso.

**Independent Test**: Pode ser testado acessando uma rota inexistente e validando o redirecionamento para uma área válida do dashboard.

**Acceptance Scenarios**:

1. **Given** usuário autenticado acessa uma rota inválida, **When** o sistema processa a rota, **Then** o usuário é redirecionado para uma rota válida do dashboard.

### Edge Cases

- O menu administrativo não deve exibir item duplicado de clientes quando o usuário já estiver na rota de listagem.
- Se o usuário não estiver autenticado e tentar acessar a rota de clientes diretamente, deve ser redirecionado para login.
- Se a listagem de clientes estiver temporariamente indisponível, o usuário deve permanecer na tela de clientes com mensagem de erro clara e ação de "tentar novamente".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir no dashboard um item de menu para acesso à listagem de clientes para todo usuário autenticado.
- **FR-002**: O sistema MUST permitir que o usuário autenticado navegue para a tela de listagem de clientes a partir desse item de menu.
- **FR-003**: O sistema MUST manter consistência visual e estrutural do menu administrativo em todas as telas protegidas do dashboard.
- **FR-004**: O sistema MUST indicar claramente, na navegação, quando a seção de clientes estiver ativa, destacando o item "Clientes" no menu.
- **FR-005**: O sistema MUST impedir acesso à rota de clientes por usuários não autenticados, redirecionando para login.
- **FR-006**: O sistema MUST redirecionar rotas inválidas para uma rota válida protegida do dashboard.
- **FR-007**: O sistema MUST, em caso de indisponibilidade temporária da listagem, manter o usuário na tela de clientes exibindo mensagem de erro e ação de nova tentativa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos usuários autenticados visualizam o item de menu de clientes ao acessar o dashboard.
- **SC-002**: 95% das tentativas de navegação para clientes via menu são concluídas em até 2 cliques.
- **SC-003**: 90% dos usuários conseguem chegar à listagem de clientes sem necessidade de suporte na primeira tentativa.
- **SC-004**: 100% dos acessos não autenticados à rota de clientes são redirecionados para login.

## Assumptions

- O termo "menu admin" refere-se ao menu principal da área autenticada do dashboard.
- O item de clientes no menu será visível para qualquer usuário autenticado nesta entrega.
- A tela de listagem de clientes já existe e permanece como destino oficial de navegação.
- A proteção de rotas autenticadas já existente será reutilizada sem alteração de política de acesso.

## Constitution Check

- [x] Module placement follows dependency rules (`apps/web` → `@workspace/ui`, never reversed)
- [x] New shared components/hooks go to `packages/ui/src/`, app-specific go to `apps/web/src/features/<feature>/`
- [x] File names use kebab-case
- [x] New `packages/ui` exports added to `package.json#exports`
- [x] Backend domains (if any) follow layered pattern: controller → service → repository
- [x] New SQLite schema changes added to `apps/web/server/db/schema.sql`
- [x] New API endpoints registered in `apps/web/server/index.ts` and documented in contracts/
- [x] `npm run typecheck && npm run lint && npm run build` will pass after implementation
