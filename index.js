import createServer from './lib/server'

createServer().then(async (server) => {
  await server.start()
  server.log('info', `server running at: ${server.info.uri}`)
})
