"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Greeting_Templates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      template: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Greeting_Templates");
  }
};
