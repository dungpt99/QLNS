//const nodemailer = require('nodemailer')
const { Op } = require('sequelize')
const AppError = require('../../error/appError')
const { users, forms, departments, roles, reports } = require('../model')
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
          const listForm = await forms.findAll({
            where: {
              userId: e.id,
              status: { [Op.ne]: 'closed' },
              createdAt: {
                [Op.lt]: new Date(),
                [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 10),
              },
            },
          })
          if (listForm.length < 1) {
            await forms.create(
              {
                content,
                userId: e.id,
                type,
              },
              { include: [users] }
            )
          }
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
    const user = await users.findOne({ where: { username: req.user.username } })
    const listForm = await forms.findAll({ where: { userId: user.id, status: 'new' } })
    if (listForm.length === 0) {
      return next(new AppError('Form has expired', 'Fail', 400))
    }
    for (const e of listForm) {
      const report = await reports.findOne({ where: { formId: e.id } })
      if (report === null) {
        e.status = 'submitted'
        await e.save()
        res.status(200).json({
          status: 'Success',
          data: e,
        })
      }
    }
  }

  //PUT Manager approval
  async approval(req, res, next) {
    const formId = req.params.id
    const data = req.body
    const form = await forms.findByPk(formId)
    if (form.status === 'submitted') {
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
      const userDepartment = []
      const userApproveDepartment = []
      const userRole = []
      const userApproveRole = []
      for (const e of user.departments) {
        userDepartment.push(e.name)
      }
      for (const e of userApprove.departments) {
        userApproveDepartment.push(e.name)
      }
      for (const e of user.roles) {
        userRole.push(e.role)
      }
      for (const e of userApprove.roles) {
        userApproveRole.push(e.role)
      }
      for (let i = 0; i < userDepartment.length; i++) {
        if (userApproveDepartment.includes(userDepartment[i])) {
          if (userRole.includes('Director')) {
            if (userApproveRole.includes('Admin')) {
              form.comment = data.comment
              form.status = 'approval'
              await form.save()
            } else {
              return next(new AppError('You do not have permission to perform this action', 'Fail', 403))
            }
          }
          if (userRole.includes('Manager')) {
            if (userApproveRole.includes('Director')) {
              form.comment = data.comment
              form.status = 'approval'
              await form.save()
            } else {
              return next(new AppError('You do not have permission to perform this action', 'Fail', 403))
            }
          }
          if (userRole.includes('Employee') || userRole.includes('Hr')) {
            if (userApproveRole.includes('Manager')) {
              form.comment = data.comment
              form.status = 'approval'
              await form.save()
            } else {
              return next(new AppError('You do not have permission to perform this action', 'Fail', 403))
            }
          }
        }
      }
      res.status(200).json({
        status: 'Success',
        data: form,
      })
    } else {
      next(new AppError('Form has not been submitted'))
    }
  }

  //PUT HR done
  async close(req, res, next) {
    const formId = req.params.id
    const form = await forms.findByPk(formId)
    if (form.status === 'approval') {
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
      const userDepartment = []
      const userApproveDepartment = []
      for (const e of user.departments) {
        userDepartment.push(e.name)
      }
      for (const e of userApprove.departments) {
        userApproveDepartment.push(e.name)
      }
      for (let i = 0; i < userDepartment.length; i++) {
        if (userApproveDepartment.includes(userDepartment[i])) {
          form.status = 'closed'
          await form.save()
          return res.status(200).json({
            status: 'Success',
            data: form,
          })
        }
      }
      next(new AppError('You do not have permission to perform this action', 'Fail', 403))
    } else {
      next(new AppError('Form has not been approved'))
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

  //GET listForm submitted
  async showSubmitted(req, res, next) {
    const form = await forms.findAll({ where: { status: 'submitted' }, include: users })
    res.status(200).json({
      status: 'Success',
      data: {
        form,
      },
    })
  }

  //GET listForm approval
  async showApproval(req, res, next) {
    const form = await forms.findAll({ where: { status: 'approval' }, include: users })
    res.status(200).json({
      status: 'Success',
      data: {
        form,
      },
    })
  }

  //GET listForm closed
  async showClose(req, res, next) {
    const form = await forms.findAll({ where: { status: 'closed' }, include: users })
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
    const form = await forms.findByPk(formId)
    const user = await users.findOne({ where: { id: form.userId }, include: [departments, roles] })
    const userFind = await users.findOne({
      where: {
        username: req.user.username,
      },
      include: [departments, roles],
    })
    const userDepartment = []
    const userFindDepartment = []
    const userRole = []
    const userFindRole = []
    for (const e of user.departments) {
      userDepartment.push(e.name)
    }
    for (const e of userFind.departments) {
      userFindDepartment.push(e.name)
    }
    for (const e of user.roles) {
      userRole.push(e.role)
    }
    for (const e of userFind.roles) {
      userFindRole.push(e.role)
    }
    for (let i = 0; i < userDepartment.length; i++) {
      if (userFindDepartment.includes(userDepartment[i])) {
        if (userRole.includes('Director')) {
          if (userFindRole.includes('Admin') || userFindRole.includes('Hr') || userFindRole.includes('Director')) {
            return res.status(200).json({ form })
          }
        }
        if (userRole.includes('Manager')) {
          if (
            userFindRole.includes('Admin') ||
            userFindRole.includes('Hr') ||
            userFindRole.includes('Director') ||
            userFindRole.includes('Manager')
          ) {
            return res.status(200).json({ form })
          }
        }
        if (userRole.includes('Hr')) {
          if (
            userFindRole.includes('Admin') ||
            userFindRole.includes('Hr') ||
            userFindRole.includes('Director') ||
            userFindRole.includes('Manager')
          ) {
            return res.status(200).json({ form })
          }
        }
        if (userRole.includes('Employee')) {
          if (
            userFindRole.includes('Admin') ||
            userFindRole.includes('Hr') ||
            userFindRole.includes('Director') ||
            userFindRole.includes('Manager') ||
            userFindRole.includes('Employee')
          ) {
            return res.status(200).json({ form })
          }
        }
      }
    }
    next(new AppError('You do not have permission to perform this action', 'Fail', 403))
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
