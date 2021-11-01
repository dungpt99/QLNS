const { roles, departments } = require('../model')
const AppError = require('../../error/appError')
const err = require('../../error/config')
const transporter = require('../mailer')
const userService = require('./user.services')

class UserController {
  // GET
  async show(req, res, next) {
    const listUser = await userService.findAll({ include: [roles, departments] })
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
    data.status = false
    const user = await userService.create(data)
    if (user.statusCode) {
      return next(user)
    }
    // Sending mail
    transporter.sendMail(await userService.mailOption(user, req), async (err) => {
      if (err) {
        console.log(err)
      } else {
        user.password = await userService.hashPassword(user)
        await user.save()
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
    await userService.update(data, {
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
      next(new AppError(err.notFound.message, err.notFound.status, err.notFound.statusCode))
    } else {
      user.status = true
      await user.save()
      res.status(200).json({
        message: 'Email is verified',
      })
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
      return next(new AppError(err.errId.message, err.errId.status, err.errId.statusCode))
    }
    next()
  }
}

module.exports = new UserController()
