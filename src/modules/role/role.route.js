const express = require('express')
const router = express.Router()
const roleController = require('./role.controller')
const { authenToken, restrictTo, permission } = require('../auth/auth.middleware')

/**
 * @swagger
 * definitions:
 *      Role:
 *          type: object
 *          properties:
 *              username:
 *                 type: string
 *                 required: true
 *              role:
 *                 type: string
 *                 required: true
 *              read:
 *                 type: object
 *                 properties:
 *                    action:
 *                        type: string
 *                        required: true
 *                    checkAction:
 *                        type: boolean
 *                        required: true
 *                 example:
 *                    action: READ
 *                    checkAction: true
 *              write:
 *                 type: object
 *                 properties:
 *                    action:
 *                        type: string
 *                        required: true
 *                    checkAction:
 *                        type: boolean
 *                        required: true
 *                 example:
 *                    action: WRITE
 *                    checkAction: true
 *              update:
 *                 type: object
 *                 properties:
 *                    action:
 *                        type: string
 *                        required: true
 *                    checkAction:
 *                        type: boolean
 *                        required: true
 *                 example:
 *                    action: UPDATE
 *                    checkAction: true
 *              del:
 *                 type: object
 *                 properties:
 *                    action:
 *                        type: string
 *                        required: true
 *                    checkAction:
 *                        type: boolean
 *                        required: true
 *                 example:
 *                    action: DELETE
 *                    checkAction: true
 *              approve:
 *                 type: object
 *                 properties:
 *                    action:
 *                        type: string
 *                        required: true
 *                    checkAction:
 *                        type: boolean
 *                        required: true
 *                 example:
 *                    action: APPROVE
 *                    checkAction: true
 * tags:
 *    name: Roles
 *    description: The roles managing  API
 *
 */

/**
 * @swagger
 * /roles/{role_id}:
 *      get:
 *          summary: Get role
 *          description: Get role
 *          tags: [Roles]
 *          security:
 *             - bearerAuth: []
 *          parameters:
 *             - in: path
 *               name: role_id
 *               schema:
 *                    type: string
 *               required: true
 *               description: id of the role
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 */
router.get('/:id', authenToken, restrictTo('Admin'), permission('READ'), roleController.find)

/**
 * @swagger
 * /roles:
 *  post:
 *    summary: Create new role
 *    description: Create new role
 *    tags: [Roles]
 *    security:
 *          - bearerAuth: []
 *    requestBody:
 *      content:
 *          Application/json:
 *              schema:
 *                  $ref: '#/definitions/Role'
 *    responses:
 *       200:
 *          description: Role is created successfully
 *       500:
 *          description: Failure in create role
 */
router.post('/', authenToken, restrictTo('Admin'), permission('WRITE'), roleController.create)

/**
 * @swagger
 * /roles:
 *   get:
 *      summary: Returns list of roles
 *      tags: [Roles]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of roles
 *          500:
 *              description: Fail
 */
router.get('/', authenToken, restrictTo('Admin'), permission('READ'), roleController.show)

/**
 * @swagger
 * /roles/{id}:
 *      put:
 *          summary: update role
 *          description: update role
 *          tags: [Roles]
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: id of the role
 *          requestBody:
 *              content:
 *                  Application/json:
 *                      schema:
 *                          $ref: '#/definitions/Role'
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 *
 */
router.put('/:id', authenToken, restrictTo('Admin'), permission('UPDATE'), roleController.edit)

/**
 * @swagger
 * /roles/{id}:
 *      delete:
 *          summary: delete role
 *          tags: [Roles]
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: id of the role
 *          responses:
 *              200:
 *                  description: Delete role successfully
 *              500:
 *                  description: Fail
 */
router.delete('/:id', authenToken, restrictTo('Admin'), permission('DELETE'), roleController.delete)
router.param('id', roleController.checkID)

module.exports = router
