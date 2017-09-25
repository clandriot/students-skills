import {skillStorage, classStorage} from './typed-storage'

export async function checkSkillsIDExist (entity) {
  let check = true
  let failedID
  for (let i = 0, len = entity.skills.length; i < len && check; i++) {
    let result = await skillStorage.load(entity.skills[i].skillID)
    check = !!result
    if (!check) {
      failedID = entity.skills[i].skillID
    }
  }

  if (!check) {
    let err = new Error('Skill \'' + failedID + '\' doesn\'t exist')
    err.customType = 'id_check'
    throw err
  }
}

export async function checkClassIDExist (entity) {
  let result = await classStorage.load(entity.classID)
  if (!result) {
    let err = new Error('Class \'' + entity.classID + '\' doesn\'t exist')
    err.customType = 'id_check'
    throw err
  }
}
