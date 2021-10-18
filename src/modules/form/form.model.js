const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const form = sequelize.define('forms', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: ['review', 'job'],
  },
  status: {
    type: DataTypes.ENUM,
    values: ['new', 'submitted', 'approval', 'closed'],
    defaultValue: 'new',
  },
  comment: {
    type: DataTypes.STRING,
  },
})

module.exports = form
