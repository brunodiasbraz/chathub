"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Greeting_Templates",
      [
        {
          template:
            "Olá {name}, como você está? Temos algumas novidades pra você!",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template:
            "Bom dia, {name}! Podemos conversar para saber como podemos ajudar você?",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template: "Oi {name}! Tudo bem?",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template: "{name}, essa oportunidade não pode passar assim!",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template: "{name}, como vai? Tudo bem?",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template:
            "Vamos aproveitar {name}! Essa é a hora de ter seu nome limpo novamente!",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template:
            "Olá {name}, você nos pediu um retorno, podemos falar agora?",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Greeting_Templates", null, {});
  }
};
