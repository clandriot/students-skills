import Joi from './joi'
import order from './order'

const name = Joi.trimmedString()
const date = Joi.date()
const description = Joi.trimmedString()
const classID = Joi.trimmedString().max(22)

const skillID = Joi.trimmedString().max(22)
const scoringScale = Joi.number().integer().min(0)
const skill = Joi.object({
  skillID: skillID.required(),
  scoringScale: scoringScale.required()
})
const skills = Joi.array().min(1).unique().items(skill)

const skillNote = Joi.alternatives().try(Joi.number().precision(1).min(0), Joi.allow(null))
const note = Joi.object({
  skillID: skillID.required(),
  skillNote: skillNote.required()
})
const notes = Joi.array().unique().items(note)
const studentID = Joi.trimmedString().max(22)
const student = Joi.object({
  studentID: studentID.required(),
  notes
})
const results = Joi.array().unique().items(student)

export const newTest = Joi.object().keys({
  name: name.required(),
  date: date.required(),
  description,
  classID: classID.required(),
  skills: skills.required(),
  results
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
  classID,
  skills,
  results
}).label('Patch Test')

export const filterTest = Joi.object().keys({
  name,
  date,
  description,
  classID,
  creationDate: Joi.date(),
  modificationDate: Joi.date(),
  sort: Joi.trimmedString().valid('name', 'date', 'description', 'classID', 'creationDate', 'modificationDate'),
  order,
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).optional(),
  pagination: Joi.boolean().default(true)
}).label('Filter Test')
