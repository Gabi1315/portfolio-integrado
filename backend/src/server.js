
import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

import perfilFactory from './models/Perfil.js';
import formacaoFactory from './models/Formacao.js';
import secaoFactory from './models/Secao.js';
import conteudoFactory from './models/Conteudo.js';
import projetoFactory from './models/Projeto.js';
import arquivoProjetoFactory from './models/ArquivoProjeto.js';

import perfilRoutes from './routes/perfilRoutes.js';
import formacaoRoutes from './routes/formacaoRoutes.js';
import conteudoRoutes from './routes/conteudoRoutes.js';
import projetoRoutes from './routes/projetoRoutes.js';

import { validarConfigAuth } from './config/auth.js';
import authRoutes from './routes/authRoutes.js';

validarConfigAuth();

const app = express();
app.set('trust proxy', 1);

const origensPermitidas = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origem) => origem.trim())
  .filter(Boolean);

app.use(cors({
  origin(origem, callback) {
    if (!origem || process.env.NODE_ENV !== 'production' || origensPermitidas.includes(origem)) {
      return callback(null, true);
    }
    return callback(new Error('Origem não autorizada pelo CORS.'));
  }
}));

app.use('/api/projetos', express.json({ limit: '2mb' }));

app.use(express.json({ limit: '100kb' }));

// Models
const Perfil = perfilFactory(sequelize);
const Formacao = formacaoFactory(sequelize);
const Secao = secaoFactory(sequelize);
const Conteudo = conteudoFactory(sequelize);
const Projeto = projetoFactory(sequelize);
const ArquivoProjeto = arquivoProjetoFactory(sequelize);

// Relacionamentos
Formacao.hasMany(Secao, { foreignKey: 'formacaoId', onDelete: 'CASCADE' });
Secao.belongsTo(Formacao, { foreignKey: 'formacaoId' });

Formacao.hasMany(Conteudo, { foreignKey: 'formacaoId', onDelete: 'CASCADE' });
Conteudo.belongsTo(Formacao, { foreignKey: 'formacaoId' });

Secao.hasMany(Conteudo, { foreignKey: 'secaoId', onDelete: 'CASCADE' });
Conteudo.belongsTo(Secao, { foreignKey: 'secaoId' });

Formacao.hasMany(Projeto, { foreignKey: 'formacaoId', onDelete: 'CASCADE' });
Projeto.belongsTo(Formacao, { foreignKey: 'formacaoId' });

Secao.hasMany(Projeto, { foreignKey: 'secaoId', onDelete: 'CASCADE' });
Projeto.belongsTo(Secao, { foreignKey: 'secaoId' });

Projeto.hasMany(ArquivoProjeto, { foreignKey: 'projetoId', onDelete: 'CASCADE' });
ArquivoProjeto.belongsTo(Projeto, { foreignKey: 'projetoId' });

// Disponibiliza os models para controllers através do app.
app.locals.models = {
  Perfil,
  Formacao,
  Secao,
  Conteudo,
  Projeto,
  ArquivoProjeto
};

// Status da API
app.get('/api/status', (_req, res) => {
  res.status(200).json({
    ok: true,
    message: 'API do Portfólio funcionando!'
  });
});

// Rotas sem necessidade de login
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/formacoes', formacaoRoutes);
app.use('/api/conteudos', conteudoRoutes);
app.use('/api/projetos', projetoRoutes);

const PORT = process.env.PORT || 3333;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Banco conectado');

    if (process.env.DB_SYNC === 'true' || (process.env.NODE_ENV !== 'production' && process.env.DB_SYNC !== 'false')) {
      await sequelize.sync();
      console.log('Estrutura do banco sincronizada (DB_SYNC habilitado)');
    } else {
      console.log('Sincronização automática desativada; usando as tabelas existentes.');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Back-end rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error.message);
  }
}

if (!process.env.VERCEL) {
  start();
}

export default app;