const { users, roles, permissions } = require('../model')
class PermissionController {
  async create(req, res, next) {
    const roleId = req.params.id
    const data = req.body
    console.log(data.CREATE)
    const user = await users.findOne({ where: { email: req.user.email }, include: roles })
    const array = []
    const result = user.roles.forEach((e) => {
      array.push(e.id)
    })
    res.json({
      data: array,
    })
  }
}

module.exports = new PermissionController()
