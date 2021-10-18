const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const report = sequelize.define('reports', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  formId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fname: {
    type: DataTypes.STRING,
  },
  lname: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['new', 'submitted', 'approval', 'closed'],
  },
  expired: {
    type: DataTypes.TIME,
  },
})

module.exports = report
