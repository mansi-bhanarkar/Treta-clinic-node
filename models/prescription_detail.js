'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prescription_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Prescription_detail.init({
    medicine: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Prescription_detail',
  });
  return Prescription_detail;
};