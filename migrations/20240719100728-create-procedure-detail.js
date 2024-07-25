'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Procedure_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Appoinment_bookings',
          key: 'id'
        }
      },
      procedure_package_details_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {         
          model: 'Procedure_package_details',
          key: 'id'
        }
      },
      name_of_procedure: {
        type: Sequelize.STRING
      },
      time_slot: {
        type: Sequelize.DATE
      },
      appoinment_date: {
        type: Sequelize.DATE
      },
      next_session: {
        allowNull: true,
        type: Sequelize.DATE
      },
      complaints: {
        allowNull: true,
        type: Sequelize.TEXT('long')
      },
      payment_type: {
        type: Sequelize.STRING
      },
      payment_refrence_number: {
        type: Sequelize.STRING
      },
      remark: {
        type: Sequelize.TEXT('long')
      },
      status_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {         
          model: 'Statuses',
          key: 'id'
        }
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        default: true
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
    await queryInterface.dropTable('Procedure_details');
  }
};