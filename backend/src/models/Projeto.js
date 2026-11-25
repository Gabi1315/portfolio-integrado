import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Projeto',
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

      descricao: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      tecnologias: {
        type: DataTypes.STRING
      },

      categoria: {
        type: DataTypes.STRING
      },

      imagem: {
        type: DataTypes.TEXT
      },

      github: {
        type: DataTypes.STRING
      },

      link: {
        type: DataTypes.STRING
      },

      publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'projetos',
      timestamps: false
    }
  );
};