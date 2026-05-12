# Tasks: Menu Admin para Clientes

**Input**: Design documents from /specs/004-add-admin-menu/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/admin-navigation-contract.md, quickstart.md

**Tests**: Nao ha framework de testes automatizados instalado. Esta feature usa validacao manual (smoke) e quality gates de build/lint/typecheck.

**Organization**: Tasks agrupadas por user story para permitir implementacao e validacao independentes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar baseline tecnico para implementar a feature sem alterar backend ou packages/ui.

- [X] T001 Confirmar escopo frontend-only e registrar arquivos-alvo em specs/004-add-admin-menu/plan.md
- [X] T002 Revisar contratos de navegacao e criterios de aceite em specs/004-add-admin-menu/contracts/admin-navigation-contract.md
- [X] T003 Verificar estado atual das rotas protegidas em apps/web/src/App.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criar estrutura de navegacao admin reutilizavel no modulo de autenticacao antes das historias.

**CRITICAL**: Nenhuma user story deve iniciar antes desta fase estar concluida.

- [X] T004 Criar modelo de itens do menu admin em apps/web/src/features/auth/admin-menu-items.ts
- [X] T005 [P] Criar componente de navegacao admin com NavLink em apps/web/src/features/auth/admin-menu.tsx
- [X] T006 Integrar o componente de menu admin no layout autenticado em apps/web/src/features/auth/app-shell.tsx
- [X] T007 Atualizar exportacoes da feature auth para novos artefatos em apps/web/src/features/auth/index.ts

**Checkpoint**: Estrutura base de menu admin disponivel em todas as telas protegidas.

---

## Phase 3: User Story 1 - Acessar Clientes pelo Menu (Priority: P1) 🎯 MVP

**Goal**: Exibir item Clientes no dashboard e permitir navegacao para a listagem em um clique.

**Independent Test**: Fazer login, abrir dashboard, validar item Clientes visivel no menu e navegar para /clientes ao clicar.

### Implementation for User Story 1

- [X] T008 [US1] Renderizar item Clientes no menu admin com destino /clientes em apps/web/src/features/auth/admin-menu.tsx
- [X] T009 [US1] Garantir consistencia visual e estrutural do menu no shell autenticado em apps/web/src/features/auth/app-shell.tsx
- [X] T010 [P] [US1] Adicionar acao explicita de tentar novamente em erro de listagem em apps/web/src/features/customers/customers-page.tsx
- [X] T011 [US1] Validar fluxo de navegacao do dashboard para clientes sem alterar politicas de auth em apps/web/src/features/auth/protected-route.tsx

**Checkpoint**: User Story 1 funcional e validavel de forma independente.

---

## Phase 4: User Story 2 - Identificar Contexto de Navegacao (Priority: P2)

**Goal**: Destacar visualmente que o usuario esta na secao de clientes quando estiver em /clientes.

**Independent Test**: Navegar para /clientes e confirmar destaque do item Clientes como ativo no menu.

### Implementation for User Story 2

- [X] T012 [US2] Implementar estado ativo por rota com NavLink e estilos de destaque em apps/web/src/features/auth/admin-menu.tsx
- [X] T013 [P] [US2] Cobrir rotas relacionadas a clientes (ex.: /clientes/novo e /clientes/:id) no matching de ativo em apps/web/src/features/auth/admin-menu-items.ts
- [X] T014 [US2] Refinar semantica de navegacao (aria-current e rotulo de secao) em apps/web/src/features/auth/app-shell.tsx

**Checkpoint**: Contexto de navegacao para clientes fica claro e consistente no dashboard.

---

## Phase 5: User Story 3 - Comportamento de Rotas Invalidas (Priority: P3)

**Goal**: Manter fluxo do usuario autenticado ao acessar rotas inexistentes, redirecionando para rota valida do dashboard.

**Independent Test**: Com sessao autenticada, acessar rota invalida e validar redirect para /.

### Implementation for User Story 3

- [X] T015 [US3] Preservar fallback global de rotas invalidas para / com replace em apps/web/src/App.tsx
- [X] T016 [US3] Garantir que rotas de clientes continuem protegidas para usuarios nao autenticados em apps/web/src/features/auth/protected-route.tsx
- [X] T017 [P] [US3] Ajustar composicao de rotas protegidas para evitar regressao de navegacao no shell em apps/web/src/App.tsx

**Checkpoint**: Rotas invalidas e acesso nao autenticado seguem comportamento esperado.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Fechamento da feature com validacao end-to-end e qualidade.

- [X] T018 Revisar checklist de smoke tests da feature em specs/004-add-admin-menu/quickstart.md
- [X] T019 Executar npm run format referenciado em ./package.json
- [X] T020 Executar npm run typecheck referenciado em ./package.json
- [X] T021 Executar npm run lint referenciado em ./package.json
- [X] T022 Executar npm run build referenciado em ./package.json
- [X] T023 Atualizar notas finais de implementacao e evidencias em specs/004-add-admin-menu/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1: Sem dependencias.
- Phase 2: Depende da Phase 1 e bloqueia todas as user stories.
- Phase 3 (US1): Depende da Phase 2.
- Phase 4 (US2): Depende da base entregue em US1.
- Phase 5 (US3): Depende da estrutura de rotas consolidada nas fases anteriores.
- Phase 6: Depende da conclusao das user stories selecionadas.

### User Story Dependencies

- US1 (P1): MVP, entrega valor imediato.
- US2 (P2): Depende do menu existente da US1 para aplicar destaque ativo.
- US3 (P3): Pode ser implementada apos consolidacao do roteamento da US1/US2.

### Parallel Opportunities (Examples by Story)

- US1: T010 pode rodar em paralelo com T009 (arquivos diferentes: customers-page e app-shell).
- US2: T013 pode rodar em paralelo com T012 (arquivos diferentes: admin-menu-items e admin-menu).
- US3: T017 pode rodar em paralelo com T016 apos definicao do fallback em T015.

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1 e Phase 2.
2. Implementar apenas Phase 3 (US1).
3. Validar navegacao menu -> /clientes e comportamento de erro/retry.
4. Demonstrar entrega minima utilizavel.

### Incremental Delivery

1. Entregar US1 (menu e acesso).
2. Entregar US2 (contexto ativo e usabilidade).
3. Entregar US3 (robustez de fallback e auth).
4. Finalizar com quality gates da Phase 6.

## Notes

- Tasks com [P] podem ser executadas em paralelo quando nao houver conflito de arquivo.
- Cada tarefa inclui caminho de arquivo para permitir execucao direta por agente.
- Nao incluir tarefas de teste automatizado enquanto Vitest nao for adicionado no projeto.
