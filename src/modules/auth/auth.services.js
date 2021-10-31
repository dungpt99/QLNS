const bcrypt = require('bcrypt')
const AppError = require('../../error/appError')
const { token } = require('../model')
class TokenService {
  async create(obj) {
    try {
      const result = await token.create(obj)
      return result
    } catch (error) {
      return new AppError(error.errors[0].message, 'Fail', 400)
    }
  }

  async findOne(condition) {
    const result = await token.findOne(condition)
    return result
  }

  async destroy(condition) {
    const result = await token.destroy(condition)
    return result
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
  }

  async mailOption(user, newPassword) {
    return {
      from: '"Create new password" <dungpt.ct2@gmail.com>',
      to: user.email,
      subject: 'DungPT -Create new password',
      html: `<h2>New password ${newPassword} </h2>`,
    }
  }
}
module.exports = new TokenService()
