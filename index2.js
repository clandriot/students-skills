const Hapi = require('hapi')
const Good = require('good')
const Joi = require('joi')
const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')

const server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: 3000
})

const toDo = ['Do this', 'Do that', 'Dont forget this']

server.route({
  method: 'GET',
  path: '/todo/{id}',
  config: {
    handler: function (request, reply) {
      reply(toDo[request.params.id])
    },
    tags: ['api'],
    validate: {
      params: {
        id: Joi.number()
          .min(0)
          .max(2)
          .required()
      }
    }
  }
})

server.register([
  Inert,
  Vision,
  {
    register: HapiSwagger,
    options: {
      swaggerUI: false,
      documentationPage: false,
      info: {
        title: 'It shall work!',
        version: '0.0.1'
      }
    }
  }, {
    register: Good,
    options: {
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
  }
], (err) => { // eslint-disable-line handle-callback-err
  server.start((err) => {
    if (err) {
      console.log(err) // eslint-disable-line no-console
    } else {
      console.log('Server running at:', server.info.uri) // eslint-disable-line no-console
    }
  })
})
