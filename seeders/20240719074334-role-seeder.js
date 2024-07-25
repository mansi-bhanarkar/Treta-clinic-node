'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles',[
      {
        "name":"Super Admin"
      },
      {
        "name":"Doctor"
      },
      {
        "name":"Receptionist"
      },
      {
        "name":"Technician"
      }
    ])
},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
