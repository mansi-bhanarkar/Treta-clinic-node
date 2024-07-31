'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Procedure_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Procedure_detail.belongsTo(models.Appointment_booking, { foreignKey: 'customer_id' });

    }
  }
  Procedure_detail.init({
    uuid: DataTypes.UUID,
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    procedure_package_details_id : {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name_of_procedure: DataTypes.STRING,
    time_slot: DataTypes.TIME,
    appointment_date: DataTypes.DATEONLY,
    next_session : {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    complaints : {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    payment_type: DataTypes.STRING,
    payment_refrence_number: DataTypes.STRING,
    remark: DataTypes.TEXT('long'),
    status_id :DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    updated_by: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Procedure_detail',
  });
  return Procedure_detail;
};