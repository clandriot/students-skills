import error from './error'
import joi from './joi'
import {skill, newSkill, patchSkill, filterSkill} from './skill'
import {test, newTest, patchTest, filterTest} from './test'

joi.error = () => error

joi.skill = () => skill
joi.newSkill = () => newSkill
joi.patchSkill = () => patchSkill
joi.filterSkill = () => filterSkill

joi.test = () => test
joi.newTest = () => newTest
joi.patchTest = () => patchTest
joi.filterTest = () => filterTest

export default joi
