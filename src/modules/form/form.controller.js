//const nodemailer = require('nodemailer')
const AppError = require('../../error/appError')
const { users, forms, departments, roles } = require('../model')
const { schemaValidate } = require('./form.validate')
const transporter = require('../mailer')

class FormController {
  //POST create form
  async create(req, res, next) {
    const data = req.body
    try {
      const value = await schemaValidate.validateAsync(data)
      const { content, type } = value
      const listUser = await users.findAll()
      listUser.forEach(async (e) => {
        if (e.username !== 'Admin') {
          await forms.create(
            {
              content,
              userId: e.id,
              type,
            },
            { include: [users] }
          )
        }
      })
      const listForm = await forms.findAll({ include: [users] })

      const listEmail = []
      for (const element of listUser) {
        listEmail.push(element.email)
      }

      //Send mail to user
      const mailOption = {
        from: '"Notification" <dungpt.ct2@gmail.com>',
        to: listEmail,
        subject: 'Notification',
        html: `<h2> Admin created ${type} form </h2>`,
      }

      //Sending mail
      transporter.sendMail(mailOption, (err) => {
        if (err) {
          console.log(err)
        }
      })

      res.status(200).json({
        status: 'Success',
        data: {
          listForm,
        },
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //PUT send form
  async send(req, res, next) {
    const formId = req.params.id
    const form = await forms.findByPk(formId)
    if (form === null) {
      next(new AppError('Can not find form', 'Fail', 404))
    } else {
      form.status = 'submitted'
      await form.save()
      res.status(200).json({
        status: 'Success',
        data: form,
      })
    }
  }

  //PUT Manager approval
  async approval(req, res, next) {
    const formId = req.params.id
    const data = req.body
    const form = await forms.findByPk(formId)
    const user = await users.findOne({
      where: {
        id: form.userId,
      },
      include: [departments, roles],
    })
    const userApprove = await users.findOne({
      where: {
        username: req.user.username,
      },
      include: [departments, roles],
    })
    if (user.departments[0].name === userApprove.departments[0].name) {
      // if(user.roles)
    }
    // form.comment = data.comment
    // form.status = 'approval'
    // await form.save()
    res.status(200).json({
      status: 'Success',
      data: { user, userApprove },
    })
  }

  //PUT HR done
  async close(req, res, next) {
    const formId = req.params.id
    const form = await forms.findByPk(formId)
    if (form === null) {
      next(new AppError('Can not find form', 'Fail', 404))
    } else {
      form.status = 'closed'
      await form.save()
      res.status(200).json({
        status: 'Success',
        data: form,
      })
    }
  }

  //GET listForm
  async show(req, res, next) {
    const form = await forms.findAll({ include: users })
    res.status(200).json({
      status: 'Success',
      data: {
        form,
      },
    })
  }

  //GET form
  async find(req, res, next) {
    const formId = req.params.id
    const result = await forms.findByPk(formId)
    res.status(200).json({ result })
  }

  // CheckID
  async checkID(req, res, next, val) {
    const array = []
    const data = await forms.findAll({
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
module.exports = new FormController()
