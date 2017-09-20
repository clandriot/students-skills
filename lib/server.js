import Hapi from 'hapi'
import HapiSwagger from 'hapi-swagger'
import Good from 'good'
import Pack from './../package.json'

const swaggerOptions = {
  info: {
    title: 'Students skills follow-up',
    version: Pack.version,
    contact: {
      email: 'cyril.landriot@gmail.com'
    }
  },
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

export default async function createServer () {
  const server = new Hapi.Server()

  server.connection({
    port: 80,
    routes: {
      cors: {}
    }
  })

  await server.register([{
    register: HapiSwagger,
    options: swaggerOptions
  },
  {
    register: Good,
    options: goodOptions
  }
  ])

  server.route({
    method: 'GET',
    path: '/skills',
    handler: (request, reply) =>
      reply({
        skills: ['RCO', 'ANA', 'REA']
      }).code(200),
    config: {
      tags: ['api']
    }
  })

  server.on('request-error', (request, err) => {
    const message = (err.trace || err.stack || err).replace(/^Error: /, '')
    server.log('error', `Error during request ${request.url.path}: ${message}`)
  })

  return server
}
