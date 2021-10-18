const Joi = require('joi')

const schemaValidate = Joi.object().keys({
  name: Joi.string().required(),
  address: Joi.string().required(),
})

module.exports = { schemaValidate }
