const express = require('express')
const router = express.Router()
const formController = require('./form.controller')
const { authenToken, restrictTo, permission } = require('../auth/auth.middleware')

/**
 * @swagger
 * definitions:
 *      Form:
 *          type: object
 *          properties:
 *              content:
 *                 type: string
 *                 required: true
 *              type:
 *                 type: string
 *                 required: true
 *      approveForm:
 *          type: object
 *          properties:
 *              comment:
 *                 type: string
 *                 required: true
 * tags:
 *    name: Form
 *    description: The Form managing  API
 *
 */

/**
 * @swagger
 * /forms:
 *  post:
 *    summary: Create new forms
 *    description: Create new forms
 *    tags: [Form]
 *    security:
 *          - bearerAuth: []
 *    requestBody:
 *      content:
 *          Application/json:
 *              schema:
 *                  $ref: '#/definitions/Form'
 *    responses:
 *       200:
 *          description: Form is created successfully
 *       500:
 *          description: Failure in create form
 */
router.post('/', authenToken, restrictTo('Admin', 'Hr'), permission('WRITE'), formController.create)

/**
 * @swagger
 * /forms:
 *   get:
 *      summary: Returns list of form
 *      tags: [Form]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of form
 *          500:
 *              description: Fail
 */
router.get('/', authenToken, restrictTo('Admin', 'Director', 'Hr'), permission('READ'), formController.show)

/**
 * @swagger
 * /forms/submit:
 *   get:
 *      summary: Returns list of form
 *      tags: [Form]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of form
 *          500:
 *              description: Fail
 */
router.get('/submit', authenToken, formController.showSubmitted)

/**
 * @swagger
 * /forms/approval:
 *   get:
 *      summary: Returns list of form
 *      tags: [Form]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of form
 *          500:
 *              description: Fail
 */
router.get('/approval', authenToken, formController.showApproval)

/**
 * @swagger
 * /forms/closed:
 *   get:
 *      summary: Returns list of form
 *      tags: [Form]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of form
 *          500:
 *              description: Fail
 */
router.get('/closed', authenToken, formController.showClose)

/**
 * @swagger
 * /forms/{form_id}:
 *      get:
 *          summary: Get form
 *          description: Get form
 *          tags: [Form]
 *          security:
 *             - bearerAuth: []
 *          parameters:
 *             - in: path
 *               name: form_id
 *               schema:
 *                    type: string
 *               required: true
 *               description: id of the form
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 */
router.get('/:id', authenToken, permission('READ'), formController.find)

/**
 * @swagger
 * /forms/send:
 *      put:
 *          summary: send form
 *          description: send form
 *          tags: [Form]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 *
 */
router.put('/send', authenToken, formController.send)

/**
 * @swagger
 * /forms/approval/{id}:
 *      put:
 *          summary: approval form
 *          description: approval form
 *          tags: [Form]
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: id of the form
 *          requestBody:
 *              content:
 *                  Application/json:
 *                      schema:
 *                          $ref: '#/definitions/approveForm'
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 *
 */
router.put('/approval/:id', authenToken, formController.approval)

/**
 * @swagger
 * /forms/done/{id}:
 *      put:
 *          summary: close form
 *          description: close form
 *          tags: [Form]
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: id of the form
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 *
 */
router.put('/done/:id', authenToken, restrictTo('Admin', 'Hr'), formController.close)

router.param('id', formController.checkID)
module.exports = router
