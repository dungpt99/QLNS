const Joi = require('joi')

const schemaValidate = Joi.object().keys({
  name: Joi.string().required(),
  read: Joi.object({ action: Joi.string(), checkAction: Joi.boolean() }),
  write: Joi.object({ action: Joi.string(), checkAction: Joi.boolean() }),
  update: Joi.object({ action: Joi.string(), checkAction: Joi.boolean() }),
  del: Joi.object({ action: Joi.string(), checkAction: Joi.boolean() }),
  approve: Joi.object({ action: Joi.string(), checkAction: Joi.boolean() }),
})

module.exports = { schemaValidate }
