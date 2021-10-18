const { Op } = require('sequelize')
const { reports, forms } = require('../model')

class ReportController {
  //GET
  async job(req, res, next) {
    const listForm = await forms.findAll({
      where: {
        status: { [Op.ne]: 'closed' },
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000),
        },
      },
    })
    const result = new Date(listForm[0].createdAt.getTime() + 24 * 60 * 60 * 1000)
    res.status(200).json({
      result,
    })
  }

  //GET
  async review(req, res, next) {}
}

module.exports = new ReportController()
