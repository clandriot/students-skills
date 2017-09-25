import Joi from './joi'
import order from './order'

const name = Joi.trimmedString()
const date = Joi.date()
const description = Joi.trimmedString()
const stClassID = Joi.trimmedString().max(22)
const skillID = Joi.trimmedString().max(22)
const scoringScale = Joi.number().integer().min(0)
const skill = Joi.object({
  skillID,
  scoringScale
})
const skills = Joi.array().min(1).unique().items(skill)

export const newTest = Joi.object().keys({
  name: name.required(),
  date: date.required(),
  description,
  stClassID: stClassID.required(),
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
  stClassID,
  skills
}).label('Patch Test')

export const filterTest = Joi.object().keys({
  name,
  date,
  description,
  stClassID,
  creationDate: Joi.date(),
  modificationDate: Joi.date(),
  sort: Joi.trimmedString().valid('name', 'date', 'description', 'stClassID', 'creationDate', 'modificationDate'),
  order,
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).optional(),
  pagination: Joi.boolean().default(true)
}).label('Filter Skill')
