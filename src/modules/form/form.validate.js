const Joi = require('joi')

const schemaValidate = Joi.object().keys({
  content: Joi.string().min(3).max(30).required(),

  type: Joi.string().min(3).max(200).required(),

  status: Joi.string(),

  comment: Joi.string(),
})

module.exports = { schemaValidate }
