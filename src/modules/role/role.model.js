const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const role = sequelize.define('roles', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  role: {
    type: DataTypes.ENUM,
    values: ['Admin', 'Director', 'Hr', 'Manager', 'Employee'],
  },
})

module.exports = role
