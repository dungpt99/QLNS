const { schemaValidate } = require('./department.validate')

class DepartmentMiddleware {
  async validate(req, res, next) {
    const data = req.body
    try {
      await schemaValidate.validateAsync(data)
      next()
    } catch (error) {
      return next(error, 'Fail', 400)
    }
  }
}
module.exports = new DepartmentMiddleware()
