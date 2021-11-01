const bcrypt = require('bcrypt')
const AppError = require('../../error/appError')
const err = require('../../error/config')
const { departments } = require('../model')
class DepartmentService {
  async create(obj) {
    try {
      const result = await departments.create(obj)
      return result
    } catch (error) {
      return new AppError(error.errors[0].message, 'Fail', 400)
    }
  }

  async findOne(condition) {
    const result = await departments.findOne(condition)
    if (result === null) {
      return new AppError(err.notFound.message, err.notFound.status, err.notFound.statusCode)
    }
    return result
  }

  async update(data, condition) {
    const result = await departments.update(data, condition)
    return result
  }

  async findAll(condition) {
    const result = await departments.findAll(condition)
    return result
  }

  async findByPk(id) {
    const result = await departments.findByPk(id)
    return result
  }

  async destroy(condition) {
    const result = await departments.destroy(condition)
    return result
  }

  async hashPassword(user) {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)
    return hashPassword
  }
}
module.exports = new DepartmentService()
