import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = join(currentDir, '..')

export const CONFIG = {
  DIR: {
    ROOT: rootDir,
    JSON: join(rootDir, 'tmp/json'),
    XML: join(rootDir, 'tmp/xml'),
  },
}
