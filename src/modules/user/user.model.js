const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const user = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  fname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userImg: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
  },
})

module.exports = user
