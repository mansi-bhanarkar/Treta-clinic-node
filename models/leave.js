'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Leave.init({
    user_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
    start_date: DataTypes.TIME,
    end_date: DataTypes.TIME,
    uuid: DataTypes.UUID,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Leave',
  });

  return Leave;
};
