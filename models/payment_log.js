'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment_log extends Model {
    static associate(models) {
      // Define association here
      Payment_log.belongsTo(models.Appointment_booking, { foreignKey: 'customer_id' });
    }
  }

  Payment_log.init({
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_master_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    procedure_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    payment_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_refund: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    payment_refund_type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Payment_log',
  });

  return Payment_log;
};
