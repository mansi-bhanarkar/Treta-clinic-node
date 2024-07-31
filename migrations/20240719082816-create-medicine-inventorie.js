'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Medicine_inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Appointment_bookings',
          key: 'id'
        }
      },
      medicine_details_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Medicine_details',
          key: 'id'
        }
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        default: true
      },
      qty: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Users',
          key: 'id'
        }
      },
      updated_by: {
        type: Sequelize.INTEGER,        
        allowNull: false,
        references: {         
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Medicine_inventories');
  }
};