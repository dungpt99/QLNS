const users = require('../user/user.model')
const forms = require('../form/form.model')
const reports = require('../report/report.model')
const roles = require('../role/role.model')
const permissions = require('../permission/permission.model')
const departments = require('../department/department.model')
const departmentEmployees = require('../departmentEmployee/departmentEmloyee.model')
const departmentManagers = require('../departmentManager/departmentManager.model')

users.belongsToMany(roles, { through: 'userRole' })
roles.belongsToMany(users, { through: 'userRole' })

users.hasMany(forms)
forms.belongsTo(users)

roles.hasMany(permissions)
permissions.belongsTo(roles)

forms.hasOne(reports)
reports.belongsTo(forms)

//Department <=> DepartmentManager
departments.hasMany(departmentManagers)
departmentManagers.belongsTo(departments)

//Department <=> DepartmentEmployee
departments.hasMany(departmentEmployees)
departmentEmployees.belongsTo(departments)

//DepartmentManager <=> DepartmentEmployee
departmentManagers.hasMany(departmentEmployees)
departmentEmployees.belongsTo(departmentManagers)

//User <=> DepartmentEmployee
users.hasMany(departmentEmployees)
departmentEmployees.belongsTo(users)

//User <=> DepartmentManager
users.hasMany(departmentManagers)
departmentManagers.belongsTo(users)

module.exports = {
  users,
  forms,
  reports,
  roles,
  permissions,
  departments,
  departmentEmployees,
  departmentManagers,
}
