const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const departmentEmployee = sequelize.define('departmentEmployee', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  departmentId: {
    type: DataTypes.UUID,
  },
  userId: {
    type: DataTypes.UUID,
  },
  departmentManagerId: {
    type: DataTypes.UUID,
  },
  fname: {
    type: DataTypes.STRING,
  },
  lname: {
    type: DataTypes.STRING,
  },
})

module.exports = departmentEmployee
