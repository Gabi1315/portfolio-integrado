# Publicação e migração do Portfólio Integrado

## Arquitetura
- Frontend React/Vite: Vercel (pasta `frontend`).
- API Node/Express: Render (pasta `backend`).
- Banco: MySQL 8 em serviço privado do Render, com disco persistente.

## Antes de começar: backup local
1. Não apague nem altere o banco local.
2. Abra o terminal do MySQL ou PowerShell onde `mysqldump` esteja disponível.
3. Exporte o banco inteiro:

```powershell
mysqldump -u root -p --single-transaction --routines --triggers --events --default-character-set=utf8mb4 portfolio > portfolio-backup.sql
```

Digite a senha local quando solicitado. Se o MySQL local não tiver senha, pressione Enter.
4. Guarde `portfolio-backup.sql` em local seguro. Não envie esse arquivo ao GitHub.

## 1. Preparar o GitHub
1. Crie um repositório privado no GitHub.
2. Envie o conteúdo desta pasta para o repositório.
3. Confira se `.env`, `backend/.env` e `portfolio-backup.sql` não aparecem no Git. O `.gitignore` já os exclui.
4. Não publique senhas, tokens nem cópias do banco no repositório.

## 2. Criar o MySQL no Render
O Render documenta uma implantação de MySQL 8 usando o repositório `render-examples/mysql`.
1. No GitHub, use o template `https://github.com/render-examples/mysql` e crie um repositório privado.
2. No Render, crie um serviço privado conectado a esse repositório; selecione Docker.
3. Configure as variáveis do contêiner: `MYSQL_DATABASE=portfolio`, `MYSQL_USER=portfolio_user`, `MYSQL_PASSWORD` com uma senha longa e exclusiva e `MYSQL_ROOT_PASSWORD` com outra senha forte.
4. Em Advanced, adicione um Persistent Disk com Mount Path `/var/lib/mysql` e tamanho adequado (a documentação mostra 10 GB como exemplo). Esse tipo de disco exige serviço pago no Render; confira os custos atuais com um responsável antes de ativar.
5. Espere o serviço ficar disponível e anote o hostname/porta internos exibidos pelo Render, no formato `nome-do-servico:3306`.
6. O serviço MySQL deve ser privado; não exponha a porta do banco à internet.

## 3. Importar o backup
Para importar pelo navegador, o Render disponibiliza o template Adminer. Crie temporariamente um serviço Adminer no mesmo workspace (ele precisa alcançar a rede privada do MySQL), conecte usando o hostname interno do MySQL e importe o arquivo `portfolio-backup.sql` pela opção de comando SQL/arquivo. Como a URL do Adminer é pública, configure uma proteção de acesso (por exemplo, restrição por IP ou autenticação adicional) antes de usar e remova o serviço assim que terminar. Não deixe o painel de administração do banco exposto permanentemente. Alternativamente, faça a importação pelo Shell/SSH do serviço MySQL com o cliente `mysql` se já tiver o arquivo disponível nesse ambiente.

Como o comando de exportação acima não inclui `CREATE DATABASE`, importe o conteúdo dentro do banco `portfolio`:

```bash
mysql -u portfolio_user -p portfolio < portfolio-backup.sql
```

Use o usuário com permissões para criar tabelas e dados durante a importação. Depois, confirme que existem as tabelas `perfil`, `formacoes`, `secoes`, `conteudos`, `projetos` e `arquivos_projeto`, e confira a contagem dos registros. Não execute `sequelize.sync({ alter: true })` em produção.

## 4. Publicar a API no Render
1. Crie um Web Service ligado ao repositório principal.
2. Root Directory: `backend`.
3. Runtime: Node.
4. Build Command: `npm ci`.
5. Start Command: `npm start`.
6. Configure no painel Environment:
   - `NODE_ENV=production`
   - `DB_HOST` = hostname interno do serviço MySQL
   - `DB_PORT=3306`
   - `DB_NAME=portfolio`
   - `DB_USER=portfolio_user`
   - `DB_PASSWORD` = senha criada para esse usuário
   - `DB_SSL=false` para conexão pela rede privada do Render
   - `DB_SYNC=false`
   - `FRONTEND_URL` = URL final do site na Vercel (sem barra no final)
7. Faça o deploy e teste `https://SUA-API.onrender.com/api/status`.

## 5. Publicar o frontend na Vercel
1. Importe o repositório do GitHub na Vercel.
2. Root Directory: `frontend`.
3. Framework Preset: Vite.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Crie a variável `VITE_API_URL` com a URL pública do Web Service do Render, por exemplo `https://sua-api.onrender.com`.
7. Publique. O `vercel.json` já contém a regra de fallback necessária às rotas do React Router.
8. Copie a URL final da Vercel e atualize `FRONTEND_URL` no Render. Faça novo deploy da API.

## 6. Testes de produção
1. Abra `https://SUA-API.onrender.com/api/status`; deve retornar `ok: true`.
2. Abra o site Vercel e teste SENAI, SESI e os dados que foram migrados.
3. Cadastre um projeto de teste e confirme que ele aparece em outro dispositivo.
4. Exclua o projeto de teste pela área administrativa.
5. Teste também um conteúdo SESI.

## Segurança e observações
- Apenas leituras públicas ficam abertas. Criação/edição/exclusão de projetos, cadastro de conteúdos e criação de seções exigem token administrativo.
- O token da área administrativa dura 8 horas e fica no `sessionStorage` do navegador.
- Faça backups periódicos com `mysqldump`. A documentação do Render recomenda ferramentas próprias do banco para backup/restauração, e não confiar somente em snapshots do disco.
- O arquivo `portfolio-backup.sql` contém dados do banco; mantenha-o privado e apague cópias temporárias depois de confirmar a migração.
- Se houver cobrança de serviços/armazenamento, peça a um responsável para revisar os planos e custos antes de ativá-los.
