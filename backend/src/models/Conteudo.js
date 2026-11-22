import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Conteudo',
    {
      formacaoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      secaoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      bimestre: {
        type: DataTypes.INTEGER
      },

      titulo: {
        type: DataTypes.STRING,
        allowNull: false
      },

      texto: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      ordem: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'conteudos',
      timestamps: false
    }
  );
};