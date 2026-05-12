# Feature Specification: Integração shadcn/ui — Biblioteca de Componentes Admin

**Feature Branch**: `003-add-shadcn`
**Criado em**: 12 de maio de 2026
**Status**: Draft
**Referência**: [shadcn-admin-kit](https://github.com/marmelab/shadcn-admin-kit)

## Posicionamento no Módulo

- [x] `packages/ui/` — componentes reutilizáveis e utilitários adicionados à lib compartilhada
- [x] `apps/web/` — páginas e features existentes migradas para usar os novos componentes
- [x] Ambos (novos exports em `@workspace/ui` consumidos por `apps/web`)

## Contexto & Problema

O monorepo já possui uma configuração inicial do shadcn/ui (`components.json`, `button.tsx`) e as dependências base instaladas (`class-variance-authority`, `radix-ui`, `tailwind-merge`). No entanto, as páginas de administração de clientes (`customers-page.tsx`, `create-customer-page.tsx`, `customer-detail-page.tsx`) ainda usam HTML puro sem componentes de design system padronizados.

Sem uma biblioteca de componentes consistente:
- Cada página implementa seus próprios estilos de tabela, formulário e layout
- Não há padronização visual entre as telas
- A manutenção é difícil e prolixa

O objetivo é completar a integração do shadcn/ui no `packages/ui`, seguindo o padrão arquitetural do [shadcn-admin-kit](https://github.com/marmelab/shadcn-admin-kit), e usar esses componentes nas páginas existentes.

## User Scenarios & Testing *(obrigatório)*

### User Story 1 — Visualização de lista de clientes em tabela padronizada (Prioridade: P1)

O administrador acessa a página de clientes e visualiza os dados em uma tabela com colunas bem definidas, suporte a paginação e aparência consistente com o design system.

**Por que essa prioridade**: A listagem é o ponto de entrada principal da área de clientes. É a funcionalidade mais usada e a que mais se beneficia de um componente DataTable padronizado.

**Teste independente**: Pode ser testado acessando `/customers` e verificando que a tabela exibe os clientes com colunas formatadas, sem necessidade de outras telas.

**Acceptance Scenarios**:

1. **Dado** que existem clientes cadastrados, **Quando** o administrador navega para `/customers`, **Então** os clientes são exibidos em uma tabela com colunas: Nome, E-mail, Telefone e Ações, com no máximo 20 registros por página vindos do servidor.
2. **Dado** que a tabela está carregando, **Quando** os dados ainda não chegaram, **Então** um estado de loading visual é exibido no lugar das linhas.
3. **Dado** que não há clientes cadastrados, **Quando** o administrador acessa `/customers`, **Então** uma mensagem de "Nenhum cliente encontrado" é exibida no lugar da tabela vazia.

---

### User Story 2 — Formulário de criação de cliente com validação visual (Prioridade: P2)

O administrador preenche o formulário de criação de cliente e recebe feedback visual imediato sobre campos inválidos, utilizando componentes de input, label e mensagem de erro padronizados.

**Por que essa prioridade**: A criação é o segundo fluxo mais crítico. Formulários com validação visual consistente reduzem erros e melhoram a experiência do administrador.

**Teste independente**: Pode ser testado acessando `/customers/new`, preenchendo campos inválidos e verificando as mensagens de erro — independente da listagem funcionar.

**Acceptance Scenarios**:

1. **Dado** que o formulário está vazio, **Quando** o administrador tenta submeter, **Então** campos obrigatórios são destacados com borda vermelha e mensagem de erro abaixo de cada campo.
2. **Dado** que o administrador preencheu todos os campos corretamente, **Quando** submete o formulário, **Então** o cliente é criado e o administrador é redirecionado para a lista de clientes.
3. **Dado** que o formulário tem um campo com valor inválido, **Quando** o administrador corrige o valor e remove o foco do campo, **Então** o destaque de erro desaparece imediatamente.

---

### User Story 3 — Alternância entre temas claro e escuro (Prioridade: P3)

O administrador pode alternar entre os modos claro e escuro usando um controle visível no layout, e a preferência é mantida entre sessões.

**Por que essa prioridade**: Melhoria de experiência que não bloqueia nenhuma funcionalidade principal. O sistema já possui base para temas (CSS variables configuradas).

**Teste independente**: Pode ser testado clicando no botão de tema e verificando que todos os componentes mudam de aparência — independente das outras funcionalidades.

**Acceptance Scenarios**:

1. **Dado** que o tema atual é claro, **Quando** o administrador clica no botão de alternância de tema, **Então** toda a interface muda para o tema escuro instantaneamente.
2. **Dado** que o administrador escolheu o tema escuro, **Quando** recarrega a página, **Então** o tema escuro persiste (preferência salva via `localStorage`).
3. **Dado** que o sistema operacional usa tema escuro, **Quando** o administrador acessa pela primeira vez, **Então** o tema escuro é aplicado automaticamente como padrão.

---

### Edge Cases

- O que acontece quando a tabela de clientes recebe uma resposta de erro da API? → Exibir mensagem de erro no lugar da tabela com opção de tentar novamente.
- O que acontece quando o formulário de criação recebe um erro de servidor (ex: e-mail duplicado)? → Exibir o erro do servidor no topo do formulário como alerta.
- O que acontece quando o usuário navega com teclado apenas (sem mouse)? → Todos os componentes devem ser acessíveis via Tab e Enter/Space.
- O que acontece quando a lista tem muitos clientes (>100)? → A tabela exibe no máximo 20 por página; a API é chamada com parâmetros `page` e `limit`; controles de paginação (anterior/próximo e número de página) são exibidos abaixo da tabela.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **RF-001**: O `packages/ui` DEVE exportar um componente `DataTable` que exibe dados em colunas configuráveis com suporte a estado vazio, loading e paginação controlada externamente (recebe `page`, `totalPages` e callbacks de navegação como props).
- **RF-002**: O `packages/ui` DEVE exportar componentes de formulário: `Input`, `Label`, `FormField` e `FormMessage` com suporte a estados de erro, compatíveis com a API do `react-hook-form` (usando `Controller` e `useForm`).
- **RF-003**: O `packages/ui` DEVE exportar um componente `Card` para agrupar conteúdo em painéis visuais.
- **RF-004**: O `packages/ui` DEVE exportar componentes de feedback: `Badge` para status e `Alert` para mensagens de erro/sucesso.
- **RF-005**: O `packages/ui` DEVE exportar um componente `Skeleton` para estados de carregamento.
- **RF-006**: A página `/customers` DEVE usar o componente `DataTable` do `@workspace/ui` para exibir a lista de clientes, com dados obtidos via TanStack Query (`useQuery`), suportando loading, erro e paginação controlada por parâmetros de URL.
- **RF-007**: A página `/customers/new` DEVE usar os componentes de formulário do `@workspace/ui` com validação integrada via `react-hook-form` + `zod` (schema tipado). A lib `react-hook-form` será instalada em `apps/web`; `zod` já está disponível em `packages/ui`.
- **RF-008**: O layout da aplicação DEVE incluir um controle de alternância de tema claro/escuro acessível via cabeçalho ou barra lateral.
- **RF-009**: Todos os novos componentes DEVEM seguir as diretrizes de acessibilidade WCAG 2.1 nível AA (navegação por teclado, atributos ARIA, contraste adequado).
- **RF-010**: Os novos exports do `packages/ui` DEVEM ser declarados no campo `exports` do `package.json` para que `apps/web` possa importá-los via `@workspace/ui/components/*`.

### Entidades-Chave

- **Componente de design system**: Unidade reutilizável de UI exportada por `packages/ui`, consumida via `@workspace/ui/components/*`. Encapsula aparência, comportamento e acessibilidade.
- **Token de design**: Variável CSS que representa um valor de design (cor, espaçamento, tipografia). Centralizado em `globals.css` e aplicado por todos os componentes.
- **Tema**: Conjunto de tokens de design que define a aparência visual global (claro ou escuro). Controlado por uma classe CSS no elemento raiz.

## Clarificações

### Sessão 2026-05-12

- Q: Qual abordagem de validação de formulário será usada? → A: `react-hook-form` + `zod` (schema validation tipada, padrão shadcn)
- Q: Onde acontece a paginação da tabela de clientes? → A: Paginação no servidor — a API recebe `page`/`limit` e retorna apenas a fatia solicitada
- Q: Como o front buscará os dados de clientes? → A: TanStack Query (`@tanstack/react-query`) — cache, loading states e refetch automático
- Q: Qual nível de controle de acesso é exigido nas páginas de clientes? → A: Apenas autenticação via `ProtectedRoute` existente — qualquer usuário logado acessa tudo
- Q: Como a preferência de tema é persistida entre sessões? → A: `localStorage` — padrão shadcn, persiste no mesmo navegador

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **CS-001**: Todas as páginas existentes da área de clientes usam exclusivamente componentes do design system — zero estilos inline ou classes Tailwind ad-hoc nas páginas.
- **CS-002**: O tempo para criar um novo componente de UI reutilizável cai para menos de 10 minutos, graças ao CLI do shadcn e à estrutura estabelecida.
- **CS-003**: A alternância de tema funciona em menos de 100 milissegundos perceptíveis pelo usuário.
- **CS-004**: 100% dos componentes adicionados passam em auditoria de acessibilidade automatizada (sem violações críticas detectadas).
- **CS-005**: Novos desenvolvedores conseguem localizar e usar um componente existente em menos de 5 minutos consultando apenas os exports do `package.json`.

## Suposições

- O shadcn/ui CLI já está instalado e funcional no projeto (evidenciado pelo `components.json` e `shadcn` nas dependências).
- `react-hook-form` e `@tanstack/react-query` serão adicionados como dependências de `apps/web`; `zod` já está em `packages/ui`.
- A camada de fetch existente (`customers-api.ts`) será mantida como adaptador; o TanStack Query envolverá essas chamadas.
- O estilo "radix-nova" com CSS variables está corretamente configurado no `globals.css`.
- A configuração Tailwind CSS v4 já está funcionando via plugin Vite nos dois pacotes.
- Os componentes adicionados via CLI do shadcn serão copiados para `packages/ui/src/components/` e não para `apps/web/src/components/`.
- Não será adotado o framework ra-core do shadcn-admin-kit — o projeto usa sua própria stack de dados (Express + React Query via fetch direto). A referência ao shadcn-admin-kit é apenas para padrões visuais e arquiteturais de componentes.

## Dependências & Restrições

- Os componentes em `packages/ui` NÃO podem importar de `apps/*`.
- Os componentes em `apps/web` DEVEM importar apenas via exports declarados em `packages/ui/package.json`.
- O CLI do shadcn deve ser executado na raiz de `packages/ui` para que os arquivos sejam gerados no local correto.
- Controle de acesso está fora do escopo desta feature: todas as rotas de clientes são protegidas apenas por autenticação (`ProtectedRoute`). Controle por papel (`role`) é decisão adiada para feature futura.
