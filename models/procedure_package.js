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
      Procedure_package.hasMany(models.Procedure_package_detail, {
          as: 'Procedure_package_details', // This alias should match
          foreignKey: 'procedure_package_id'
      });
    }
  }
  Procedure_package.init({
    uuid : DataTypes.UUID,
    customer_id : DataTypes.INTEGER,
    name: DataTypes.STRING,
    total_amount : DataTypes.INTEGER,
    is_active : DataTypes.BOOLEAN,
    is_refund : DataTypes.BOOLEAN,
    is_cancelled : DataTypes.BOOLEAN,
    created_by : DataTypes.INTEGER,
    updated_by : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Procedure_package',
  });
  return Procedure_package;
};