'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Procedure_package_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Procedure_package_detail.init({
    uuid : DataTypes.UUID,
    procedure_package_id : DataTypes.INTEGER,
    procedure_id : DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    no_of_session: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    is_refund: DataTypes.BOOLEAN,
    is_cancelled: DataTypes.BOOLEAN,
    created_by : DataTypes.INTEGER,
    updated_by : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Procedure_package_detail',
  });
  return Procedure_package_detail;
};