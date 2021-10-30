const AppError = require('../../error/appError')
const { schemaValidate, schemaValidateEditUser } = require('./user.validate')

class UserMiddleware {
  async sendData(req, res, next) {
    const data = req.body
    try {
      await schemaValidate.validateAsync(data)
      next()
    } catch (error) {
      return next(new AppError(error, 'Fail', 400))
    }
  }

  async sendEditData(req, res, next) {
    const data = req.body
    try {
      await schemaValidateEditUser.validateAsync(data)
      next()
    } catch (error) {
      return next(new AppError(error, 'Fail', 400))
    }
  }
}
module.exports = new UserMiddleware()
