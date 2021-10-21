const Joi = require('joi')

const schemaValidate = Joi.object().keys({
  username: Joi.string(),
  name: Joi.string().required(),
  address: Joi.string().required(),
})

module.exports = { schemaValidate }
