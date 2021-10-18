const { Op } = require('sequelize')
const { users, reports, forms } = require('../model')

class ReportController {
  //CATCH data
  async dataJob(req, res, next) {
    await reports.destroy({
      truncate: true,
    })
    const listForm = await forms.findAll({
      where: {
        status: { [Op.ne]: 'closed' },
        type: 'job',
        createdAt: {
          [Op.lt]: new Date(new Date() - 24 * 60 * 60 * 1000),
        },
      },
    })
    for (const item of listForm) {
      const user = await users.findByPk(item.userId)
      await reports.create({
        formId: item.id,
        fname: user.fname,
        lname: user.lname,
        status: item.status,
        type: item.type,
        expired: new Date(item.createdAt.getTime() + 24 * 60 * 60 * 1000),
      })
    }
    next()
  }

  //CATCH data
  async dataReview(req, res, next) {
    await reports.destroy({
      truncate: true,
    })
    const listForm = await forms.findAll({
      where: {
        status: { [Op.ne]: 'closed' },
        type: 'review',
        createdAt: {
          [Op.lt]: new Date(new Date() - 24 * 60 * 60 * 1000),
        },
      },
    })
    for (const item of listForm) {
      const user = await users.findByPk(item.userId)
      await reports.create({
        formId: item.id,
        fname: user.fname,
        lname: user.lname,
        status: item.status,
        type: item.type,
        expired: new Date(item.createdAt.getTime() + 24 * 60 * 60 * 1000),
      })
    }
    next()
  }

  //GET
  async job(req, res, next) {
    const listReport = await reports.findAll()
    res.status(200).json({
      listReport,
    })
  }

  //GET
  async review(req, res, next) {
    const listReport = await reports.findAll({
      where: {
        type: 'review',
      },
    })
    res.status(200).json({
      listReport,
    })
  }
}

module.exports = new ReportController()
