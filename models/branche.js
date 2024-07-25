'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branche extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Branche.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    uuid: DataTypes.UUID,
    area: DataTypes.TEXT('long'),
    city: DataTypes.STRING,
    pincode: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Branche',
  });
  return Branche;
};