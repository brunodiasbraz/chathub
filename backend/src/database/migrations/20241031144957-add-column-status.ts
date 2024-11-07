import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await 
      queryInterface.addColumn('Base_Numbers', 'status', {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0 
      })
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await 
      queryInterface.removeColumn('Base_Numbers', 'status');
  }
};
