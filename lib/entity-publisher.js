import _ from 'lodash'
import Boom from 'boom'

import joi from './schema/joi'
import safeHandler from './safe-handler'

const security = [
  {
    oauth2: []
  }
]

export default function publishEntity (options) {
  const {server, storage, basePath, entityName, entityUrlName} = options
  const {entitySchema, newEntitySchema, patchEntitySchema, errorSchema} = options
  const {operations, createCondition, additionalCreateHandler, additionalLoadHandler, additionalUpdateHandler, additionalFilterTransform, listQueryValidator, deleteCondition} = options

  if (operations.includes('create')) {
    server.route({
      method: 'POST',
      path: `${basePath}/${entityUrlName}s`,
      handler: safeHandler(async (request, reply) => {
        let createdEntity
        try {
          const entity = request.payload
          if (createCondition) {
            for (let i = 0, len = createCondition.length; i < len; i++) {
              await createCondition[i](entity)
            }
          }
          createdEntity = await storage.create(entity)
          if (additionalCreateHandler) {
            await additionalCreateHandler(createdEntity)
          }
        } catch (err) {
          if (err.customType) {
            if (err.customType === 'id_check') {
              return reply(Boom.badRequest(`${err.message}`))
            }
          }
          return reply(Boom.serverUnavailable(`${err.message}`))
        }
        return reply(createdEntity).code(201)
      }),
      config: {
        plugins: {
          'hapi-swagger': {
            security
          }
        },
        tags: ['api'],
        validate: {
          payload: newEntitySchema
        },
        response: {
          status: {
            201: entitySchema,
            500: errorSchema,
            503: errorSchema
          }
        }
      }
    })
  }

  if (operations.includes('read')) {
    server.route({
      method: 'GET',
      path: `${basePath}/${entityUrlName}s/{id}`,
      handler: safeHandler(async (request, reply) => {
        let result = await storage.load(request.params.id)
        if (additionalLoadHandler) {
          result = await additionalLoadHandler(result)
        }
        if (result) {
          reply(result)
        } else {
          reply(Boom.notFound(`${request.params.id} does not exist`))
        }
      }),
      config: {
        plugins: {
          'hapi-swagger': {
            security
          }
        },
        tags: ['api'],
        validate: {
          params: {
            id: joi.trimmedString().required().description(`The ${entityName} id`)
          }
        },
        response: {
          status: {
            200: entitySchema,
            404: errorSchema,
            500: errorSchema,
            503: errorSchema
          }
        }
      }
    })
  }

  if (operations.includes('update')) {
    server.route({
      method: 'PATCH',
      path: `${basePath}/${entityUrlName}s/{id}`,
      handler: safeHandler(async (request, reply) => {
        const modificationDate = request.query.modificationDate
        const entity = request.payload
        const updatedEntity = await storage.update(request.params.id, entity, modificationDate)
        if (updatedEntity === undefined) {
          return reply(Boom.notFound(`${entityName} not found`))
        }
        if (additionalUpdateHandler) {
          await additionalUpdateHandler(updatedEntity)
        }
        return reply(updatedEntity).code(200)
      }),
      config: {
        plugins: {
          'hapi-swagger': {
            security
          }
        },
        tags: ['api'],
        validate: {
          payload: patchEntitySchema,
          params: {
            id: joi.trimmedString().required().description(`The ${entityName} id`)
          }
        },
        response: {
          status: {
            200: entitySchema,
            404: errorSchema,
            409: errorSchema,
            500: errorSchema,
            503: errorSchema
          }
        }
      }
    })
  }

  if (operations.includes('delete')) {
    server.route({
      method: 'DELETE',
      path: `${basePath}/${entityUrlName}s/{id}`,
      handler: safeHandler(async (request, reply) => {
        const result = await storage.remove(request.params.id, deleteCondition)
        if (result === 1) {
          reply().code(204)
        } else {
          reply(Boom.notFound(`${request.params.id} does not exist`))
        }
      }),
      config: {
        plugins: {
          'hapi-swagger': {
            security
          }
        },
        tags: ['api'],
        validate: {
          params: {
            id: joi.trimmedString().required().description(`The ${entityName} id`)
          }
        },
        response: {
          status: {
            204: joi.only(null),
            404: errorSchema,
            406: errorSchema,
            500: errorSchema,
            503: errorSchema
          }
        }
      }
    })
  }

  if (operations.includes('list')) {
    server.route({
      method: 'GET',
      path: `${basePath}/${entityUrlName}s`,
      handler: safeHandler(async (request, reply) => {
        let params = _.cloneDeep(request.query)
        if (additionalFilterTransform) {
          params = additionalFilterTransform(params)
        }
        const result = await storage.loadAll(params)
        let entities = result.rows
        if (result.count > 0 && entities.length === 0) {
          throw Boom.rangeNotSatisfiable()
        }
        if (additionalLoadHandler) {
          entities = result.rows.map(additionalLoadHandler)
        }
        reply.paginate(entities, result.count)
      }),
      config: {
        plugins: {
          'hapi-swagger': {
            security
          }
        },
        tags: ['api'],
        validate: {
          query: listQueryValidator
        },
        response: {
          status: {
            200: joi.array().items(entitySchema).label(`${entityName}s`),
            206: joi.array().items(entitySchema).label(`${entityName}s`),
            500: errorSchema,
            503: errorSchema
          }
        }
      }
    })
  }
}
