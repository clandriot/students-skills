import Joi from './joi'

export default Joi.trimmedString().lowercase().valid('asc', 'desc').default('asc')
