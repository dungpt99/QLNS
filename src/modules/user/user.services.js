const AppError = require('../../error/appError')
const { users } = require('../model')
class UserService {
  async create(obj) {
    try {
      const result = await users.create(obj)
      return result
    } catch (error) {
      return new AppError(error.errors[0].message, 'Fail', 400)
    }
  }

  async findOne(condition) {
    const result = await users.findOne(condition)
    return result
  }

  async update(data, condition) {
    const result = await users.update(data, condition)
    return result
  }

  async findAll(condition) {
    const result = await users.findAll(condition)
    return result
  }

  async findByPk(id) {
    const result = await users.findByPk(id)
    return result
  }

  async destroy(condition) {
    const result = await users.destroy(condition)
    return result
  }
}
module.exports = new UserService()
