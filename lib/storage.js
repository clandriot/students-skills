import _ from 'lodash'
import Boom from 'boom'
/* eslint-disable no-unused-vars, import/first */
import * as iNeedToBeBeforeSequelize from './patch-sequelize'
/* eslint-enable no-unused-vars */
import Sequelize from 'sequelize'
import slugid from 'slugid'
/* eslint-enable import/first */

import dbconfig from './config'
import Joi from './schema'

const PHYSICAL_COLS = ['creationDate', 'modificationDate']

/** The Storage is designed to be able to store all different kind of entities in the same table */
class Storage {
  constructor () {
    this.logger = (msg) => {}
    this.logging = (msg) => { this.logger(msg) }
    this.sequelize = new Sequelize(dbconfig.url, {
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      dialectOptions: {
        ssl: dbconfig.ssl
      },
      logging: this.logging
    })

    this.ent = this.sequelize.define('entities', {
      id: {
        type: Sequelize.STRING,
        field: 'ID',
        primaryKey: true
      },
      model: {
        type: Sequelize.STRING,
        field: 'MODEL',
        primaryKey: true
      },
      data: {
        type: Sequelize.JSONB,
        field: 'DATA'
      }
    }, {createdAt: 'creationDate', updatedAt: 'modificationDate'})

    this.initializer = undefined
    this._ent = undefined
  }

  initialize () {
    this.initializer = this.initializer || new Promise((resolve, reject) => {
      const self = this
      let retryCount = 0

      async function initTable () {
        try {
          self._ent = await self.ent.sync({force: false})
          resolve(self)
        } catch (error) {
          retryCount++
          if (retryCount > dbconfig.initTimeout) {
            return reject(new Error('Unable to initialize the storage'))
          }
          setTimeout(initTable, 1000)
        }
      }

      initTable()
    })
    return this.initializer
  }

  get table () {
    if (!this._ent) {
      throw Boom.serverUnavailable('Database not ready')
    }
    return this._ent
  }

  async loadAll (params, model) {
    const findParameters = tambouilleFindParameter(params, model)
    const result = await this.table.findAndCountAll(findParameters)

    return {count: result.count, rows: result.rows.map(getData)}
  }

  async load (id, model) {
    return getData(await this.table.findOne({where: {id, model}}))
  }

  async remove (id, model, condition) {
    const where = condition ? {id, model, data: condition} : {id, model}
    const result = await this.table.destroy({where, force: true})
    if (result === 0) {
      const entity = await this.load(id, model)
      if (entity) {
        throw Boom.notAcceptable(`${model} does not match ${JSON.stringify(condition)}`, entity)
      }
    }
    return result
  }

  async create (entity, model) {
    return getData(await this.table.create({
      id: slugid.v4(), // Generate an URL-safe base64 encoded UUID v4
      model,
      data: entity
    }))
  }

  async update (id, model, entityPatch, schema, modificationDate) {
    const entity = await this.table.findOne({where: {id, model}})
    if (entity) {
      const data = _.merge(entity.data, entityPatch)
      const validation = Joi.validate(data, schema)
      if (validation.error) {
        throw Boom.badRequest(validation.error.details[0].message)
      }
      const updateQuery = {id, model, data}
      if (modificationDate) {
        if (Date.parse(entity.modificationDate) !== Date.parse(modificationDate)) {
          throw Boom.conflict(`${model} has been updated`, entity)
        }
        updateQuery.where = {modificationDate}
      }
      const result = await entity.update(updateQuery)
      return getData(result)
    } else {
      return undefined
    }
  }
}

function tambouilleFindParameter (params, model) {
  const findParameters = {
    where: {
      model,
      data: {
        $and: {}
      }
    }
  }
  Object.keys(params).forEach((parameter) => {
    if (parameter === 'sort') {
      const path = PHYSICAL_COLS.includes(params.sort) ? params.sort : `data.${params.sort}`
      findParameters.order = [[path, params.order || 'ASC']]
    } else if (parameter === 'order') {
      // ignore, treated with sort
    } else if (parameter === 'page' || parameter === 'pageSize') {
      // ignore, treated with pagination
    } else if (parameter === 'pagination') {
      if (params.pagination) {
        findParameters.offset = params.pageSize * (params.page - 1)
        findParameters.limit = params.pageSize
      }
    } else if (PHYSICAL_COLS.includes(parameter)) {
      findParameters.where[parameter] = params[parameter]
    } else {
      findParameters.where.data.$and[parameter] = params[parameter]
    }
  })
  return findParameters
}

function getData (instance) {
  if (instance) {
    const value = instance.get({plain: true})
    const data = _.cloneDeep(value.data)
    data.id = value.id
    data.meta = {
      creationDate: value.creationDate,
      modificationDate: value.modificationDate
    }
    return data
  }
  return null
}

const storage = new Storage()
export default storage

export const storagePlugin = {
  register: async (server, options, next) => {
    storage.logger = (msg) => server.log('debug', msg)
    await storage.initialize()
    next()
  }
}

storagePlugin.register.attributes = {
  name: __filename
}
