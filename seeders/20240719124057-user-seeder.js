'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin@gmail.com', 10); // Hash the password
    const generateUniqueId = () => {
        return uuidv4();
    };
  
    return queryInterface.bulkInsert('Users',[
      {
        "uuid":generateUniqueId(),
        "name": "Super Admin",
        "role_id": 1,
        "branch_id": null,
        "phone_number": 1234567890,
        "address": "Sidhivinayak",
        "city": "Ahm",
        "state": "Guj",
        "country": "india",
        "profile_photo": null,
        "email": "admin@gmail.com",
        "password": hashedPassword,
        "department_id": null,
        "is_active":1,
        "createdAt": new Date(), // Include timestamps if your table has them
        "updatedAt": new Date()  // Include timestamps if your table has them
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
