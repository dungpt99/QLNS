const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

//API docs
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
    },
  },
  apis: [`${process.cwd()}/src/modules/**/*.route.js`],
}

const openapiSpecification = swaggerJsdoc(options)
module.exports = { swaggerUi, openapiSpecification }
