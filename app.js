const express = require('express')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const morgan = require('morgan')
const app = express()
const db = require('./src/config/db')
const port = process.env.PORT || 3000
const route = require('./src/modules')
const AppError = require('./src/error/appError')
const errorHandler = require('./src/error/errorHandler')
const { swaggerUi, openapiSpecification } = require('./src/config/swagger')

app.use(express.json())
app.use('/public/images', express.static('public/images'))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//ConfigSwagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

//connectDB
db.testConnect()

//connectRouter
route(app)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 'Fail', 404))
})

app.use(errorHandler)

module.exports = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
