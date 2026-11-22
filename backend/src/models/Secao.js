import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Secao',
    {
      formacaoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },

      tipo_periodo: {
        type: DataTypes.STRING
      },

      ordem: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'secoes',
      timestamps: false
    }
  );
};