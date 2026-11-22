import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Formacao',
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },

      curso: {
        type: DataTypes.STRING,
        allowNull: false
      },

      ordem: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'formacoes',
      timestamps: false
    }
  );
};