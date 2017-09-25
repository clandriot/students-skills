import {skillStorage, classStorage} from './typed-storage'

export async function checkSkillIDsExist (entity) {
  let check = true
  let failedID

  if (entity.skills) {
    for (let i = 0, len = entity.skills.length; i < len && check; i++) {
      let result = await skillStorage.load(entity.skills[i].skillID)
      check = !!result
      if (!check) {
        failedID = entity.skills[i].skillID
      }
    }
  }

  if (check && entity.results) {
    for (let i = 0, len = entity.results.length; i < len && check; i++) {
      let notes = entity.results[i].notes
      for (let j = 0, len = notes.length; j < len && check; j++) {
        let result = await skillStorage.load(notes[j].skillID)
        check = !!result
        if (!check) {
          failedID = notes[j].skillID
        }
      }
    }
  }

  if (!check) {
    let err = new Error('Skill \'' + failedID + '\' doesn\'t exist')
    err.customType = 'id_check'
    throw err
  }
}

export async function checkClassIDExist (entity) {
  if (entity.classID) {
    let result = await classStorage.load(entity.classID)
    if (!result) {
      let err = new Error('Class \'' + entity.classID + '\' doesn\'t exist')
      err.customType = 'id_check'
      throw err
    }
  }
}
