# Portfólio Integrado

Projeto escolar com site em **React + Vite**, API em **Node.js + Express** e banco **PostgreSQL no Supabase**. O site e a API ficam publicados na **Vercel**, como dois projetos separados a partir deste mesmo repositório.

## Estrutura de pastas

```
portfolio-integrado/
├── backend/                  API (Express + Sequelize)
│   ├── scripts/
│   │   └── gerar-hash-senha.js   gera a senha do admin e o JWT_SECRET
│   ├── src/
│   │   ├── config/           banco de dados e autenticação
│   │   ├── controllers/      recebem as requisições
│   │   ├── middleware/       verificação de token e limite de login
│   │   ├── models/           tabelas (Sequelize)
│   │   ├── routes/           rotas da API
│   │   ├── services/         regras de acesso aos dados
│   │   └── server.js         ponto de entrada
│   └── .env.example          modelo das variáveis de ambiente
├── frontend/                 Site (React + Vite)
│   ├── src/
│   │   ├── main.jsx          rotas, área admin e páginas simples
│   │   ├── pages/            Início, Quem sou eu, SENAI, SESI...
│   │   └── styles.css
│   └── vercel.json           faz o site funcionar em qualquer endereço
└── supabase-schema-e-dados.sql   cria as tabelas e os dados iniciais
```

## Requisitos

- Node.js 22 ou superior
- Conta no [Supabase](https://supabase.com) (banco de dados)
- Conta na [Vercel](https://vercel.com) (publicação)
- Repositório no GitHub

## 1. Banco de dados (Supabase)

1. Crie um projeto no Supabase e **anote a senha do banco** (ela não é mostrada de novo depois).
2. Abra **SQL Editor → New query**, cole o conteúdo de `supabase-schema-e-dados.sql` e clique em **Run**. O script cria as 6 tabelas, insere SENAI, SESI, as seções e o perfil, e **liga o RLS** (segurança) em todas.
3. Confira o resultado no final: `formacoes 2`, `secoes 5`, `perfil 1`, `conteudos 0`, `projetos 0`.
4. Clique em **Connect** e copie os dados de conexão do **pooler**:

| Onde vai usar | Tipo de conexão | Porta |
|---|---|---|
| Seu computador | Session pooler | `5432` |
| Vercel | Transaction pooler | `6543` |

A conexão direta (`db.XXXX.supabase.co`) **não funciona** nessas redes, porque é só IPv6. Do endereço `postgresql://postgres.CODIGO:SENHA@HOST:PORTA/postgres`, tire:

- `DB_USER` = `postgres.CODIGO` (com o ponto)
- `DB_HOST` = `HOST`
- `DB_PASSWORD` = a senha do banco (somente ela)
- `DB_NAME` = `postgres`

## 2. Variáveis de ambiente

### Backend (`backend/.env`, e no painel da Vercel)

| Variável | Valor |
|---|---|
| `PORT` | `3333` (só local) |
| `NODE_ENV` | `development` local, `production` na Vercel |
| `DB_HOST` | host do pooler (Connect, no Supabase) |
| `DB_PORT` | `5432` local, `6543` na Vercel |
| `DB_NAME` | `postgres` |
| `DB_USER` | `postgres.CODIGO` |
| `DB_PASSWORD` | senha do banco |
| `DB_SSL` | `true` |
| `DB_SYNC` | `false` |
| `FRONTEND_URL` | endereço do site, ex.: `https://meu-site.vercel.app` (sem barra no final; vários separados por vírgula) |
| `ADMIN_USER` | usuário do administrador |
| `ADMIN_PASSWORD_HASH` | gerado por `npm run hash-senha` |
| `JWT_SECRET` | gerado por `npm run hash-senha` |

O servidor **não inicia** se faltar qualquer variável de autenticação ou do banco. Isso é proposital.

### Frontend (`frontend/.env` local, e no painel da Vercel)

| Variável | Valor |
|---|---|
| `VITE_API_URL` | endereço da API, ex.: `http://localhost:3333` local ou `https://minha-api.vercel.app` na Vercel (sem barra no final e sem `/api`) |

## 3. Rodando no computador

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run hash-senha
npm run dev
```

1. Preencha o `.env` com os dados do Supabase (porta `5432`).
2. O comando `npm run hash-senha` pede a senha que você quer para o admin do site (não é a do banco) e imprime `ADMIN_PASSWORD_HASH` e `JWT_SECRET`. Cole os dois no `.env`, copiando só o valor depois do `=`.
3. Teste: abra `http://localhost:3333/api/formacoes`. Deve aparecer o JSON do SENAI e do SESI.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Crie `frontend/.env` com `VITE_API_URL=http://localhost:3333` e abra `http://localhost:5173`.

## 4. Páginas do site

| Endereço | Conteúdo |
|---|---|
| `/` | Início |
| `/quem-sou-eu` | Apresentação pessoal |
| `/formacoes` | Escolha entre SENAI e SESI |
| `/senai` | Projetos do SENAI |
| `/sesi` | Conteúdos do SESI |
| `/admin` | Login e área administrativa |

Existem também `/projetos`, `/aprendizagens`, `/registros` e `/reflexao` (em construção).

## 5. API

🔒 = exige o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/status` | Verifica se a API está no ar |
| POST | `/api/auth/login` | Recebe `usuario` e `senha`, devolve o token (válido por 8 horas) |
| GET | `/api/perfil` | Lê o perfil |
| POST | `/api/perfil` 🔒 | Cria ou atualiza o perfil |
| GET | `/api/formacoes` | Lista as formações |
| GET | `/api/formacoes/secoes/:formacaoId` | Lista as seções de uma formação |
| POST | `/api/formacoes/secoes` 🔒 | Cria uma seção |
| GET | `/api/conteudos/:formacaoId` | Lista os conteúdos publicados |
| POST | `/api/conteudos` 🔒 | Cria um conteúdo |
| GET | `/api/projetos/:formacaoId` | Lista os projetos publicados |
| GET | `/api/projetos/:projetoId/arquivos` | Lista os arquivos de um projeto |
| POST | `/api/projetos` 🔒 | Cria um projeto |
| PUT | `/api/projetos/:id` 🔒 | Edita um projeto |
| DELETE | `/api/projetos/:id` 🔒 | Apaga um projeto |

## 6. Publicando na Vercel

São **dois projetos** na Vercel, ambos importados deste repositório. O que os diferencia é a pasta raiz (**Root Directory**).

### Antes de enviar ao GitHub

```bash
git ls-files | findstr /i "\.env"
```

Só pode aparecer `.env.example`, **nunca** `.env`.

### Backend (API)

1. Na Vercel: **Add New… → Project** (ou `vercel.com/new`) e importe o repositório.
2. Em **Root Directory**, escolha `backend`. Nome sugerido: `portfolio-api`.
3. Em **Environment Variables**, cadastre todas as variáveis do backend (use `NODE_ENV=production` e `DB_PORT=6543`).
4. Clique em **Deploy** e teste `https://SUA-API.vercel.app/api/status`. A API não tem página inicial, então abrir só `/` mostra erro de rota. Isso é normal.
5. Se aparecer erro 500, veja a aba **Logs** do projeto: a mensagem diz qual variável está faltando ou errada.

### Frontend (site)

1. No projeto do site (Root Directory `frontend`), vá em **Settings → Environment Variables** e crie `VITE_API_URL` com o endereço da API.
2. Faça **Redeploy**, porque variáveis `VITE_` só entram no site quando ele é construído.

### Liberando o site na API (CORS)

No projeto da API, confira que `FRONTEND_URL` é **exatamente** o endereço do site (com `https://`, sem barra no final) e faça **Redeploy** da API.

> Regra geral: na Vercel, **toda variável alterada só vale depois de um novo deploy** do projeto onde ela foi alterada.

## 7. Segurança

- **Nunca** envie arquivos `.env` ao GitHub nem compartilhe senhas, o `ADMIN_PASSWORD_HASH` ou o `JWT_SECRET` por mensagem, print ou zip. Se um segredo vazar, gere outro.
- As rotas que alteram dados (`POST`, `PUT`, `DELETE`) exigem token. O token expira em 8 horas.
- A senha do admin não fica em texto puro: só o hash (`scrypt`) é guardado nas variáveis de ambiente.
- O login permite 5 tentativas por IP a cada 15 minutos.
- As tabelas do Supabase têm o **RLS ligado**, e a API conecta pelo banco diretamente. Assim, ninguém acessa os dados pela API pública automática do Supabase.
- O site não usa chaves do Supabase (`anon`, `service_role`). Não é preciso copiá-las para lugar nenhum.
- Use `DB_SYNC=false` em produção. A estrutura do banco vem do arquivo SQL.

## 8. Problemas comuns

| Sintoma | Causa provável e solução |
|---|---|
| `connect ETIMEDOUT` ao iniciar | Driver errado, ou rede bloqueando a porta. Use o pooler (não a conexão direta) e teste em outra rede. |
| `password authentication failed` | Senha errada, ou falta o `postgres.` no começo do `DB_USER`. Se a senha tiver `#`, coloque-a entre aspas no `.env`. |
| `Tenant or user not found` | Host ou código do projeto diferentes do que o Connect mostra. Copie de novo. |
| `ADMIN_PASSWORD_HASH inválido` | Valor colado com o nome da variável, aspas ou espaços. Cole só o que vem depois do `=`. |
| "Configuração ... incompleta" | Falta uma variável. A mensagem lista quais. |
| Site mostra "API desconectada" e o login dá erro 405 | `VITE_API_URL` não chegou ao site. Confira o nome, o projeto (frontend) e faça Redeploy. |
| CORS e erro 500 juntos no navegador | `FRONTEND_URL` do backend diferente do endereço do site. Corrija e faça Redeploy do backend. |
| Erro falando de "prepared statement" | Troque `DB_PORT` para `5432` na Vercel e faça Redeploy. |
| Tudo falha depois de dias parado | Supabase pausado. Clique em **Resume project** no painel. |

## 9. Limitações conhecidas

- O limite de tentativas de login fica na memória de cada instância da Vercel, então é um freio e não um bloqueio rígido. Use uma senha de admin forte.
- A conexão com o banco é criptografada, mas o certificado do servidor não é verificado (`rejectUnauthorized: false`).
- As páginas `/aprendizagens`, `/registros` e `/reflexao` ainda precisam de conteúdo.
