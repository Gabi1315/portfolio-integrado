import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'ArquivoProjeto',
    {
      projetoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },

      url: {
        type: DataTypes.STRING,
        allowNull: false
      },

      tipo: {
        type: DataTypes.STRING
      },

      tamanho: {
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: 'arquivos_projeto',
      timestamps: false
    }
  );
};