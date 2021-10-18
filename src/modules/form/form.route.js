const express = require('express')
const router = express.Router()
const formController = require('./form.controller')
const { authenToken, restrictTo, permission } = require('../auth/auth.middleware')

router.post('/', authenToken, restrictTo('Admin', 'Hr'), permission('WRITE'), formController.create)

router.get('/', authenToken, restrictTo('Admin', 'Director', 'Hr'), permission('READ'), formController.show)

router.get('/:id', authenToken, restrictTo('Admin', 'Director', 'Hr'), permission('READ'), formController.find)

router.put('/:id', authenToken, formController.send)

router.put('/approval/:id', authenToken, restrictTo('Admin'), formController.approval)

router.put('/done/:id', authenToken, restrictTo('Admin'), formController.close)

router.param('id', formController.checkID)
module.exports = router
