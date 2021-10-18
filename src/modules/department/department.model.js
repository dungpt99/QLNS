const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const departments = sequelize.define('departments', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
})

module.exports = departments
