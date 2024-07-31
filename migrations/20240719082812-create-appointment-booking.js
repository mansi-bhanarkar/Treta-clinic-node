'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointment_bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      case_id: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Branches',
          key: 'id'
        }
      },
      patient_type: {
        type: Sequelize.STRING
      },
      consultation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Consultations',
          key: 'id'
        }
      },
      age: {
        type: Sequelize.INTEGER
      },
      sex: {
        type: Sequelize.STRING
      },
      contact_number: {
        type: Sequelize.INTEGER
      },
      email_id: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      refering_doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Users',
          key: 'id'
        }
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         
          model: 'Departments',
          key: 'id'
        }
      },
      patient_source: {
        type: Sequelize.STRING
      },
      time_slot: {
        type: Sequelize.TIME
      },
      appoinment_date: {
        type: Sequelize.DATEONLY
      },
      complaints: {
        type: Sequelize.TEXT('long')
      },
      payment_type: {
        type: Sequelize.STRING
      },
      payment_refrence_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remark: {
        type: Sequelize.TEXT('long')
      },
      procedure_flag: {
        type: Sequelize.BOOLEAN,
        default: false
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
    await queryInterface.dropTable('Appointment_bookings');
  }
};