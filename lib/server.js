import Hapi from 'hapi'
import HapiSwagger from 'hapi-swagger'
import HapiPagination from 'hapi-pagination'
import Good from 'good'
import {storagePlugin} from './storage'
import {skillStorage, testStorage, classStorage, studentStorage} from './typed-storage'
import schema from './schema'
import publishEntity from './entity-publisher'
import * as idCheck from './id-check'
import Pack from './../package.json'

const basePath = '/api/v1'

const swaggerOptions = {
  basePath,
  jsonPath: `${basePath}/swagger.json`,
  info: {
    title: 'Students skills follow-up',
    version: Pack.version,
    contact: {
      email: 'cyril.landriot@gmail.com'
    }
  },
  pathPrefixSize: 3,
  tags: [
    {
      name: 'skills',
      description: 'Manage the skills'
    },
    {
      name: 'tests',
      description: 'Manage the tests'
    }],
  documentationPage: false,
  swaggerUI: false
}

const goodOptions = {
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        response: '*',
        log: '*'
      }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
}

const paginationOptions = {
  query: {
    limit: {
      name: 'pageSize',
      default: 10
    }
  },
  meta: {
    location: 'header',
    successStatusCode: 206
  },
  routes: {
    exclude: [/.*\/{id}$/, /.*\/swagger.json$/, '/health']
  }
}

export default async function createServer () {
  const server = new Hapi.Server()

  server.connection({
    port: process.env.PORT || 80,
    routes: {
      cors: {}
    }
  })

  await server.register([
    {
      register: HapiSwagger,
      options: swaggerOptions
    },
    {
      register: HapiPagination,
      options: paginationOptions
    },
    {
      register: Good,
      options: goodOptions
    },
    {
      register: storagePlugin
    }
  ])

  publishEntity({
    server,
    storage: skillStorage,
    basePath,
    entityName: 'Skill',
    entityUrlName: 'skill',
    entitySchema: schema.skill(),
    newEntitySchema: schema.newSkill(),
    patchEntitySchema: schema.patchSkill(),
    errorSchema: schema.error(),
    operations: ['create', 'read', 'update', 'list', 'delete'],
    listQueryValidator: schema.filterSkill()
  })

  publishEntity({
    server,
    storage: testStorage,
    basePath,
    entityName: 'Test',
    entityUrlName: 'test',
    entitySchema: schema.test(),
    newEntitySchema: schema.newTest(),
    patchEntitySchema: schema.patchTest(),
    errorSchema: schema.error(),
    operations: ['create', 'read', 'update', 'list', 'delete'],
    createCondition: [idCheck.checkClassIDExist, idCheck.checkSkillIDsExist],
    listQueryValidator: schema.filterTest()
  })

  publishEntity({
    server,
    storage: classStorage,
    basePath,
    entityName: 'Class',
    entityUrlName: 'class',
    entitySchema: schema.stClass(),
    newEntitySchema: schema.newClass(),
    patchEntitySchema: schema.patchClass(),
    errorSchema: schema.error(),
    operations: ['create', 'read', 'update', 'list', 'delete'],
    createCondition: [idCheck.checkDefaultSkillsExist],
    listQueryValidator: schema.filterClass()
  })

  publishEntity({
    server,
    storage: studentStorage,
    basePath,
    entityName: 'Student',
    entityUrlName: 'student',
    entitySchema: schema.student(),
    newEntitySchema: schema.newStudent(),
    patchEntitySchema: schema.patchStudent(),
    errorSchema: schema.error(),
    operations: ['create', 'read', 'update', 'list', 'delete'],
    createCondition: [idCheck.checkClassIDExist],
    listQueryValidator: schema.filterStudent()
  })

  server.on('request-error', (request, err) => {
    const message = (err.trace || err.stack || err).replace(/^Error: /, '')
    server.log('error', `Error during request ${request.url.path}: ${message}`)
  })

  return server
}
