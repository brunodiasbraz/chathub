import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(
      "Greeting_Templates",
      [
        {
          template:
            "Olá {name}, como você está? Temos algumas novidades pra você!",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template:
            "Bom dia, {name}! Podemos conversar para saber como podemos ajudar você?",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template: "Oi {name}! Tudo bem?",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template: "{name}, essa oportunidade não pode passar assim!",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template: "{name}, como vai? Tudo bem?",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template:
            "Vamos aproveitar {name}! Essa é a hora de ter seu nome limpo novamente!",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          template:
            "Olá {name}, você nos pediu um retorno, podemos falar agora?",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Greeting_Templates", {});
  }
};
