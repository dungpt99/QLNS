const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('project3', process.env.USER, process.env.PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
})

async function testConnect() {
  try {
    await sequelize.sync()
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = { sequelize, testConnect }
