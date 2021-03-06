const bcrypt = require('bcrypt')
const AppError = require('../../error/appError')
const err = require('../../error/config')
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
    if (result === null) {
      return new AppError(err.notFound.message, err.notFound.status, err.notFound.statusCode)
    }
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

  async hashPassword(user) {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)
    return hashPassword
  }

  async mailOption(user, req) {
    return {
      from: '"New user" <dungpt.ct2@gmail.com>',
      to: user.email,
      subject: 'DungPT -Welcome to VMO',
      html: `<h2> Username:${user.username} </h2>
                <h2>Password:${user.password}</h2>
                <a href='http://${req.headers.host}/users/verify-email?username=${user.username}'>Click here to active your account</a>`,
    }
  }
}
module.exports = new UserService()
