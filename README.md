# vite-monorepo

Monorepo React com Vite, shadcn/ui, TailwindCSS, TypeScript e Turborepo. Inclui estrutura para aplicação web (`apps/web`) e biblioteca de componentes compartilhada (`packages/ui`), com suporte a spec-kit (IA-assisted planning) e skill caveman para comunicação comprimida com agentes.

---

## Tecnologias

| Ferramenta | Versão / Uso |
|---|---|
| [Vite](https://vitejs.dev/) | Bundler e dev server |
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [TailwindCSS 4](https://tailwindcss.com/) | Utilitários de estilo |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes acessíveis (Radix UI + CVA) |
| [Turborepo](https://turbo.build/) | Orquestração de tarefas no monorepo |
| [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) | Gerenciamento de pacotes |

---

## Estrutura do projeto

```
vite-monorepo/
├── apps/
│   └── web/                  # Aplicação React SPA
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── components/   # Componentes exclusivos da app
│       ├── vite.config.ts
│       └── package.json
├── packages/
│   └── ui/                   # Biblioteca de componentes compartilhados
│       ├── src/
│       │   ├── components/   # Componentes (ex: button.tsx)
│       │   ├── hooks/        # Hooks reutilizáveis
│       │   ├── lib/          # Utilitários (utils.ts)
│       │   └── styles/       # CSS global (globals.css)
│       └── package.json
├── turbo.json                 # Pipeline de tarefas
├── package.json               # Raiz do workspace
└── tsconfig.json              # Config TypeScript base
```

- `apps/web` pode importar de `@workspace/ui`, nunca o contrário.
- Convenção de nomes: **kebab-case** em todos os arquivos.

---

## Como iniciar

### Pré-requisitos

- Node.js >= 20
- npm >= 11

### Instalação e desenvolvimento

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

### Outros comandos disponíveis

```bash
npm run lint       # Lint em todos os pacotes
npm run typecheck  # Verificação de tipos
npm run format     # Formatação com Prettier
```

---

## Adicionar componentes shadcn/ui

Para adicionar um componente à biblioteca compartilhada:

```bash
npx shadcn@latest add button -c apps/web
```

O componente será gerado em `packages/ui/src/components/`.

### Usar componentes na app

```tsx
import { Button } from "@workspace/ui/components/button";
```

---

## Configuração do projeto (passo a passo)

Esta seção documenta como este projeto foi criado do zero.

### 1. Inicializar o template shadcn/ui com Vite

```bash
npx shadcn@latest init -t vite
```

Gera a estrutura do monorepo com Turborepo, npm workspaces, Vite, TailwindCSS e shadcn/ui pré-configurados.

### 2. Instalar o uv (gerenciador Python moderno)

[uv](https://github.com/astral-sh/uv) é um gerenciador de pacotes Python ultra-rápido, necessário para instalar o spec-kit.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 3. Instalar o spec-kit (specify-cli)

[spec-kit](https://github.com/github/spec-kit) é uma ferramenta de planejamento assistido por IA para agentes de código. Gera planos, specs, modelos de dados e contratos de API em `.specify/`.

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

Após a instalação, o diretório `.specify/` é criado na raiz com templates, extensões e workflows para guiar o agente.

### 4. Instalar a extensão spec-kit-brownfield

A extensão [brownfield](https://github.com/Quratulain-bilal/spec-kit-brownfield) adiciona suporte a projetos existentes (brownfield), permitindo que o spec-kit analise e documente código legado.

```bash
specify extension add brownfield --from https://github.com/Quratulain-bilal/spec-kit-brownfield/archive/refs/tags/v1.0.0.zip
```

As skills da extensão ficam em `.agents/skills/` e incluem: `speckit-brownfield-bootstrap`, `speckit-brownfield-scan`, `speckit-brownfield-migrate` e `speckit-brownfield-validate`.

### 5. Instalar a skill caveman

[caveman](https://github.com/JuliusBrussee/caveman) é uma skill de comunicação ultra-comprimida para agentes. Reduz o uso de tokens em ~75% mantendo precisão técnica.

```bash
npx skills add JuliusBrussee/caveman -a github-copilot
```

A skill fica disponível em `.agents/skills/caveman/`. Ative com: `caveman mode`, `talk like caveman` ou `/caveman`.

---

## Ferramentas de agente (spec-kit)

O projeto usa [spec-kit](https://github.com/github/spec-kit) para planejamento estruturado de features seguindo o fluxo **SDD — Specification-Driven Development**. Todos os artefatos gerados ficam em `.specify/specs/<feature>/`.

### Fluxo principal (greenfield — feature nova)

```
Constituir → Especificar → Clarificar (opcional) → Planejar → Analisar (opcional) → Tarefas → Implementar
```

#### Core Commands

Comandos essenciais para o fluxo SDD:

| Etapa | Comando | Agent Skill | Descrição |
|---|---|---|---|
| **Constituir** | `/speckit.constitution` | speckit-constitution | Criar ou atualizar princípios de governança e diretrizes de desenvolvimento do projeto |
| **Especificar** | `/speckit.specify` | speckit-specify | Definir o que construir (requisitos e user stories) |
| **Planejar** | `/speckit.plan` | speckit-plan | Criar planos técnicos de implementação com o stack escolhido |
| **Tarefas** | `/speckit.tasks` | speckit-tasks | Gerar listas de tarefas acionáveis para implementação |
| **Issues** | `/speckit.taskstoissues` | speckit-taskstoissues | Converter listas de tarefas em GitHub Issues para rastreamento e execução |
| **Implementar** | `/speckit.implement` | speckit-implement | Executar todas as tarefas para construir a feature conforme o plano |

#### Optional Commands

Comandos adicionais para qualidade e validação aprimoradas:

| Etapa | Comando | Agent Skill | Descrição |
|---|---|---|---|
| **Clarificar** | `/speckit.clarify` | speckit-clarify | Clarificar áreas subespecificadas (recomendado antes de `/speckit.plan`) |
| **Analisar** | `/speckit.analyze` | speckit-analyze | Análise de consistência e cobertura entre artefatos (execute após `/speckit.tasks`, antes de `/speckit.implement`) |
| **Checklist** | `/speckit.checklist` | speckit-checklist | Gerar checklists de qualidade customizados que validam completude, clareza e consistência dos requisitos |

### Resumo do fluxo com comandos

```
1. /speckit.constitution          ← (só na primeira vez) define regras do projeto

2. /speckit.specify "descrição"   ← descreve o que construir → gera spec.md
   /speckit.clarify               ← (opcional) refina spec com perguntas/respostas

3. /speckit.plan                  ← gera plano técnico → plan.md

4. /speckit.analyze               ← (opcional) análise de consistência entre artefatos
   /speckit.checklist             ← (opcional) gates de qualidade
   /speckit.tasks                 ← quebra em tarefas atômicas → tasks.md
   /speckit.taskstoissues         ← (opcional) cria GitHub Issues das tarefas

5. /speckit.implement             ← agente executa as tasks
```

### Workflow automatizado (todos os passos de uma vez)

O workflow `speckit` executa specify → plan → tasks → implement com gates de revisão entre cada etapa:

```
/speckit.workflow "descrição da feature"
```

Configuração do workflow em `.specify/workflows/speckit/workflow.yml`.

---

## Extensão Brownfield

A extensão [spec-kit-brownfield](https://github.com/Quratulain-bilal/spec-kit-brownfield) resolve o problema de adotar SDD em projetos **já existentes**: os templates genéricos do spec-kit não refletem o stack real, convenções e limites de módulos do projeto. A extensão descobre tudo isso automaticamente.

### Fluxo brownfield (adotar SDD em projeto existente)

```
Escanear → Configurar → Validar → Migrar (features antigas) → continuar com fluxo normal
```

| Etapa | Comando | Modifica arquivos? | O que faz |
|---|---|---|---|
| **Escanear** | `/speckit.brownfield.scan` | Não (somente leitura) | Detecta stack, frameworks, arquitetura, convenções de nomenclatura, padrões de branch e commit |
| **Configurar** | `/speckit.brownfield.bootstrap` | Sim | Gera `constitution.md`, templates e `AGENTS.md` adaptados ao projeto real |
| **Validar** | `/speckit.brownfield.validate` | Não (somente leitura) | Verifica se o que foi gerado corresponde à estrutura real; detecta drift |
| **Migrar** | `/speckit.brownfield.migrate` | Sim | Reverse-engineer de `spec.md`, `plan.md` e `tasks.md` para features já implementadas |

### Resumo do fluxo brownfield com comandos

```
1. /speckit.brownfield.scan       ← lê o projeto e monta perfil técnico
                                    (stack, arquitetura, módulos, convenções)

2. /speckit.brownfield.bootstrap  ← gera constituição e templates sob medida
                                    para o projeto (não templates genéricos)

3. /speckit.brownfield.validate   ← verifica se a configuração gerada bate
                                    com a estrutura real do projeto

4. /speckit.brownfield.migrate "feature X"
                                  ← reconstrói spec/plan/tasks de uma feature
                                    já existente (todas as tasks já marcadas ✓)
                                    e aponta gaps (sem testes, sem error handling...)

5. Fluxo normal SDD a partir daqui →
   /speckit.specify → /speckit.plan → /speckit.tasks → /speckit.implement
```

> O comando `/speckit.brownfield.scan` roda automaticamente como hook opcional após `specify init` — é a porta de entrada recomendada para qualquer projeto existente.

### O que o scan detecta neste projeto

Ao rodar `/speckit.brownfield.scan` neste repositório, o resultado seria:

```
Project Profile
├── Tipo: Monorepo (npm workspaces + Turborepo)
├── Linguagem: TypeScript
├── Frontend: React 19, Vite 7, TailwindCSS 4
├── Componentes: shadcn/ui (Radix UI + CVA)
├── Módulos: apps/web, packages/ui
├── Package manager: npm 11
├── Naming convention: kebab-case
└── CI/CD: não detectado
```

---

## Regras de agente (AGENTS.md)

Dois agentes com responsabilidades distintas:

| Agente | Escopo | Build |
|---|---|---|
| `ui-lib` | `packages/ui/` — componentes, hooks, utils | `turbo build --filter=@workspace/ui` |
| `web-app` | `apps/web/` — páginas, rotas, features | `turbo build --filter=web` |

Detalhes completos em [AGENTS.md](AGENTS.md).
