const AppError = require('../../error/appError')
const { schemaValidate } = require('./form.validate')

class FormMiddleware {
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

module.exports = new FormMiddleware()
