import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import * as Sentry from '@sentry/node'
import fastify from 'fastify'
import healthcheck from 'fastify-healthcheck'

import { ENV } from './env'
import { logger } from './logger'
import { appRoutes } from './routes'

const app = fastify({ logger })

Sentry.init({
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  dsn: ENV.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: ENV.NODE_ENV,
})

app.register(cors)
app.register(healthcheck, { exposeUptime: true })
app.register(multipart)
app.register(appRoutes)

app.setErrorHandler((error, _request, replay) => {
  logger.error(error)

  return replay.status(500).send({ message: 'Internal server error' })
})

export { app }
