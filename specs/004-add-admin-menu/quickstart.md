# Quickstart: Menu Admin para Clientes

**Feature**: 004-add-admin-menu  
**Data**: 2026-05-12

## Objetivo

Adicionar item de menu administrativo para acesso a clientes no layout autenticado, com estado ativo e sem regressao de protecao de rotas.

## Etapas de implementacao

1. Atualizar `AppShell` para incluir bloco de navegacao admin.
2. Adicionar link para `/clientes` com destaque de estado ativo (`NavLink`).
3. Garantir consistencia visual do menu em todas as paginas protegidas renderizadas no shell.
4. Validar que o fallback de rota invalida permanece redirecionando para `/`.
5. Validar que acesso nao autenticado a `/clientes` continua redirecionando para `/login`.
6. Confirmar que, em erro de listagem, a pagina de clientes permanece no contexto com mensagem e acao de nova tentativa.

## Verificacao manual (smoke)

1. Login valido e abertura do dashboard.
2. Confirmar exibicao do item `Clientes` no menu admin.
3. Clicar no item e validar navegacao para `/clientes` em 1 clique.
4. Na tela `/clientes`, confirmar item `Clientes` destacado como ativo.
5. Acessar rota invalida autenticado (ex.: `/rota-inexistente`) e validar redirect para `/`.
6. Fazer logout e acessar `/clientes` diretamente; validar redirect para `/login`.
7. Simular indisponibilidade da API de clientes e validar mensagem de erro com CTA de retry sem sair da tela.

## Quality gates

Executar na raiz do monorepo:

```bash
npm run typecheck
npm run lint
npm run build
npm run format
```
