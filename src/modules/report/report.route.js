const express = require('express')
const router = express.Router()
const reportController = require('./report.controller')
const { authenToken, restrictTo, permission } = require('../auth/auth.middleware')

/**
 * @swagger
 * tags:
 *    name: Report
 *    description: The report managing  API
 *
 */

/**
 * @swagger
 * /reports/job:
 *   get:
 *      summary: Returns list of job form
 *      tags: [Report]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of job form
 *          500:
 *              description: Fail
 */
router.get(
  '/job',
  authenToken,
  restrictTo('Admin', 'Director', 'Manager', 'Hr'),
  permission('READ'),
  reportController.job
)

/**
 * @swagger
 * /reports/review:
 *   get:
 *      summary: Returns list of review form
 *      tags: [Report]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The list of review form
 *          500:
 *              description: Fail
 */
router.get(
  '/review',
  authenToken,
  restrictTo('Admin', 'Director', 'Manager', 'Hr'),
  permission('READ'),
  reportController.review
)

module.exports = router
