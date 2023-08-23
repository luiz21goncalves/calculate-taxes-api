import { FastifyReply, FastifyRequest } from 'fastify'

export async function parseXml(request: FastifyRequest, replay: FastifyReply) {
  const file = await request.file()

  if (!file) {
    return replay.status(400).send({ message: 'File is required.' })
  }

  const isXmFile = file.mimetype.includes('xml')

  if (!isXmFile) {
    return replay.status(400).send({ message: 'Send an XML file.' })
  }

  const filename = file.filename.replace('.xml', '')

  return replay.status(200).send({ filename, type: file.mimetype })
}
