# Data Model: Menu Admin para Clientes

**Feature**: 004-add-admin-menu  
**Fase**: Phase 1 - Design  
**Data**: 2026-05-12

## Entidades de interface

### 1. AdminMenuItem

Representa uma entrada de navegacao no menu administrativo da area autenticada.

| Campo | Tipo | Regras |
|------|------|--------|
| `id` | `"clientes"` | Unico no escopo desta feature |
| `label` | `string` | Obrigatorio; valor esperado: `Clientes` |
| `to` | `"/clientes"` | Deve apontar para rota protegida valida |
| `requiresAuth` | `boolean` | Sempre `true` |
| `isActive` | `boolean` | Derivado do estado de rota atual |

### 2. DashboardNavigationState

Estado de navegacao visivel no `AppShell`.

| Campo | Tipo | Origem |
|------|------|--------|
| `currentPath` | `string` | `location.pathname`/`NavLink` |
| `activeItemId` | `"clientes" \| null` | Derivado de correspondencia de rota |
| `authenticated` | `boolean` | `AuthProvider` (`state.status`) |

### 3. RouteAccessOutcome

Resultado esperado de acesso para rotas relacionadas ao menu.

| Condicao | Resultado |
|----------|-----------|
| Usuario autenticado acessa `/clientes` | Renderiza `AppShell` + `CustomersPage` |
| Usuario nao autenticado acessa `/clientes` | `Navigate` para `/login` |
| Usuario autenticado acessa rota invalida | `Navigate` para `/` |

## Regras e validacoes

- Nao pode haver item duplicado de `Clientes` no menu administrativo.
- Item `Clientes` deve aparecer em todas as telas protegidas renderizadas dentro de `AppShell`.
- Destaque visual de item ativo deve ser deterministicamente derivado da rota atual.
- O menu nao altera regras de autorizacao: autenticacao continua centralizada em `ProtectedRoute`.

## Transicoes de estado

```text
[Authenticated + rota != /clientes]
  -> clique em "Clientes"
[Authenticated + rota /clientes]
  -> item "Clientes" ativo

[Unauthenticated + acesso direto /clientes]
  -> redirect /login

[Authenticated + rota invalida]
  -> redirect /
```
