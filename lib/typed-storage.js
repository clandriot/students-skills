import storage from './storage'
import joi from './schema'

class TypedStorage {
  constructor (storage, model, schema) {
    this.storage = storage
    this.model = model
    this.schema = schema
  }

  loadAll (params) {
    return this.storage.loadAll(params, this.model)
  }

  load (id) {
    return this.storage.load(id, this.model)
  }

  remove (id, condition) {
    return this.storage.remove(id, this.model, condition)
  }

  create (entity) {
    return this.storage.create(entity, this.model)
  }

  update (id, entityPatch, modificationDate) {
    return this.storage.update(id, this.model, entityPatch, this.schema, modificationDate)
  }
}

export const skillStorage = new TypedStorage(storage, 'Skill', joi.newSkill())
