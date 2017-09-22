import Boom from 'boom'

export default function (handler) {
  return async (request, reply) => {
    try {
      await handler(request, reply)
    } catch (err) {
      /* eslint-disable no-console */
      console.error('SafeHandler: ', err.toString(), err.stack)
      /* eslint-enable no-console */

      if (err.isBoom) {
        return reply(err)
      }
      if (err.name && err.name.startsWith('Sequelize')) {
        return reply(Boom.serverUnavailable(`${err.message}`))
      }
      reply(Boom.internal(`${err.message}`))
    }
  }
}
