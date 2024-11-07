import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await 
      queryInterface.addColumn('Arquivos', 'qntLinhas', {
        type: DataTypes.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('Arquivos', 'caminhoArquivo', {
        type: DataTypes.STRING,
        allowNull: true,
      });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await 
      queryInterface.removeColumn('Arquivos', 'qntLinhas'),
      queryInterface.removeColumn('Arquivos', 'caminhoArquivo');
  }
};
