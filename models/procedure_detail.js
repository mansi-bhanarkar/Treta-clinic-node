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
    }
  }
  Procedure_detail.init({
    name_of_procedure: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Procedure_detail',
  });
  return Procedure_detail;
};