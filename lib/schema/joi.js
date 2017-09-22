import Joi from 'joi'

export default Joi.extend({
  name: 'trimmedString',
  base: Joi.string().trim()
})
