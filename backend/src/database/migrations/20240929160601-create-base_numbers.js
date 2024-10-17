"use strict";
/** @type {import('sequelize-cli').Migration} */
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Base_Numbers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      phone: {
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
    await queryInterface.dropTable("Base_Numbers");
  }
};
