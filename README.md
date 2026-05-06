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

O projeto usa [spec-kit](https://github.com/github/spec-kit) para planejamento estruturado de features. O fluxo de trabalho é:

1. `/speckit.specify` — Criar especificação da feature
2. `/speckit.plan` — Gerar plano de implementação
3. `/speckit.tasks` — Gerar lista de tarefas
4. Agente implementa seguindo as tasks

Configuração em `.specify/` e instruções do agente em `.github/copilot-instructions.md`.

---

## Regras de agente (AGENTS.md)

Dois agentes com responsabilidades distintas:

| Agente | Escopo | Build |
|---|---|---|
| `ui-lib` | `packages/ui/` — componentes, hooks, utils | `turbo build --filter=@workspace/ui` |
| `web-app` | `apps/web/` — páginas, rotas, features | `turbo build --filter=web` |

Detalhes completos em [AGENTS.md](AGENTS.md).
