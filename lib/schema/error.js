import Joi from './joi'

export default Joi.object().keys({
  statusCode: Joi.number().required(),
  error: Joi.trimmedString(),
  message: Joi.trimmedString()
}).label('Error')
