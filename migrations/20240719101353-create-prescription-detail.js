'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Prescription_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      procedure_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Procedure_details',
          key: 'id'
        }
      },
      medicine: {
        type: Sequelize.STRING
      },
      type_of_medicine: {
        type: Sequelize.STRING
      },
      frequency: {
        type: Sequelize.STRING
      },
      timing: {
        allowNull: true,
        type: Sequelize.STRING
      },
      days: {
        allowNull: true,
        type: Sequelize.STRING
      },
      duration: {
        allowNull: true,
        type: Sequelize.STRING
      },
      notes: {
        allowNull: true,
        type: Sequelize.TEXT('long')
      },
      total_quantity: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      instractions: {
        allowNull: true,
        type: Sequelize.STRING
      },
      followup: {
        allowNull: true,
        type: Sequelize.STRING
      },
      prescription_advice: {
        allowNull: true,
        type: Sequelize.TEXT('long')
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
    await queryInterface.dropTable('Prescription_details');
  }
};