import { FastifyInstance } from 'fastify'

import { calculateTaxes } from './controllers/calculate-taxes'
import { parseXml } from './controllers/parse-xml'

export async function appRoutes(app: FastifyInstance) {
  app.post('/xml', parseXml)
  app.get('/calculate/:id', calculateTaxes)
}
