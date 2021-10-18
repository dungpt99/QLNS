const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../user/user.model')
const AppError = require('../../error/appError')

class AuthController {
  //Login
  async login(req, res, next) {
    const data = req.body
    const user = await users.findOne({
      where: {
        username: data.username,
      },
    })
    if (user === null) {
      next(new AppError('Please check email and password', 'Fail', 200))
    } else if (user.status === true) {
      const match = await bcrypt.compare(data.password, user.dataValues.password)
      if (match) {
        const accessToken = jwt.sign(
          { username: user.username, email: user.email, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '300000000000s' }
        )
        res.status(200).json({
          accessToken,
        })
      }
    } else if (user.status === false) {
      next(new AppError('User is not verified', 'Fail', 200))
    }
  }

  async restrictTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 'Fail', 403))
      }
      next()
    }
  }
}

module.exports = new AuthController()
