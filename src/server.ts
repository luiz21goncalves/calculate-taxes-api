import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { resolve, join } from 'path'
import { randomBytes } from 'crypto';
import { convertToJson, getFields } from './utils';

const app = express();

const tmpPath = resolve(__dirname, '..','tmp')

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, join(tmpPath, 'xml'));
  },
  filename: (request, file, callback) => {
    const hash = randomBytes(12).toString('hex');
    const filename = `${hash}-${file.originalname}`
    callback(null, filename);
  }
});

const upload = multer({ storage });

app.use(cors());

app.post('/fiscal-documents', upload.single('file'),(request, response) => {
try {
  const { file } = request

  const filename = file.filename.replace('.xml', '')

  convertToJson(join(tmpPath, 'xml', file.filename), filename)

  const data = getFields(filename)
  
  return response.json(data)
} catch (error) {
  console.error(error)
  return response.status(500).json({
    statusCode: 500,
    message: 'Internal server error' 
  })
}
})

app.listen(3333, () => console.log('Server is running'))
