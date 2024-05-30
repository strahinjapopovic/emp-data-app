const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/connect");

class Employee extends Model {}

Employee.init(
  {
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    emp_first: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emp_last: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'employee',
  }
);

module.exports = Employee;