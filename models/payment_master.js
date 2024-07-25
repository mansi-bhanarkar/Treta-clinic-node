'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment_master.init({
    customer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payment_master',
  });
  return Payment_master;
};