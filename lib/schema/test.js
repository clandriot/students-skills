import Joi from './joi'
import order from './order'

const name = Joi.trimmedString()
const date = Joi.date()
const description = Joi.trimmedString()
const skills = Joi.array().min(1).unique().items(Joi.trimmedString().max(22))

export const newTest = Joi.object().keys({
  name: name.required(),
  date: date.required(),
  description,
  skills: skills.required()
}).label('New Test')

export const test = newTest.keys({
  id: Joi.trimmedString().description('id of the test').max(22).required(),
  meta: Joi.object().keys({
    creationDate: Joi.date(),
    modificationDate: Joi.date()
  }).label('Test meta')
}).label('Test')

export const patchTest = Joi.object().keys({
  name,
  date,
  description,
  skills
}).label('Patch Test')

export const filterSkill = Joi.object().keys({
  name,
  date,
  description,
  creationDate: Joi.date(),
  modificationDate: Joi.date(),
  sort: Joi.trimmedString().valid('name', 'date', 'description', 'creationDate', 'modificationDate'),
  order,
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).optional(),
  pagination: Joi.boolean().default(true)
}).label('Filter Skill')
