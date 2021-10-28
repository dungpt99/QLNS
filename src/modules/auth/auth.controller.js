const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const AppError = require('../../error/appError')
const { users, token } = require('../model')
const transporter = require('../mailer')
const passwordValidate = require('./auth.validate')

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
          { expiresIn: '600s' }
        )
        const refreshToken = jwt.sign(
          { username: user.username, email: user.email, role: user.role },
          process.env.REFRESH_TOKEN_SECRET
        )
        await token.create({
          token: refreshToken,
          userId: user.id,
        })
        res.status(200).json({
          accessToken,
          refreshToken,
        })
      } else {
        next(new AppError('Please check email and password', 'Fail', 200))
      }
    } else if (user.status === false) {
      next(new AppError('User is not verified', 'Fail', 200))
    }
  }

  // Refresh Token
  async refreshToken(req, res, next) {
    const refreshToken = req.body.token
    const result = await token.findOne({
      where: {
        token: refreshToken,
      },
    })
    if (result === null) {
      return next(new AppError('Please login again', 'Fail', 403))
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) return res.sendStatus(403)
      const accessToken = jwt.sign(
        { username: data.username, email: data.email, role: data.role },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '600s',
        }
      )
      res.status(200).json({ accessToken })
    })
  }

  // Logout
  async logout(req, res, next) {
    const user = await users.findOne({
      where: {
        username: req.user.username,
      },
    })
    await token.destroy({
      where: {
        userId: user.id,
      },
    })
    res.status(200).json({
      message: 'Success',
    })
  }

  // Forgot password
  async forgotPassword(req, res, next) {
    const data = req.body
    const user = await users.findOne({ where: { email: data.email } })
    if (user === null) {
      next(new AppError('Please check your email', 'Fail', 400))
    }
    const newPassword = Math.random().toString(36).substring(2, 7)
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashPassword
    await user.save()
    // Send verification mail to user
    const mailOption = {
      from: '"Create new password" <dungpt.ct2@gmail.com>',
      to: user.email,
      subject: 'DungPT -Create new password',
      html: `<h2>New password ${newPassword} </h2>`,
    }
    // Sending mail
    transporter.sendMail(mailOption, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('New password is sent your gmail account')
      }
    })
    res.status(200).json({ message: 'New password is sent your gmail account' })
  }

  //ResetPassword
  async resetPassword(req, res, next) {
    const data = req.body
    try {
      const value = await passwordValidate.validateAsync(data)
      const { password, newPassword, email } = value
      const user = await users.findOne({ where: { email } })
      if (user === null) {
        return next(new AppError('Please check your email and password', 'Fail', 400))
      }
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashPassword
        await user.save()
        res.status(200).json({ user })
      } else {
        next(new AppError('Please check your password', 'Fail', 400))
      }
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }
}

module.exports = new AuthController()
