const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/connect");

class Role extends Model {}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role_title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role_salary: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'role',
  }
);

module.exports = Role;