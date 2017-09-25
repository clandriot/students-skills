import error from './error'
import joi from './joi'
import {skill, newSkill, patchSkill, filterSkill} from './skill'
import {test, newTest, patchTest, filterTest} from './test'
import {stClass, newClass, patchClass, filterClass} from './class'

joi.error = () => error

joi.skill = () => skill
joi.newSkill = () => newSkill
joi.patchSkill = () => patchSkill
joi.filterSkill = () => filterSkill

joi.test = () => test
joi.newTest = () => newTest
joi.patchTest = () => patchTest
joi.filterTest = () => filterTest

joi.stClass = () => stClass
joi.newClass = () => newClass
joi.patchClass = () => patchClass
joi.filterClass = () => filterClass

export default joi
