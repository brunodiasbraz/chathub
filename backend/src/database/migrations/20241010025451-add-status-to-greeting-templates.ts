import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Greeting_Templates", "status", {
      type: DataTypes.INTEGER,
    });
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Greeting_Templates", "status");
  },
};
