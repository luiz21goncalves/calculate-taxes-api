import fs from 'node:fs/promises'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { CONFIG } from '@/config'

export async function calculateTaxes(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const calculateTaxesParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = calculateTaxesParamsSchema.parse(request.params)

  const xmlData = await fs.readFile(`${CONFIG.DIR.XML}/${id}.xml`)

  return replay.status(200).send({ id, xml: xmlData.toString() })
}
