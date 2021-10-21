const express = require('express')
const router = express.Router()
const departmentController = require('./department.controller')
const { authenToken } = require('../auth/auth.middleware')

/**
 * @swagger
 * definitions:
 *      Department:
 *          type: object
 *          properties:
 *              username:
 *                 type: string
 *                 required: true
 *              name:
 *                 type: string
 *                 required: true
 *              address:
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
router.post('/', authenToken, departmentController.create)

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
router.get('/', authenToken, departmentController.show)

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
router.get('/:id', authenToken, departmentController.find)

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
router.put('/:id', authenToken, departmentController.edit)

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
router.delete('/:id', authenToken, departmentController.delete)
router.param('id', departmentController.checkID)

module.exports = router
