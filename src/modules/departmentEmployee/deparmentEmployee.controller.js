const AppError = require('../../error/appError')
const { users, departmentEmployees, departmentManagers, departments } = require('../model')
const { schemaValidate } = require('./departmentEmployee.validate')
class DepartmentControllerE {
  //POST create department employee
  async create(req, res, next) {
    const data = req.body
    try {
      const value = await schemaValidate.validateAsync(data)
      const employee = await users.findOne({
        where: { username: value.employee },
      })
      const manager = await users.findOne({ where: { username: value.manager } })
      const departmentManager = await departmentManagers.findOne({ where: { userId: manager.id } })
      const department = await departments.findOne({ where: { name: value.department } })
      const result = await departmentEmployees.create({
        departmentId: department.id,
        userId: employee.id,
        departmentManagerId: departmentManager.id,
        fname: employee.fname,
        lname: employee.lname,
      })
      res.status(200).json({
        result,
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //GET listEmployee
  async show(req, res, next) {
    const result = await departmentEmployees.findAll()
    res.status(200).json({
      result,
    })
  }

  //GET id employee
  async find(req, res, next) {
    const employeeId = req.params.id
    const result = await departmentEmployees.findByPk(employeeId)
    res.status(200).json({
      result,
    })
  }

  //PUT edit employee
  async edit(req, res, next) {
    const employeeId = req.params.id
    const data = req.body
    try {
      const value = await schemaValidate.validateAsync(data)
      const employee = await users.findOne({ where: { username: value.employee } })
      const manager = await users.findOne({ where: { username: value.manager } })
      const department = await departments.findOne({ where: { name: value.department } })
      await departmentEmployees.update(
        {
          departmentId: department.id,
          userId: employee.id,
          managerId: manager.id,
          fname: employee.fname,
          lname: employee.lname,
        },
        {
          where: {
            id: employeeId,
          },
        }
      )
      const result = departmentEmployees.findByPk(employeeId)
      res.status(200).json({
        result,
      })
    } catch (error) {
      next(new AppError(error, 'Fail', 400))
    }
  }

  //DELETE departmentEmployee
  async delete(req, res, next) {
    const employeeId = req.params.id
    await departmentEmployees.destroy({
      where: {
        id: employeeId,
      },
    })
  }

  // CheckID
  async checkID(req, res, next, val) {
    const array = []
    const data = await departmentEmployees.findAll({
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

module.exports = new DepartmentControllerE()
