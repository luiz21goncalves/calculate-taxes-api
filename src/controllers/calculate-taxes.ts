import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function calculateTaxes(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const calculateTaxesParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = calculateTaxesParamsSchema.parse(request.params)

  return replay.status(200).send({ id })
}
