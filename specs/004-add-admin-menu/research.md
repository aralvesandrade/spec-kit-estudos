# Research: Menu Admin para Clientes

**Feature**: 004-add-admin-menu  
**Fase**: Phase 0 - Research  
**Data**: 2026-05-12

## 1. Objetivos de performance e navegação

**Decision**: Tratar a feature como melhoria de navegação de baixa complexidade, com foco em resposta imediata de UI: item de menu visível no primeiro paint da area autenticada e acesso a `/clientes` em 1 clique.

**Rationale**: A especificacao define sucesso em descoberta e acesso da listagem, nao em throughput. O fluxo usa React Router client-side, sem nova chamada de rede para abrir a rota.

**Alternatives considered**:
- Adicionar metrica de tempo estrita (ex.: < 100 ms): descartado por nao haver requisito formal na spec para essa medicao.
- Introduzir lazy loading especifico para o menu: descartado por custo desnecessario para escopo pequeno.

## 2. Escopo tecnico real da feature

**Decision**: Escopo frontend-only no `apps/web`, com alteracoes concentradas em roteamento/layout autenticado.

**Rationale**: A rota de clientes ja existe (`/clientes`, `/clientes/novo`, `/clientes/:id`), assim como `ProtectedRoute`. A feature adiciona ponto de entrada (menu) e indicacao de estado ativo.

**Alternatives considered**:
- Criar novo endpoint backend para menu: descartado, nao ha necessidade funcional.
- Migrar menu para `packages/ui`: descartado, pois estrutura de navegacao e especifica do app web atual.

## 3. Padrao para item ativo e consistencia visual

**Decision**: Usar `NavLink` do React Router com classe condicional por `isActive` para destacar o item "Clientes" no menu do dashboard.

**Rationale**: `NavLink` e o padrao nativo do React Router para estado ativo, reduz logica manual e evita divergencia visual entre paginas protegidas.

**Alternatives considered**:
- Comparar `location.pathname` manualmente: descartado por maior chance de regressao em rotas aninhadas.

## 4. Tratamento de rota invalida

**Decision**: Manter fallback global `path="*" -> Navigate to "/" replace`, preservando retorno para rota valida do dashboard quando autenticado.

**Rationale**: O comportamento ja esta implementado e atende FR-006 sem necessidade de nova politica de roteamento.

**Alternatives considered**:
- Redirecionar rota invalida para `/clientes`: descartado para evitar surpreender usuarios fora do contexto de clientes.

## 5. Comportamento em indisponibilidade da listagem

**Decision**: Reutilizar padrao existente em `CustomersPage`: permanecer na tela, exibir erro e oferecer nova tentativa.

**Rationale**: A pagina ja utiliza TanStack Query e componente `Alert`; basta garantir CTA claro de retry para aderencia plena ao FR-007.

**Alternatives considered**:
- Redirecionar para home em erro: descartado por quebrar contexto do usuario.
