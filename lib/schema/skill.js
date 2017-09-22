import Joi from './joi'
import order from './order'

const shortName = Joi.trimmedString()
const longName = Joi.trimmedString()
const description = Joi.trimmedString()

export const newSkill = Joi.object().keys({
  shortName: shortName.required(),
  longName: longName.required(),
  description
}).label('New Skill')

export const skill = newSkill.keys({
  id: Joi.trimmedString().description('id of the skill').max(22).required(),
  meta: Joi.object().keys({
    creationDate: Joi.date(),
    modificationDate: Joi.date()
  }).label('skill meta')
}).label('Skill')

export const patchSkill = Joi.object().keys({
  shortName,
  longName,
  description
}).label('Patch Skill')

export const filterSkill = Joi.object().keys({
  shortName,
  longName,
  description,
  creationDate: Joi.date(),
  modificationDate: Joi.date(),
  sort: Joi.trimmedString().valid('shortName', 'longName', 'description', 'creationDate', 'modificationDate'),
  order,
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).optional(),
  pagination: Joi.boolean().default(true)
}).label('Filter Skill')
