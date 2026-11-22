# Portfólio Integrado Fullstack

Projeto escolar com frontend React/Vite, API Node.js/Express e banco MySQL.

## Desenvolvimento local

### Backend
1. Entre em `backend`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env` e preencha os dados do MySQL local.
4. Em desenvolvimento, mantenha `DB_SYNC=true` para criar tabelas que ainda não existirem.
5. Execute `npm run dev`.

### Frontend
1. Entre em `frontend` em outro terminal.
2. Execute `npm install`.
3. Crie `frontend/.env` com `VITE_API_URL=http://localhost:3333`.
4. Execute `npm run dev`.

## Rotas
- `/` — Início.
- `/quem-sou-eu` — apresentação pessoal.
- `/formacoes` — escolha entre SENAI e SESI.
- `/senai` — projetos SENAI.
- `/sesi` — conteúdos SESI.
- `/admin` — login e área administrativa.

## Produção
Consulte `DEPLOY.md` para publicar o frontend na Vercel, a API no Render e o MySQL em serviço privado do Render, incluindo backup e migração do banco local.

## Segurança
- Nunca envie arquivos `.env` ao GitHub.
- Rotas que modificam dados exigem autenticação administrativa.
- Mantenha `DB_SYNC=false` em produção; importe a estrutura e os dados do banco existente antes de colocar o sistema no ar.
