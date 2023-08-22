import { randomBytes } from 'crypto'
import multer, { Options } from 'multer'
import { resolve } from 'path'

const tmpFolder = resolve(__dirname, '..', '..', 'tmp')

const uploadConfig: Options = {
  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      callback(null, resolve(tmpFolder, 'xml'))
    },

    filename: (request, file, callback) => {
      const hash = randomBytes(12).toString('hex')
      const filename = `${hash}-${file.originalname}`
      callback(null, filename)
    },
  }),
}

export { uploadConfig, tmpFolder }
