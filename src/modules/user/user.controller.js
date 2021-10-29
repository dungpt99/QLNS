const bcrypt = require('bcrypt')
const { users, roles, departments } = require('../model')
const AppError = require('../../error/appError')
const transporter = require('../mailer')
const userService = require('./user.services')

class UserController {
  // GET
  async show(req, res, next) {
    const listUser = await userService.findAll({ include: [roles, departments] })
    if (listUser === null) {
      return next(new AppError('', 'Success', 200))
    }
    res.status(200).json({
      message: 'Success',
      data: listUser,
    })
  }

  // GET(by id)
  async find(req, res, next) {
    const userId = req.params.id
    const user = await userService.findByPk(userId)
    res.status(200).json({
      status: 'Success',
      data: {
        user,
      },
    })
  }

  //POST create user
  async signup(req, res, next) {
    const data = req.body
    const user = await userService.create(data)
    if (user.statusCode) {
      return next(user)
    }
    const mailOption = {
      from: '"New user" <dungpt.ct2@gmail.com>',
      to: user.email,
      subject: 'DungPT -Welcome to VMO',
      html: `<h2> Username:${user.username} </h2>
                <h2>Password:${user.password}</h2>
                <a href='http://${req.headers.host}/users/verify-email?username=${user.username}'>Click here to active your account</a>`,
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)
    user.password = hashPassword
    await user.save()
    // Sending mail
    transporter.sendMail(mailOption, (err) => {
      if (err) {
        console.log(err)
      } else {
        res.status(200).json({
          message: 'Verification email is sent your gmail account',
        })
      }
    })
  }

  // PUT edit user
  async edit(req, res, next) {
    const userId = req.params.id
    const data = req.body
    await users.update(data, {
      where: {
        id: userId,
      },
    })
    res.status(200).json({
      status: 'Success',
    })
  }

  // PUT edit user
  async editP(req, res, next) {
    const user = await userService.findOne({ where: { username: req.user.username } })
    const data = req.body
    await userService.update(data, { where: { id: user.id } })
    res.status(200).json({
      status: 'Success',
    })
  }

  // DELETE user
  async delete(req, res, next) {
    const userId = req.params.id
    await userService.destroy({
      where: {
        id: userId,
      },
    })
    res.status(200).json({
      status: 'Success',
    })
  }

  // Verify
  async verifyEmail(req, res, next) {
    const { username } = req.query
    const user = await userService.findOne({ where: { username } })
    if (user === null) {
      next(new AppError('Email is not verified', 'Fail', 404))
    } else {
      user.status = true
      await user.save()
      next(new AppError('Email is verified', 'Success', 200))
    }
  }

  // CheckID
  async checkID(req, res, next, val) {
    const array = []
    const data = await userService.findAll({
      attributes: ['id'],
    })
    data.forEach((e) => array.push(e.dataValues.id))

    if (!array.includes(val)) {
      return res.status(404).json({
        status: 'Fail',
        message: 'Invalid ID',
      })
    }
    next()
  }
}

module.exports = new UserController()
