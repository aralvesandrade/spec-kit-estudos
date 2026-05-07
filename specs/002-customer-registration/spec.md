# Feature Specification: Cadastro de Clientes

**Feature Branch**: `002-customer-registration`  
**Created**: 2026-05-06  
**Status**: Draft  
**Input**: Criar tela de clientes e cadastro de clientes; o cliente está relacionado a um usuário, sendo permitido criar N clientes por usuário.

## Module Placement

- [x] `apps/web/` — páginas e componentes de feature específicos da app
- [ ] `packages/ui/` — componente ou utilitário reutilizável adicionado à lib compartilhada
- [ ] Ambos (requer novo export `@workspace/ui` + consumidor em `apps/web`)

## User Scenarios & Testing *(obrigatório)*

### User Story 1 - Listar Clientes do Usuário (Prioridade: P1)

Um usuário autenticado acessa a tela de clientes e visualiza todos os clientes que ele cadastrou, organizados de forma clara com nome e informações principais.

**Por que esta prioridade**: Sem a listagem, o usuário não consegue confirmar que seus dados foram salvos, nem reutilizá-los. É a base de toda a jornada de gestão de clientes.

**Teste Independente**: Pode ser testado completamente ao autenticar com um usuário que já possui clientes cadastrados (via seed) e verificar se a lista é exibida corretamente com os dados esperados.

**Cenários de Aceite**:

1. **Dado** que o usuário está autenticado, **Quando** acessa a tela de clientes (`/clientes`), **Então** visualiza a lista com todos os seus clientes cadastrados.
2. **Dado** que o usuário não possui nenhum cliente, **Quando** acessa a tela de clientes, **Então** visualiza uma mensagem informando que não há clientes cadastrados.
3. **Dado** que o usuário A e o usuário B têm clientes cadastrados, **Quando** o usuário A acessa a tela, **Então** vê apenas seus próprios clientes — nunca os do usuário B.

---

### User Story 2 - Criar Novo Cliente (Prioridade: P1)

Um usuário autenticado pode criar um novo cliente preenchendo um formulário com os dados obrigatórios. O cliente criado fica associado ao usuário logado.

**Por que esta prioridade**: É a razão de existir da feature. Sem a criação, não há dados para listar.

**Teste Independente**: Pode ser testado ao preencher o formulário com dados válidos e verificar se o cliente aparece na listagem após a criação.

**Cenários de Aceite**:

1. **Dado** que o usuário está autenticado, **Quando** preenche o formulário com dados válidos e submete, **Então** o cliente é criado, associado ao usuário, e aparece na listagem.
2. **Dado** que o formulário tem campos obrigatórios em branco, **Quando** o usuário tenta submeter, **Então** mensagens de validação são exibidas e o envio é bloqueado.
3. **Dado** que um usuário já possui clientes, **Quando** cria mais um novo cliente, **Então** o novo cliente é adicionado à lista sem remover os anteriores (suporte a N clientes).
4. **Dado** que o serviço de backend está indisponível, **Quando** o usuário tenta criar um cliente, **Então** é exibida uma mensagem de erro com sugestão de nova tentativa.

---

### User Story 3 - Ver Detalhes de um Cliente (Prioridade: P2)

Um usuário autenticado pode clicar em um cliente da lista para visualizar todos os seus dados detalhados em uma tela dedicada.

**Por que esta prioridade**: Agrega valor à listagem ao permitir acesso a informações completas, mas não bloqueia o fluxo principal de criação.

**Teste Independente**: Pode ser testado ao clicar em um cliente existente e verificar se todos os campos cadastrados são exibidos corretamente.

**Cenários de Aceite**:

1. **Dado** que o usuário está na listagem, **Quando** clica em um cliente, **Então** é exibida a tela de detalhes com todos os dados cadastrados.
2. **Dado** que outro usuário tenta acessar diretamente a URL de detalhes de um cliente que não lhe pertence, **Então** recebe HTTP 404 (cliente não encontrado) — o servidor não revela a existência de registros de outros usuários.

---

### Casos de Borda

- O que acontece se o usuário tentar submeter o formulário duas vezes rapidamente (duplo clique)?
- Como o sistema se comporta quando há erro de rede durante a criação?
- O que acontece se o nome do cliente for composto apenas por espaços?
- Como listar clientes quando o usuário tem um número muito grande (ex.: 500+)?

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **RF-001**: O sistema DEVE exibir a listagem de clientes pertencentes ao usuário autenticado.
- **RF-002**: O sistema DEVE garantir o isolamento de dados: um usuário nunca vê clientes de outro usuário.
- **RF-003**: O usuário DEVE conseguir criar um novo cliente através de um formulário.
- **RF-004**: O sistema DEVE associar automaticamente o cliente criado ao usuário autenticado.
- **RF-005**: O sistema DEVE permitir que um usuário possua N clientes (sem limite fixo).
- **RF-006**: O sistema DEVE validar campos obrigatórios antes de permitir o envio do formulário.
- **RF-007**: O sistema DEVE exibir mensagem de erro compreensível quando a criação falhar, incluindo sugestão de nova tentativa para erros não-validação.
- **RF-008**: O usuário DEVE conseguir visualizar os detalhes de um cliente específico.
- **RF-009**: O sistema DEVE proteger a tela de clientes com autenticação — acesso negado sem sessão válida.
- **RF-010**: O sistema DEVE rejeitar o cadastro de um cliente com e-mail já existente para o mesmo usuário, exibindo mensagem de erro clara.
- **RF-011**: O formulário de criação DEVE ser acessível via rota dedicada `/clientes/novo`; após criação bem-sucedida, o usuário é redirecionado para `/clientes`.
- **RF-012**: A listagem DEVE exibir as colunas: nome completo, e-mail e data de cadastro para cada cliente.
- **RF-013**: O botão de envio do formulário DEVE ser desabilitado enquanto a requisição de criação estiver em andamento, prevenindo duplo cadastro.
- **RF-014**: Quando a lista de clientes estiver vazia, o sistema DEVE exibir um empty state com mensagem descritiva e botão "Adicionar cliente" que navega para `/clientes/novo`.

### Entidades Principais

- **Cliente**: representa um cliente cadastrado. Atributos: nome completo (obrigatório), e-mail (obrigatório, único por usuário), telefone (opcional), data de cadastro (gerado pelo sistema). Relacionado a exatamente um Usuário.
- **Usuário**: representa o usuário autenticado. Um Usuário pode ter zero ou mais Clientes (relação 1:N).

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **CS-001**: Usuário consegue criar um novo cliente em menos de 2 minutos a partir do momento em que acessa o formulário.
- **CS-002**: A listagem de clientes exibe dados corretos para 100% dos clientes pertencentes ao usuário autenticado.
- **CS-003**: Nenhum cliente de um usuário é visível para outro usuário (isolamento total).
- **CS-004**: 100% das tentativas de acesso sem sessão válida são redirecionadas para a tela de login.
- **CS-005**: Mensagens de validação aparecem em menos de 1 segundo após tentativa de envio com dados inválidos.

## Premissas

- O sistema de autenticação e gerenciamento de sessão já está implementado (feature `001-login-authentication`).
- A sessão do usuário fornece o identificador do usuário atual para vincular os clientes.
- A tela de clientes é uma rota protegida — usuários não autenticados são redirecionados para `/login`.
- Não há paginação obrigatória para v1; listagem simples é suficiente.
- Edição e exclusão de clientes estão fora do escopo desta feature (v1 — apenas criação e visualização).
- Campos do cliente para v1: nome completo, e-mail e telefone (opcional). Campos adicionais podem ser acrescentados em versões futuras.

## Clarificações

### Session 2026-05-06

- Q: E-mail do cliente deve ser único globalmente, por usuário, ou sem unicidade? → A: Único por usuário — o mesmo usuário não pode ter dois clientes com o mesmo e-mail; usuários distintos podem reutilizar o mesmo e-mail.
- Q: Ponto de entrada para o formulário de criação de cliente — página separada, modal ou drawer? → A: Página separada com rota dedicada (ex.: `/clientes/novo`).
- Q: Quais campos são exibidos em cada linha da listagem de clientes? → A: Nome, e-mail e data de cadastro.
- Q: Comportamento do formulário durante envio — como prevenir duplo cadastro? → A: Desabilitar botão de envio enquanto a requisição está em andamento.
- Q: Comportamento da listagem quando nenhum cliente foi cadastrado ainda? → A: Exibir empty state com mensagem descritiva e botão "Adicionar cliente" apontando para `/clientes/novo`.

## Constitution Check

- [x] Module placement segue regras de dependência (`apps/web` → `@workspace/ui`, nunca invertido)
- [x] Novos componentes compartilhados/hooks vão para `packages/ui/src/`, específicos de app vão para `apps/web/src/`
- [x] Nomes de arquivo usam kebab-case
- [ ] Novos exports de `packages/ui` adicionados a `package.json#exports` (não aplicável — feature é app-only)
- [x] `turbo typecheck && turbo lint && turbo build` deve passar após a implementação
