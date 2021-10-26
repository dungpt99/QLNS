const { users, roles, permissions } = require('../model')
class PermissionController {
  async show(req, res, next) {
    const result = await permissions.findAll()
    res.status(200).json({
      result,
    })
  }
}

module.exports = new PermissionController()
