const Joi = require('joi')

const schemaValidate = Joi.object().keys({
  action: Joi.string(),
  checkAction: Joi.string(),
})

module.exports = { schemaValidate }
