const express = require('express')
const router = express.Router()
const roleController = require('./role.controller')
const { authenToken } = require('../auth/auth.middleware')

router.get('/:id', authenToken, roleController.find)
router.post('/', authenToken, roleController.create)
router.get('/', authenToken, roleController.show)
router.put('/:id', authenToken, roleController.edit)
router.delete('/:id', authenToken, roleController.delete)
router.param('id', roleController.checkID)

module.exports = router
