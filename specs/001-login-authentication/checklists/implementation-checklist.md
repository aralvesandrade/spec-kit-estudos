# Checklist de Implementação: Login and Authentication Experience

**Data**: 2026-05-06
**Responsável**: speckit.implement

## Quality Gates

- [X] `turbo typecheck` — PASSOU (2/2 pacotes)
- [X] `turbo build` — PASSOU (1/1 pacote — `web`)
- [X] `turbo lint` — FALHOU com erro pré-existente em `packages/ui/src/components/button.tsx` (fora do escopo desta feature)

## Verificação de Proxy e Integração Dev

- [X] `/api` proxy configurado em `vite.config.ts` apontando para `http://localhost:3001`
- [X] Script `dev` usa `concurrently` para iniciar Express e Vite simultaneamente
- [X] Servidor Express responde nas rotas `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`

## Verificação das Histórias de Usuário

### US1 — Autenticar com credenciais válidas (MVP)
- [X] Usuário seed criado automaticamente na primeira inicialização
- [X] Login com e-mail/senha redireciona para área protegida
- [X] Sessão persistida no SQLite com validade de 30 minutos
- [X] Bootstrap de sessão no carregamento da app (`/api/auth/me`)

### US2 — Tratar tentativas inválidas
- [X] Campos obrigatórios validados (e-mail e senha)
- [X] Formato de e-mail validado com regex
- [X] Credenciais inválidas retornam erro 401 com mensagem clara
- [X] Tentativas de autenticação persistidas em `auth_attempts`
- [X] Fallback para `storage-unavailable` com orientação de retry

### US3 — Encerrar sessão com segurança
- [X] Logout revoga sessão no banco (status = 'revoked')
- [X] Cookie `auth_session` removido no logout
- [X] Sessões expiram após 30 min de inatividade
- [X] Usuário autenticado redirecionado para `/` ao acessar `/login`
- [X] Sessão expirada/inválida redireciona para `/login`

## Arquivos Criados

### Backend (`apps/web/server/`)
- `db/schema.sql` — Schema SQLite (users, sessions, auth_attempts)
- `db/client.ts` — Cliente SQLite via `node:sqlite` built-in
- `db/seed.ts` — Usuário inicial (admin@example.com / Admin@123)
- `auth/auth-repository.ts` — Operações de persistência
- `auth/auth-errors.ts` — Taxonomia de erros
- `auth/login-service.ts` — Verificação de credenciais
- `auth/session-service.ts` — Criação, validação, revogação de sessão
- `auth/auth-controller.ts` — Handlers HTTP
- `index.ts` — Servidor Express na porta 3001

### Frontend (`apps/web/src/features/auth/`)
- `auth-types.ts` — Tipos TypeScript do contrato
- `auth-api.ts` — Cliente de API (fetch wrapper)
- `auth-provider.tsx` — Context + bootstrap de sessão
- `login-page.tsx` — Formulário de login com feedbacks de erro
- `protected-route.tsx` — Guard de rota
- `app-shell.tsx` — Shell autenticado com botão de logout
- `index.ts` — Barrel de exports

### Modificados
- `apps/web/package.json` — Novas dependências e script `dev` atualizado
- `apps/web/vite.config.ts` — Proxy `/api`
- `apps/web/src/App.tsx` — Roteamento com React Router
- `apps/web/src/main.tsx` — AuthProvider integrado
- `specs/001-login-authentication/quickstart.md` — Atualizado com credenciais e instruções
