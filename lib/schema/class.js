import Joi from './joi'
import order from './order'

const name = Joi.trimmedString()

export const newClass = Joi.object().keys({
  name: name.required()
}).label('New Class')

export const stClass = newClass.keys({
  id: Joi.trimmedString().description('id of the class').max(22).required(),
  meta: Joi.object().keys({
    creationDate: Joi.date(),
    modificationDate: Joi.date()
  }).label('class meta')
}).label('Class')

export const patchClass = Joi.object().keys({
  name
}).label('Patch Class')

export const filterClass = Joi.object().keys({
  name,
  creationDate: Joi.date(),
  modificationDate: Joi.date(),
  sort: Joi.trimmedString().valid('name', 'creationDate', 'modificationDate'),
  order,
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).optional(),
  pagination: Joi.boolean().default(true)
}).label('Filter Class')
