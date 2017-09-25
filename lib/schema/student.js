import Joi from './joi'
import order from './order'

const firstName = Joi.trimmedString()
const lastName = Joi.trimmedString()
const classID = Joi.trimmedString().max(22)

export const newStudent = Joi.object().keys({
  firstName: firstName.required(),
  lastName: lastName.required(),
  classID: classID.required()
}).label('New Student')

export const student = newStudent.keys({
  id: Joi.trimmedString().description('id of the student').max(22).required(),
  meta: Joi.object().keys({
    creationDate: Joi.date(),
    modificationDate: Joi.date()
  }).label('student meta')
}).label('Student')

export const patchStudent = Joi.object().keys({
  firstName,
  lastName,
  classID
}).label('Patch Student')

export const filterStudent = Joi.object().keys({
  firstName,
  lastName,
  classID,
  creationDate: Joi.date(),
  modificationDate: Joi.date(),
  sort: Joi.trimmedString().valid('firstName', 'lastName', 'classID', 'creationDate', 'modificationDate'),
  order,
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).optional(),
  pagination: Joi.boolean().default(true)
}).label('Filter Student')
