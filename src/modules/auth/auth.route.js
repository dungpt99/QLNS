const express = require('express')
const router = express.Router()
const authController = require('./auth.controller')

/**
 * @swagger
 * definitions:
 *      Login:
 *          type: object
 *          properties:
 *              username:
 *                 type: string
 *                 required: true
 *              password:
 *                 type: string
 *                 required: true
 *components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 * tags:
 *    name: Users
 *    description: The users managing  API
 * User:
 *      type: object
 *      properties:
 *          user_id:
 *              type: integer
 *              description: id of the user
 *              example: 2
 *
 */

/**
 * @swagger
 * /login:
 *  post:
 *    summary: SignIn
 *    description: SignIn
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/definitions/Login'
 *    responses:
 *       200:
 *          description: user created successfully
 *       500:
 *          description: Failure in create user
 */
router.post('/login', authController.login)

module.exports = router
