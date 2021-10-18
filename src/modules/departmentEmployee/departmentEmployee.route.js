const express = require('express')
const router = express.Router()
const departmentEController = require('./deparmentEmployee.controller')
const { authenToken } = require('../auth/auth.middleware')

router.post('/', authenToken, departmentEController.create)
router.get('/', authenToken, departmentEController.show)
router.get('/:id', authenToken, departmentEController.find)
router.put('/:id', authenToken, departmentEController.edit)
router.delete('/:id', authenToken, departmentEController.delete)
router.param('id', departmentEController.checkID)

module.exports = router
