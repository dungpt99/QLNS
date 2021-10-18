const Joi = require('joi')

const schemaValidate = Joi.object().keys({
  employee: Joi.string().required(),
  manager: Joi.string().required(),
  department: Joi.string().required(),
})

module.exports = { schemaValidate }
