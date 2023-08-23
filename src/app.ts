import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import * as Sentry from '@sentry/node'
import fastify from 'fastify'
import healthcheck from 'fastify-healthcheck'
import { ZodError } from 'zod'

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
  if (error instanceof ZodError) {
    return replay
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  const isProd = ENV.NODE_ENV === 'production'

  if (isProd) {
    Sentry.captureException(error)
  } else {
    logger.error(error)
  }

  return replay.status(500).send({ message: 'Internal server error' })
})

export { app }
