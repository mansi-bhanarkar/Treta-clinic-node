'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    uuid: DataTypes.UUID,
    
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    phone_number: DataTypes.INTEGER,
    
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true 
    }

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};