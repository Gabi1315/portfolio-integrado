import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Perfil',
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },

      turma: {
        type: DataTypes.STRING
      },

      curso: {
        type: DataTypes.STRING
      },

      sobre_mim: {
        type: DataTypes.TEXT
      },

      foto: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'perfil',
      timestamps: false
    }
  );
};