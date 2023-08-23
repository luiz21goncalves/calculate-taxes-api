import { FastifyInstance } from 'fastify'

import { parseXml } from './controllers/parse-xml'

export async function appRoutes(app: FastifyInstance) {
  app.post('/xml/import', parseXml)
}
