'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init({
    user_id: DataTypes.INTEGER,
    uuid: DataTypes.UUID,
    working_days: DataTypes.INTEGER,
    working_hours: DataTypes.INTEGER,
    procedure_duration: DataTypes.INTEGER,
    appoinment_duration: DataTypes.INTEGER,
    in_time: DataTypes.TIME,
    out_time: DataTypes.TIME,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Setting',
  });
  return Setting;
};