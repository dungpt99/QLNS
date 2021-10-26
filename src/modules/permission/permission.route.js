const express = require('express')
const router = express.Router()
const permissionController = require('./permission.controller')
const { authenToken } = require('../auth/auth.middleware')

router.post('/', authenToken, permissionController.show)

module.exports = router
