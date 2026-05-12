# Implementation Plan: Menu Admin para Clientes

**Branch**: `004-add-admin-menu` | **Date**: 2026-05-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-add-admin-menu/spec.md`

## Summary

Adicionar navegação administrativa persistente no layout autenticado para acesso à listagem de clientes, mantendo proteção de rotas existente, destaque visual da seção ativa e fallback consistente para rotas inválidas. A implementação será exclusivamente frontend em `apps/web`, com ajuste no `AppShell` para incorporar o menu e possível refinamento de roteamento para preservar comportamento esperado de redirecionamento.

## Technical Context

**Language/Version**: TypeScript 5.x (strict)
**Frontend**: React 19, Vite 7, TailwindCSS 4, React Router DOM 7
**UI Library**: `@workspace/ui` (Button já utilizado no shell)
**Backend**: Sem alteração nesta feature
**Testing**: Não há framework de testes instalado (seguir constituição)
**Target Platform**: SPA Web (área autenticada do dashboard)
**Project Type**: Monorepo (frontend + BFF), escopo desta feature: frontend-only em `apps/web/src/`
**Performance Goals**: Renderização do menu sem impacto perceptível na navegação; transição para `/clientes` em fluxo de 1 clique a partir do dashboard
**Constraints**: Respeitar rotas protegidas existentes (`ProtectedRoute`), nomes kebab-case, não introduzir dependência reversa para `packages/ui`
**Scale/Scope**: Pequeno a médio; mudanças concentradas em layout autenticado (`AppShell`), possíveis ajustes de estrutura de rotas em `App.tsx` e estado ativo do item de navegação

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Observação |
|-----------|--------|------------|
| I. Monorepo Module Boundaries | PASS | Mudanças somente em `apps/web`; nenhuma importação de caminho interno de `packages/ui` |
| II. TypeScript Strict | PASS | Implementação em TypeScript sem necessidade de `any` |
| III. Component Ownership | PASS | Menu admin é composição específica da aplicação; permanece em `apps/web` |
| IV. Naming Conventions | PASS | Novos arquivos (se houver) serão kebab-case |
| V. Quality Gates | PASS | `typecheck`, `lint`, `build`, `format` serão executados após implementação |
| VI. Testing | PASS | Sem referência a runner de testes inexistente |
| VII. Package Exports Contract | PASS | Nenhum novo export em `packages/ui` |
| IX. API Contract | PASS | Sem novo endpoint REST |

**Resultado pós-design**: Sem violações de constituição; pronto para geração de tasks.

## Project Structure

### Documentation (this feature)

```text
specs/004-add-admin-menu/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── admin-navigation-contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/web/src/
├── App.tsx                               # possível ajuste de composição de rotas protegidas
├── features/auth/app-shell.tsx           # inclui menu admin com estado ativo
└── features/customers/                   # rota destino permanece existente
```

**Structure Decision**: Option A (frontend-only). A feature adiciona navegação e contexto visual no dashboard autenticado sem criar primitivos reutilizáveis no `packages/ui` e sem mudanças no backend.

## Complexity Tracking

> Sem violações de constituição identificadas.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Implementation Notes (2026-05-12)

### Escopo confirmado

Feature implementada em frontend-only no modulo `apps/web`, sem alteracoes de backend relacionadas ao contrato da feature e sem mudancas em `packages/ui`.

### Arquivos-alvo implementados

- `apps/web/src/features/auth/admin-menu-items.ts`
- `apps/web/src/features/auth/admin-menu.tsx`
- `apps/web/src/features/auth/app-shell.tsx`
- `apps/web/src/features/auth/index.ts`
- `apps/web/src/features/customers/customers-page.tsx`
- `apps/web/src/App.tsx`

### Ajustes complementares para quality gates

- `apps/web/tsconfig.app.json` (`ignoreDeprecations` ajustado para valor valido no TypeScript atual)
- `apps/web/server/customers/customer-repository.ts` (casts explicitos para compatibilidade de tipagem no build)
- `.gitignore`, `.prettierignore`, `apps/web/eslint.config.js`, `packages/ui/eslint.config.js` (padroes de ignore verificados/completados)

### Evidencias de validacao

- `npm run format`: sucesso
- `npm run typecheck`: sucesso
- `npm run lint`: sucesso
- `npm run build`: sucesso

### Resultado

Menu admin com item `Clientes` integrado ao shell autenticado, estado ativo em rotas de clientes, fallback global preservado para rotas invalidas e CTA explicito de retry em erro de listagem.
