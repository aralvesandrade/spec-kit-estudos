# Contract: Navegacao Admin - Clientes

**Feature**: 004-add-admin-menu  
**Tipo**: UI Navigation Contract  
**Escopo**: `apps/web` (SPA autenticada)

## 1. Exposicao de navegacao

A area autenticada do dashboard deve expor um menu administrativo com item:

- `label`: `Clientes`
- `route`: `/clientes`
- `visibility`: usuarios autenticados
- `active-state`: destacado quando rota atual for `/clientes` (ou subrotas associadas, quando aplicavel)

## 2. Regras de acesso

- Rotas de clientes sao protegidas por autenticacao.
- Usuario nao autenticado em `/clientes` deve receber redirecionamento para `/login`.
- Rota invalida em sessao autenticada deve redirecionar para `/`.

## 3. Contrato de comportamento de erro

Quando a listagem de clientes estiver indisponivel:

- Permanecer na rota `/clientes`.
- Exibir mensagem de erro clara ao usuario.
- Exibir acao explicita para tentar novamente a consulta.

## 4. Criterios de aceitacao verificaveis

1. Em sessao autenticada, o item `Clientes` aparece no menu em 100% dos acessos ao dashboard.
2. Clicar no item `Clientes` navega para `/clientes` em ate 2 cliques (esperado: 1 clique).
3. Em `/clientes`, o item `Clientes` aparece visualmente ativo.
4. Em acesso nao autenticado a `/clientes`, ocorre redirect para `/login`.
