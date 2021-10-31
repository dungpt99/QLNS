const { roles, permissions } = require('../model')
const userService = require('../user/user.services')
const roleService = require('./role.services')

class RoleController {
  //POST create role
  async create(req, res, next) {
    const data = req.body
    const user = await userService.findOne({ where: { username: data.username } })
    if (user.statusCode) {
      return next(user)
    }
    const { read, write, update, del, approve } = data
    const role = await roleService.create({
      role: data.role,
    })
    await permissions.bulkCreate([
      { roleId: role.id, action: read.action, checkAction: read.checkAction },
      { roleId: role.id, action: write.action, checkAction: write.checkAction },
      { roleId: role.id, action: update.action, checkAction: update.checkAction },
      { roleId: role.id, action: del.action, checkAction: del.checkAction },
      { roleId: role.id, action: approve.action, checkAction: approve.checkAction },
    ])
    await role.addUsers(user)
    await user.addRoles(role)
    const result = await roleService.findOne({
      where: { id: role.id },
      include: [users, permissions],
    })
    res.status(200).json({
      result,
    })
  }

  //GET listRole
  async show(req, res, next) {
    const listRole = await roleService.findAll({
      include: [users],
    })
    res.status(200).json({
      data: listRole,
    })
  }

  //GET role
  async find(req, res, next) {
    const roleId = req.params.id
    const role = await roleService.findByPk(roleId)
    res.status(200).json({
      data: role,
    })
  }

  //PUT role
  async edit(req, res, next) {
    const roleId = req.params.id
    const data = req.body
    const { read, write, update, del, approve } = data
    await roles.update({ role: data.role }, { where: { id: roleId } })
    const role = await roleService.findByPk(roleId)
    await permissions.destroy({ where: { roleId: role.id } })
    await permissions.bulkCreate([
      { roleId: role.id, action: read.action, checkAction: read.checkAction },
      { roleId: role.id, action: write.action, checkAction: write.checkAction },
      { roleId: role.id, action: update.action, checkAction: update.checkAction },
      { roleId: role.id, action: del.action, checkAction: del.checkAction },
      { roleId: role.id, action: approve.action, checkAction: approve.checkAction },
    ])
    res.status(200).json({
      data: role,
    })
  }

  //DELETE role
  async delete(req, res, next) {
    const roleId = req.params.id
    await roleService.destroy({ where: { id: roleId } })
    await permissions.destroy({ where: { roleId } })
    res.status(200).json({
      message: 'Success',
    })
  }

  // CheckID
  async checkID(req, res, next, val) {
    const array = []
    const data = await roleService.findAll({
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

module.exports = new RoleController()
