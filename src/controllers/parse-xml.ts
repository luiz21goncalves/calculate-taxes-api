import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

import { FastifyReply, FastifyRequest } from 'fastify'

import { CONFIG } from '@/config'

export async function parseXml(request: FastifyRequest, replay: FastifyReply) {
  const file = await request.file()

  if (!file) {
    return replay.status(400).send({ message: 'File is required.' })
  }

  const isXmFile = file.mimetype.includes('xml')

  if (!isXmFile) {
    return replay.status(400).send({ message: 'Send an XML file.' })
  }

  const id = randomUUID()
  const fileName = `${id}.xml`
  const path = `${CONFIG.DIR.XML}/${fileName}`

  await fs.writeFile(path, file.file)

  return replay.status(201).send({ id })
}
