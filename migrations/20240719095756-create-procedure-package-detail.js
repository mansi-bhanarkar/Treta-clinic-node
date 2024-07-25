'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Procedure_package_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID
      },
      procedure_package_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Procedure_packages',
          key: 'id'
        }
      },
      procedure_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Procedures',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.INTEGER
      },
      no_of_session: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        default: true
      },
      is_refund: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      is_cancelled: {
        type: Sequelize.BOOLEAN,
        default: false
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
    await queryInterface.dropTable('Procedure_package_details');
  }
};