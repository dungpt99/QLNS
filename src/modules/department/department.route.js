const express = require('express')
const router = express.Router()
const departmentController = require('./department.controller')
const { authenToken, restrictTo, permission } = require('../auth/auth.middleware')

/**
 * @swagger
 * definitions:
 *      Department:
 *          type: object
 *          properties:
 *              name:
 *                 type: string
 *                 required: true
 *              address:
 *                 type: string
 *                 required: true
 *      addUser:
 *          type: object
 *          properties:
 *              username:
 *                 type: string
 *                 required: true
 *              department:
 *                 type: string
 *                 required: true
 * tags:
 *    name: Department
 *    description: The department managing  API
 *
 */

/**
 * @swagger
 * /department:
 *  post:
 *    summary: Create new department
 *    description: Create new department
 *    tags: [Department]
 *    security:
 *          - bearerAuth: []
 *    requestBody:
 *      content:
 *          Application/json:
 *              schema:
 *                  $ref: '#/definitions/Department'
 *    responses:
 *       200:
 *          description: Department is created successfully
 *       500:
 *          description: Failure in create Department
 */
router.post('/', authenToken, restrictTo('Admin'), permission('WRITE'), departmentController.create)

/**
 * @swagger
 * /department/addUser:
 *  post:
 *    summary: add user
 *    description: add user
 *    tags: [Department]
 *    security:
 *          - bearerAuth: []
 *    requestBody:
 *      content:
 *          Application/json:
 *              schema:
 *                  $ref: '#/definitions/addUser'
 *    responses:
 *       200:
 *          description: Success
 *       500:
 *          description: Fail
 */
router.post('/addUser', authenToken, restrictTo('Admin'), permission('WRITE'), departmentController.addUser)
/**
 * @swagger
 * /department:
 *   get:
 *      summary: Returns list of departments
 *      tags: [Department]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of department
 *          500:
 *              description: Fail
 */
router.get('/', authenToken, permission('READ'), departmentController.show)

/**
 * @swagger
 * /department/{department_id}:
 *      get:
 *          summary: Get department
 *          description: Get department
 *          tags: [Department]
 *          security:
 *             - bearerAuth: []
 *          parameters:
 *             - in: path
 *               name: department_id
 *               schema:
 *                    type: string
 *               required: true
 *               description: id of the department
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 */
router.get('/:id', authenToken, permission('READ'), departmentController.find)

/**
 * @swagger
 * /department/{id}:
 *      put:
 *          summary: update department
 *          description: update department
 *          tags: [Department]
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: id of the department
 *          requestBody:
 *              content:
 *                  Application/json:
 *                      schema:
 *                          $ref: '#/definitions/Department'
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 *
 */
router.put('/:id', authenToken, restrictTo('Admin'), permission('UPDATE'), departmentController.edit)

/**
 * @swagger
 * /department/{id}:
 *      delete:
 *          summary: delete deparment
 *          tags: [Department]
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: id of the department
 *          responses:
 *              200:
 *                  description: Delete department successfully
 *              500:
 *                  description: Fail
 */
router.delete('/:id', authenToken, restrictTo('Admin'), permission('DELETE'), departmentController.delete)
router.param('id', departmentController.checkID)

module.exports = router
