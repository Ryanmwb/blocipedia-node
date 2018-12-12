'use strict';

const faker = require("faker");

let wikis = [];

for(let i=0; i < 16; i++){
  wikis.push({
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: faker.random.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 18
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(' Wikis', null, {})
  }
};
