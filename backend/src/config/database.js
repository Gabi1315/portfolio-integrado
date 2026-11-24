import dotenv from 'dotenv';
import pg from 'pg';
import { Sequelize } from 'sequelize';

dotenv.config();

const obrigatorias = ['DB_HOST', 'DB_NAME', 'DB_USER'];
const ausentes = obrigatorias.filter((chave) => !process.env[chave]);
if (ausentes.length) {
  throw new Error(`Configuração do banco incompleta. Defina: ${ausentes.join(', ')}.`);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    pool: { max: 1, min: 0, acquire: 30000, idle: 10000 },
    ...(process.env.DB_SSL === 'true'
      ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
      : {})
  }
);

export default sequelize;