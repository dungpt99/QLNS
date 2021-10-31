const { departments, users, roles } = require('../model')
const departmentService = require('./department.service')
const userService = require('../user/user.services')
class DepartmentController {
  //POST create department
  async create(req, res, next) {
    const data = req.body
    const { name, address } = data
    const department = await departmentService.create({
      name,
      address,
    })
    res.status(200).json({
      department,
    })
  }

  //GET listDepartment
  async show(req, res, next) {
    const listDepartment = await departmentService.findAll({ include: [users] })
    res.status(200).json({
      listDepartment,
    })
  }

  //GET department
  async find(req, res, next) {
    const departmentId = req.params.id
    const department = await departmentService.findByPk(departmentId)
    res.status(200).json({
      department,
    })
  }

  //PUT edit department
  async edit(req, res, next) {
    const departmentId = req.params.id
    const data = req.body
    const { name, address } = data
    await departmentService.update(
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
  }

  //POST add user
  async addUser(req, res, next) {
    const data = req.body
    const user = await userService.findOne({
      where: { username: data.username },
      include: {
        model: roles,
      },
    })
    if (user.statusCode) {
      return next(user)
    }
    const department = await departmentService.findOne({ where: { name: data.department } })
    if (department.statusCode) {
      return next(department)
    }
    await user.addDepartments(department)
    await department.addUsers(user)
    const result = await userService.findOne({
      where: { username: data.username },
      include: [roles, departments],
    })
    res.status(200).json({
      result,
    })
  }

  //DELETE
  async delete(req, res, next) {
    const departmentId = req.params.id
    await departmentService.destroy({
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
