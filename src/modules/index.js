const userRouter = require('./user/user.route')
const authRouter = require('./auth/auth.route')
const formRouter = require('./form/form.route')
const reportRouter = require('./report/report.route')
const roleRouter = require('./role/role.route')
const permissionRouter = require('./permission/permission.route')
const departmentRouter = require('./department/department.route')

function route(app) {
  app.use('/', authRouter)
  app.use('/department', departmentRouter)
  app.use('/permissions', permissionRouter)
  app.use('/roles', roleRouter)
  app.use('/users', userRouter)
  app.use('/forms', formRouter)
  app.use('/reports', reportRouter)
}

module.exports = route
