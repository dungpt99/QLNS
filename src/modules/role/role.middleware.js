const AppError = require('../../error/appError')
const { schemaValidate } = require('./role.validate')

class RoleMiddleware {
  async validate(req, res, next) {
    const data = req.body
    try {
      await schemaValidate.validateAsync(data)
      next()
    } catch (error) {
      return next(new AppError(error, 'Fail', 400))
    }
  }
}

module.exports = new RoleMiddleware()
