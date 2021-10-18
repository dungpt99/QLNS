const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const permission = sequelize.define('permissions', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  roleId: {
    type: DataTypes.UUID,
  },
  action: {
    type: DataTypes.ENUM,
    values: ['Read', 'Write', 'Update', 'Delete', 'Approve'],
  },
  checkAction: {
    type: DataTypes.BOOLEAN,
  },
})

module.exports = permission
