'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appoinment_booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Appoinment_booking.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Appoinment_booking',
  });
  return Appoinment_booking;
};