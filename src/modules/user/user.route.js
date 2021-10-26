const express = require('express')
const multer = require('multer')
const router = express.Router()
const userController = require('./user.controller')
const { authenToken, restrictTo, permission } = require('../auth/auth.middleware')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage })

/**
 * @swagger
 * definitions:
 *      User:
 *          type: object
 *          properties:
 *              fname:
 *                 type: string
 *                 required: true
 *              lname:
 *                 type: string
 *                 required: true
 *              username:
 *                 type: string
 *                 required: true
 *              password:
 *                 type: string
 *                 required: true
 *              email:
 *                 type: string
 *                 required: true
 *              address:
 *                 type: string
 *                 required: true
 *              photo:
 *                type: string
 *                format: binary
 *      editUser:
 *          type: object
 *          properties:
 *              fname:
 *                 type: string
 *                 required: true
 *              lname:
 *                 type: string
 *                 required: true
 *              address:
 *                 type: string
 *                 required: true
 *              photo:
 *                 type: string
 *                 format: binary
 *components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 * tags:
 *    name: Users
 *    description: The users managing  API
 *
 */

router.get('/verify-email', userController.verifyEmail)

/**
 * @swagger
 * /users/{user_id}:
 *      get:
 *          summary: Get user
 *          description: Get user
 *          tags: [Users]
 *          security:
 *             - bearerAuth: []
 *          parameters:
 *             - in: path
 *               name: user_id
 *               schema:
 *                    type: string
 *               required: true
 *               description: id of the user
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Fail
 */
router.get(
  '/:id',
  authenToken,
  restrictTo('Admin', 'Director', 'Manager', 'Hr'),
  permission('READ'),
  userController.find
)

/**
 * @swagger
 * /users/profile:
 *      put:
 *          summary: update user
 *          description: update user
 *          tags: [Users]
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/definitions/editUser'
 *          responses:
 *              200:
 *                  description: Success
 *
 */
router.put('/profile', authenToken, permission('UPDATE'), upload.single('photo'), userController.editP)

/**
 * @swagger
 * /users/{id}:
 *      put:
 *          summary: update user
 *          description: update user
 *          tags: [Users]
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: id of the user
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/definitions/editUser'
 *          responses:
 *              200:
 *                  description: Success
 *
 */
router.put('/:id', authenToken, restrictTo('Admin'), permission('UPDATE'), upload.single('photo'), userController.edit)

/**
 * @swagger
 * /users:
 *   get:
 *      summary: Returns list of users
 *      tags: [Users]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of users
 *          500:
 *              description: Fail
 */
router.get('/', authenToken, restrictTo('Admin'), permission('READ'), userController.show)

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Create new user
 *    description: Create new user
 *    tags: [Users]
 *    security:
 *          - bearerAuth: []
 *    requestBody:
 *      content:
 *          multipart/form-data:
 *              schema:
 *                  $ref: '#/definitions/User'
 *    responses:
 *       200:
 *          description: user created successfully
 *       500:
 *          description: Failure in create user
 */
router.post('/', authenToken, restrictTo('Admin'), permission('WRITE'), upload.single('photo'), userController.signup)

/**
 * @swagger
 * /users/{id}:
 *      delete:
 *          summary: delete user
 *          tags: [Users]
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                required: true
 *                description: id of the user
 *          responses:
 *              200:
 *                  description: delete user successfully
 *              500:
 *                  description: Fail
 */
router.delete('/:id', authenToken, restrictTo('Admin'), permission('DELETE'), userController.delete)

router.param('id', userController.checkID)

module.exports = router
