const cron = require('node-cron')
const { Op } = require('sequelize')
const { users, reports, forms } = require('../model')

cron.schedule('* * * * * *', async () => {
  const listForm = await forms.findAll(
    {
      where: {
        status: { [Op.ne]: 'closed' },
        createdAt: {
          [Op.lt]: new Date(new Date() - 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      logging: false,
    }
  )
  for (const item of listForm) {
    const user = await users.findByPk(item.userId)
    const listReport = await reports.findAll()
    const arr = []
    for (const e of listReport) {
      arr.push(e.formId)
    }
    if (!arr.includes(item.id)) {
      await reports.create({
        formId: item.id,
        fname: user.fname,
        lname: user.lname,
        status: item.status,
        type: item.type,
        expired: new Date(item.createdAt.getTime() + 24 * 60 * 60 * 1000),
      })
    }
  }
})

class ReportController {
  //GET
  async job(req, res, next) {
    const listReport = await reports.findAll({
      where: {
        type: 'job',
      },
    })
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
