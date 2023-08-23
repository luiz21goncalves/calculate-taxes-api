import { FastifyReply, FastifyRequest } from 'fastify'

export async function parseXml(request: FastifyRequest, replay: FastifyReply) {
  return replay.status(200).send({ ok: true })
}
