import {skillStorage} from './typed-storage'

export async function checkSkillsIDExist (storage, entity) {
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
    let err = new Error('Skill \'' + failedID + '\' doesn\' exist')
    err.customType = 'id_check'
    throw err
  }
}
