const express = require('express')
const router = express.Router()
const departmentMController = require('./departmentManager.controller')
const { authenToken } = require('../auth/auth.middleware')

router.post('/', authenToken, departmentMController.create)
router.get('/', authenToken, departmentMController.show)
router.get('/:id', authenToken, departmentMController.find)
router.put('/:id', authenToken, departmentMController.edit)
router.delete('/:id', authenToken, departmentMController.delete)
router.param('id', departmentMController.checkID)

module.exports = router
