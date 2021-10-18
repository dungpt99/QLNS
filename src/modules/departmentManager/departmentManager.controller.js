const AppError = require('../../error/appError')
const { users, departments, departmentManagers } = require('../model')
const { schemaValidate } = require('./departmentManager.validate')
class DepartmentControllerM {
  //POST create
  async create(req, res, next) {
    const data = req.body
    console.log(data)
    try {
      const value = await schemaValidate.validateAsync(data)
      const user = await users.findOne({ where: { username: value.user } })
      const department = await departments.findOne({ where: { name: value.department } })
      const result = await departmentManagers.create({
        departmentId: department.id,
        userId: user.id,
        fname: user.fname,
        lname: user.lname,
      })
      res.status(200).json({
        result,
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //GET listManager
  async show(req, res, next) {
    const result = await departmentManagers.findAll()
    res.status(200).json({
      result,
    })
  }

  //GET id Manager
  async find(req, res, next) {
    const ManagerId = req.params.id
    const result = await departmentManagers.findByPk(ManagerId)
    res.status(200).json({
      result,
    })
  }

  //PUT edit
  async edit(req, res, next) {
    const ManagerId = req.params.id
    console.log(ManagerId)
    const data = req.body
    try {
      const value = await schemaValidate.validateAsync(data)
      const department = await departments.findOne({ where: { name: value.department } })
      await departmentManagers.update(
        {
          departmentId: department.id,
        },
        {
          where: {
            id: ManagerId,
          },
        }
      )
      const result = await departmentManagers.findByPk(ManagerId)
      res.status(200).json({
        result,
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //DELETE
  async delete(req, res, next) {
    const ManagerId = req.params.id
    await departmentManagers.destroy({ where: { id: ManagerId } })
    res.status(200).json({
      message: 'Success',
    })
  }

  // CheckID
  async checkID(req, res, next, val) {
    const array = []
    const data = await departmentManagers.findAll({
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

module.exports = new DepartmentControllerM()
