import error from './error'
import joi from './joi'
import {skill, newSkill, patchSkill, filterSkill} from './skill'

joi.error = () => error

joi.skill = () => skill
joi.newSkill = () => newSkill
joi.patchSkill = () => patchSkill
joi.filterSkill = () => filterSkill

export default joi
