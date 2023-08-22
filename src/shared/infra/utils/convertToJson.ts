import parser from 'fast-xml-parser'
import fs from 'fs'
import { resolve } from 'path'

import { tmpFolder } from '../../../config/upload'

const convertToJson = (path: string, filename: string) => {
  const value = fs.readFileSync(path).toString()

  const json = parser.parse(value)

  fs.writeFileSync(
    resolve(tmpFolder, 'json', `${filename}.json`),
    JSON.stringify(json, null, 2),
  )
}

export { convertToJson }
