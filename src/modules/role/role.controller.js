const AppError = require('../../error/appError')
const { users, roles, permissions } = require('../model')
const { schemaValidate } = require('./role.validate')

class RoleController {
  //POST create role
  async create(req, res, next) {
    const data = req.body
    const user = await users.findOne({ where: { username: req.user.username } })
    try {
      const value = await schemaValidate.validateAsync(data)
      const { name, read, write, update, del, approve } = value
      const role = await roles.create({
        name,
      })
      await permissions.bulkCreate([
        { roleId: role.id, action: read.action, checkAction: read.checkAction },
        { roleId: role.id, action: write.action, checkAction: write.checkAction },
        { roleId: role.id, action: update.action, checkAction: update.checkAction },
        { roleId: role.id, action: del.action, checkAction: del.checkAction },
        { roleId: role.id, action: approve.action, checkAction: approve.checkAction },
      ])
      // if (role.name === 'Admin') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 1 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 1 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 1 },
      //   ])
      // }
      // if (role.name === 'Director') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 1 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 0 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 1 },
      //   ])
      // }
      // if (role.name === 'Manager') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 0 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 0 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 1 },
      //   ])
      // }
      // if (role.name === 'Hr') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 1 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 0 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 0 },
      //   ])
      // }
      // if (role.name === 'Employee') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 0 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 0 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 0 },
      //   ])
      // }
      await role.addUsers(user)
      await user.addRoles(role)
      const result = await roles.findOne({ where: { id: role.id }, include: [users, permissions] })
      if (result !== null) {
        res.status(200).json({
          result,
        })
      }
    } catch (error) {
      console.log(error)
      next(error, 'Fail', 400)
    }
  }

  //GET listRole
  async show(req, res, next) {
    const listRole = await roles.findAll()
    res.status(200).json({
      data: listRole,
    })
  }

  //GET role
  async find(req, res, next) {
    const roleId = req.params.id
    const role = await roles.findByPk(roleId)
    res.status(200).json({
      data: role,
    })
  }

  //PUT role
  async edit(req, res, next) {
    const roleId = req.params.id
    const data = req.body
    try {
      const value = await schemaValidate.validateAsync(data)
      const { name, read, write, update, del, approve } = value
      await roles.update({ name }, { where: { id: roleId } })
      const role = await roles.findByPk(roleId)
      await permissions.destroy({ where: { roleId: role.id } })
      await permissions.bulkCreate([
        { roleId: role.id, action: read.action, checkAction: read.checkAction },
        { roleId: role.id, action: write.action, checkAction: write.checkAction },
        { roleId: role.id, action: update.action, checkAction: update.checkAction },
        { roleId: role.id, action: del.action, checkAction: del.checkAction },
        { roleId: role.id, action: approve.action, checkAction: approve.checkAction },
      ])
      // if (role.name === 'Admin') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 1 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 1 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 1 },
      //   ])
      // }
      // if (role.name === 'Director') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 1 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 0 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 1 },
      //   ])
      // }
      // if (role.name === 'Manager') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 0 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 0 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 1 },
      //   ])
      // }
      // if (role.name === 'Hr') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 1 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 0 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 0 },
      //   ])
      // }
      // if (role.name === 'Employee') {
      //   await permissions.bulkCreate([
      //     { roleId: role.id, action: 'READ', checkAction: 1 },
      //     { roleId: role.id, action: 'WRITE', checkAction: 0 },
      //     { roleId: role.id, action: 'UPDATE', checkAction: 1 },
      //     { roleId: role.id, action: 'DELETE', checkAction: 0 },
      //     { roleId: role.id, action: 'APPROVE', checkAction: 0 },
      //   ])
      // }
      res.status(200).json({
        data: role,
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //DELETE role
  async delete(req, res, next) {
    const roleId = req.params.id
    await roles.destroy({ where: { id: roleId } })
    await permissions.destroy({ where: { roleId } })
    res.status(200).json({
      message: 'Success',
    })
  }

  // CheckID
  async checkID(req, res, next, val) {
    const array = []
    const data = await roles.findAll({
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
