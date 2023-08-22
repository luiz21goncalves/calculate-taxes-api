import cors from '@fastify/cors'
import fastify from 'fastify'
import healthcheck from 'fastify-healthcheck'

const app = fastify()

app.register(cors)
app.register(healthcheck, { exposeUptime: true })

app.setErrorHandler((_error, _request, replay) => {
  return replay.status(500).send({ message: 'Internal server error' })
})

export { app }
