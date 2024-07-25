'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Procedure_package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Procedure_package.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Procedure_package',
  });
  return Procedure_package;
};