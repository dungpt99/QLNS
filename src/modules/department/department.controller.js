const AppError = require('../../error/appError')
const { departments, users, roles } = require('../model')
const { schemaValidate } = require('./department.validate')
class DepartmentController {
  //POST create department
  async create(req, res, next) {
    const data = req.body
    try {
      const value = await schemaValidate.validateAsync(data)
      const { name, address } = value
      const department = await departments.create({
        name,
        address,
      })
      res.status(200).json({
        department,
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //GET listDepartment
  async show(req, res, next) {
    const listDepartment = await departments.findAll({ include: [users] })
    res.status(200).json({
      listDepartment,
    })
  }

  //GET department
  async find(req, res, next) {
    const departmentId = req.params.id
    console.log(departmentId)
    const department = await departments.findByPk(departmentId)
    res.status(200).json({
      department,
    })
  }

  //PUT edit department
  async edit(req, res, next) {
    const departmentId = req.params.id
    const data = req.body
    try {
      const value = await schemaValidate.validateAsync(data)
      const { name, address } = value
      await departments.update(
        {
          name,
          address,
        },
        {
          where: {
            id: departmentId,
          },
        }
      )
      const department = await departments.findByPk(departmentId)
      res.status(200).json({
        department,
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //POST add user
  async addUser(req, res, next) {
    const data = req.body
    try {
      const user = await users.findOne({
        where: { username: data.username },
        include: {
          model: roles,
        },
      })
      const department = await departments.findOne({ where: { name: data.department } })
      await user.addDepartments(department)
      await department.addUsers(user)
      const result = await users.findOne({
        where: { username: data.username },
        include: [roles, departments],
      })
      res.status(200).json({
        result,
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //DELETE
  async delete(req, res, next) {
    const departmentId = req.params.id
    await departments.destroy({
      where: {
        id: departmentId,
      },
    })
    res.status(200).json({
      message: 'Success',
    })
  }

  // CheckID
  async checkID(req, res, next, val) {
    const array = []
    const data = await departments.findAll({
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

module.exports = new DepartmentController()
