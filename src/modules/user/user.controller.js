const bcrypt = require('bcrypt')
const { users, roles, departments } = require('../model')
const validate = require('./user.validate')
const AppError = require('../../error/appError')
const transporter = require('../mailer')

class UserController {
  // GET
  async show(req, res, next) {
    const listUser = await users.findAll({ include: [roles, departments] })
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
    const user = await users.findByPk(userId)
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
    try {
      const value = await validate.schemaValidate.validateAsync(data)
      const { fname, lname, username, password, email, address } = value
      const user = await users.create({
        fname,
        lname,
        username,
        password,
        email,
        address,
        userImg: req.file.path,
        status: false,
      })
      //Send verification mail to user
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
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  // PUT edit user
  async edit(req, res, next) {
    const userId = req.params.id
    const data = req.body
    try {
      const value = await validate.schemaValidateEditUser.validateAsync(data)
      const { fname, lname, address } = value
      await users.update(
        {
          fname,
          lname,
          address,
          userImg: req.file.path,
        },
        {
          where: {
            id: userId,
          },
        }
      )
      res.status(200).json({
        status: 'Success',
      })
    } catch (error) {
      next(new AppError(error.details[0].message, 'Fail', 400))
    }
  }

  // PUT edit user
  async editP(req, res, next) {
    const user = await users.findOne({ where: { username: req.user.username } })
    const data = req.body
    try {
      const value = await validate.schemaValidateEditUser.validateAsync(data)
      const { fname, lname, address } = value
      await users.update(
        {
          fname,
          lname,
          address,
          userImg: req.file.path,
        },
        {
          where: {
            id: user.id,
          },
        }
      )
      res.status(200).json({
        status: 'Success',
      })
    } catch (error) {
      next(new AppError(error.details[0].message, 'Fail', 400))
    }
  }

  // DELETE user
  async delete(req, res, next) {
    const userId = req.params.id
    await users.destroy({
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
    const user = await users.findOne({ where: { username } })
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
    const data = await users.findAll({
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
