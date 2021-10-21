const users = require('../user/user.model')
const forms = require('../form/form.model')
const reports = require('../report/report.model')
const roles = require('../role/role.model')
const permissions = require('../permission/permission.model')
const departments = require('../department/department.model')
const token = require('../auth/auth.model')

users.hasOne(token)
token.belongsTo(users)

users.belongsToMany(roles, { through: 'userRole' })
roles.belongsToMany(users, { through: 'userRole' })

users.belongsToMany(departments, { through: 'userDepartment' })
departments.belongsToMany(users, { through: 'userDepartment' })

users.hasMany(forms)
forms.belongsTo(users)

roles.hasMany(permissions)
permissions.belongsTo(roles)

forms.hasOne(reports)
reports.belongsTo(forms)

module.exports = {
  users,
  token,
  forms,
  reports,
  roles,
  permissions,
  departments,
}
