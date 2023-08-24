import { app } from './app'
import { ENV } from './env'
import { deleteXmlFilesJob, deleteJsonFilesJob } from './jobs'
import { logger } from './logger'

app.listen({ port: ENV.PORT, host: '0.0.0.0' }).then(() => {
  deleteXmlFilesJob.start()
  deleteJsonFilesJob.start()
})

const gracefulShutdown = () => {
  logger.info('Shutting down server')
  app.close(() => process.exit())
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

process.on('uncaughtException', (error, origin) => {
  logger.error(`uncaughtException origin ${origin}, ${error}`)
})

process.on('unhandledRejection', (error) => {
  logger.error(`unhandledRejection, ${error}`)
})

process.on('exit', (code) => {
  logger.info(`exit signal received with code ${code}`)
})
