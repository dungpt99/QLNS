const jwt = require('jsonwebtoken')
const AppError = require('../../error/appError')
const { users, roles, permissions } = require('../model')
const passwordValidate = require('./auth.validate')

exports.authenToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  const token = authorizationHeader.split(' ')[1]
  if (!token) res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    req.user = data
    if (err) return res.sendStatus(403)
    next()
  })
}

exports.restrictTo = (...role) => {
  return async (req, res, next) => {
    const user = await users.findOne({
      where: { username: req.user.username },
      include: [roles],
    })
    const arr = []
    user.roles.forEach(async (e) => {
      arr.push(e.role)
    })
    for (let i = 0; i < role.length; i++) {
      if (arr.includes(role[i])) {
        return next()
      }
    }
    return next(new AppError('You do not have permission to perform this action', 'Fail', 403))
  }
}

exports.permission = (per) => {
  return async (req, res, next) => {
    const user = await users.findOne({
      where: { username: req.user.username },
      include: [roles],
    })
    const array = []
    for (const e of user.roles) {
      const permission = await permissions.findAll({ where: { roleId: e.id, checkAction: true } })
      for (const p of permission) {
        array.push(p.action)
      }
    }
    if (!array.includes(per)) {
      return next(new AppError('You do not have permission to perform this action', 'Fail', 403))
    }
    next()
  }
}

exports.validate = async (req, res, next) => {
  const data = req.body
  try {
    await passwordValidate.validateAsync(data)
    next()
  } catch (error) {
    return next(new AppError(error, 'Fail', 400))
  }
}
