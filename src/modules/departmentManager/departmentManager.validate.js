const Joi = require('joi')

const schemaValidate = Joi.object().keys({
  user: Joi.string().required(),
  department: Joi.string().required(),
})

module.exports = { schemaValidate }
