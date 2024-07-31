'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payment_logs', {
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
      payment_master_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {         
          model: 'Payment_masters',
          key: 'id'
        }
      },
      procedure_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {         
          model: 'Procedure_details',
          key: 'id'
        }
      },
      payment_status_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {         
          model: 'Payment_statuses',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.INTEGER
      },
      is_refund: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      payment_refund_type: {
        type: Sequelize.STRING  
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
    await queryInterface.dropTable('Payment_logs');
  }
};