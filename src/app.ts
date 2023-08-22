import cors from '@fastify/cors'
import fastify from 'fastify'
import healthcheck from 'fastify-healthcheck'

import { logger } from './logger'

const app = fastify({ logger })

app.register(cors)
app.register(healthcheck, { exposeUptime: true })

app.setErrorHandler((error, _request, replay) => {
  logger.error(error)

  return replay.status(500).send({ message: 'Internal server error' })
})

export { app }
