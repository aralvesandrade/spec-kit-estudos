# Quickstart: Login and Authentication Experience

## 1. Prerequisites
- Node.js >= 22 (usa `node:sqlite` built-in; não requer dependências nativas)
- npm workspaces instalado a partir da raiz do repositório
- Branch ativa: `001-add-login-auth-sqlite`

## 2. Instalar dependências
Da raiz do repositório:

```bash
npm install
```

## 3. Executar em desenvolvimento
Da raiz do repositório:

```bash
npm run dev
```

Isso inicia simultaneamente:
- **Servidor Express** em `http://localhost:3001` (auth API + SQLite)
- **Vite dev server** em `http://localhost:5173` (SPA com proxy `/api`)

O banco de dados SQLite (`apps/web/auth.db`) é criado automaticamente na primeira execução.

### Credenciais da conta inicial (seed)

| Campo | Valor |
|-------|-------|
| E-mail | `admin@example.com` |
| Senha | `Admin@123` |

## 4. Comportamento esperado
- Usuários não autenticados são redirecionados para `/login`.
- Login bem-sucedido cria uma sessão autenticada e redireciona para `/`.
- A sessão expira após 30 minutos de inatividade.
- Logout invalida a sessão atual e redireciona para `/login`.
- Usuário já autenticado que acessa `/login` é redirecionado para `/`.

## 5. Quality gates (devem passar)
Da raiz do repositório:

```bash
npx turbo typecheck
npx turbo lint
npx turbo build
```

## 6. Checklist de verificação funcional
- Formulário de login exige e-mail e senha.
- Credenciais inválidas são rejeitadas com mensagem de erro.
- Campos vazios exibem erro de validação.
- Serviço indisponível exibe mensagem de retry.
- Rotas protegidas são inacessíveis sem sessão válida.
- Sessão expirada redireciona para login.
- Um usuário inicial (seed) pode autenticar imediatamente após setup.
- Tentativas de autenticação são registradas para auditoria.
