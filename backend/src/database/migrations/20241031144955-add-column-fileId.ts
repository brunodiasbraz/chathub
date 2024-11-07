import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await 
      queryInterface.addColumn('Base_Numbers', 'fileId', {
        type: DataTypes.INTEGER,
        allowNull: true,
      })
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await 
      queryInterface.removeColumn('Base_Numbers', 'fileId');
  }
};
