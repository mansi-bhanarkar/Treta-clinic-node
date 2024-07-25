'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coupon_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Coupon_user.init({
    customer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Coupon_user',
  });
  return Coupon_user;
};