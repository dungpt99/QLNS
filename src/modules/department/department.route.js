const express = require('express')
const router = express.Router()
const departmentController = require('./department.controller')
const { authenToken } = require('../auth/auth.middleware')

router.post('/', authenToken, departmentController.create)
router.get('/', authenToken, departmentController.show)
router.get('/:id', authenToken, departmentController.find)
router.put('/:id', authenToken, departmentController.edit)
router.delete('/:id', authenToken, departmentController.delete)
router.param('id', departmentController.checkID)

module.exports = router
