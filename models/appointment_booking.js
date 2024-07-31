'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment_booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment_booking.hasMany(models.Payment_log, { foreignKey: 'customer_id' });
      Appointment_booking.hasMany(models.Procedure_detail, { foreignKey: 'customer_id' });

    }
  }
  Appointment_booking.init({
    case_id: DataTypes.STRING,
    name: DataTypes.STRING,
    branch_id: DataTypes.INTEGER,
    patient_type: DataTypes.STRING,
    consultation_id : DataTypes.INTEGER,
    age: DataTypes.INTEGER,
    sex: DataTypes.STRING,
    contact_number: DataTypes.INTEGER,
    email_id: DataTypes.STRING,
    birthday: DataTypes.DATE,
    refering_doctor_id : DataTypes.INTEGER,
    department_id: DataTypes.INTEGER,
    patient_source: DataTypes.STRING,
    time_slot: DataTypes.TIME,
    appoinment_date: DataTypes.DATEONLY,
    complaints: DataTypes.TEXT('long'),
    payment_type: DataTypes.STRING,
    payment_refrence_number: DataTypes.STRING,
    remark: DataTypes.TEXT('long'),
    procedure_flag: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
    updated_by: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Appointment_booking',
  });
  return Appointment_booking;
};