const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const AppError = require('../../error/appError')
const transporter = require('../mailer')
const err = require('../../error/config')
const userService = require('../user/user.services')
const tokenService = require('./auth.services')

class AuthController {
  //Login
  async login(req, res, next) {
    const data = req.body
    const user = await userService.findOne({
      where: {
        username: data.username,
      },
    })
    if (user === null) {
      next(
        new AppError(
          err.errUsernamePassword.message,
          err.errUsernamePassword.status,
          err.errUsernamePassword.statusCode
        )
      )
    } else {
      if (user.status === true) {
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
          await tokenService.create({
            token: refreshToken,
            userId: user.id,
          })
          res.status(200).json({
            accessToken,
            refreshToken,
          })
        } else {
          next(
            new AppError(
              err.errUsernamePassword.message,
              err.errUsernamePassword.status,
              err.errUsernamePassword.statusCode
            )
          )
        }
      }
      if (user.status === false) {
        next(new AppError(err.errorEmail.message, err.errorEmail.status, err.errorEmail.statusCode))
      }
    }
  }

  // Refresh Token
  async refreshToken(req, res, next) {
    const refreshToken = req.body.token
    const result = await tokenService.findOne({
      where: {
        token: refreshToken,
      },
    })
    if (result === null) {
      return next(new AppError(err.Forbidden.message, err.Forbidden.status, err.Forbidden.statusCode))
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) return next(new AppError(err.Forbidden.message, err.Forbidden.status, err.Forbidden.statusCode))
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
    const user = await userService.findOne({
      where: {
        username: req.user.username,
      },
    })
    await tokenService.destroy({
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
    const user = await userService.findOne({ where: { email: data.email } })
    if (user === null) {
      next(new AppError(err.notFound.message, err.notFound.status, err.notFound.statusCode))
    }
    const newPassword = Math.random().toString(36).substring(2, 7)
    user.password = await tokenService.hashPassword(newPassword)
    await user.save()
    // Sending mail
    transporter.sendMail(await tokenService.mailOption(user, newPassword), (err) => {
      if (err) {
        console.log(err)
      } else {
        res.status(200).json({
          message: 'New password is sent your gmail account',
        })
      }
    })
  }

  //ResetPassword
  async resetPassword(req, res, next) {
    const data = req.body
    const { password, newPassword, email } = data
    const user = await userService.findOne({ where: { email } })
    if (user === null) {
      return next(
        new AppError(
          err.errUsernamePassword.message,
          err.errUsernamePassword.status,
          err.errUsernamePassword.statusCode
        )
      )
    }
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      user.password = await tokenService.hashPassword(newPassword)
      await user.save()
      res.status(200).json({ user })
    } else {
      next(
        new AppError(
          err.errUsernamePassword.message,
          err.errUsernamePassword.status,
          err.errUsernamePassword.statusCode
        )
      )
    }
  }
}

module.exports = new AuthController()
