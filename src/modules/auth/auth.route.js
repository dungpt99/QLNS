const express = require('express')
const router = express.Router()
const authController = require('./auth.controller')
const { authenToken } = require('./auth.middleware')

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
 *      Forgot:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  required: true
 *      RefreshToken:
 *          type: object
 *          properties:
 *              token:
 *                  type: string
 *                  required: true
 *      ResetPassword:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  required: true
 *              password:
 *                  type: string
 *                  required: true
 *              newPassword:
 *                  type: string
 *                  required: true
 *              repeatPassword:
 *                  type: string
 *                  required: true
 *components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
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

/**
 * @swagger
 * /forgotPassword:
 *  post:
 *    summary: forgotPassword
 *    description: forgotPassword
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/definitions/Forgot'
 *    responses:
 *       200:
 *          description: Successfully
 *       500:
 *          description: Fail
 */
router.post('/forgotPassword', authController.forgotPassword)

/**
 * @swagger
 * /logout:
 *  post:
 *    summary: logout
 *    description: logout
 *    tags: [Auth]
 *    security:
 *             - bearerAuth: []
 *    responses:
 *       200:
 *          description: Successfully
 *       500:
 *          description: Fail
 */
router.post('/logout', authenToken, authController.logout)

/**
 * @swagger
 * /refreshToken:
 *  post:
 *    summary: refreshToken
 *    description: refreshToken
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/definitions/RefreshToken'
 *    responses:
 *       200:
 *          description: Successfully
 *       500:
 *          description: Fail
 */
router.post('/refreshToken', authController.refreshToken)

/**
 * @swagger
 * /resetPassword:
 *  post:
 *    summary: resetPassword
 *    description: resetPassword
 *    tags: [Auth]
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/definitions/ResetPassword'
 *    responses:
 *       200:
 *          description: Successfully
 *       500:
 *          description: Fail
 */
router.post('/resetPassword', authController.resetPassword)

module.exports = router
