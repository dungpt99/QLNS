const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const token = sequelize.define(
  'token',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
    },
  },
  {
    freezeTableName: true,
  }
)

module.exports = token
