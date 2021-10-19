const express = require('express')
const router = express.Router()
const reportController = require('./report.controller')
const { authenToken, restrictTo, permission } = require('../auth/auth.middleware')

router.get('/job', authenToken, restrictTo('Admin', 'Director', 'Hr'), permission('READ'), reportController.job)
router.get('/review', authenToken, restrictTo('Admin', 'Director', 'Hr'), permission('READ'), reportController.review)

module.exports = router
