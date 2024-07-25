'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Payment_statuses',[
      {
        "name":"Pending"
      },
      {
        "name":"Completed"
      },
      {
        "name":"Failed"
      },
      {
        "name":"Cancelled"
      },
      {
        "name":"Refunded"
      },
      {
        "name":"Partially Refunded"
      },

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
