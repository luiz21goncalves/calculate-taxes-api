import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import { join, resolve } from 'path';

import { tmpFolder, uploadConfig } from '../config/upload';
import { convertToJson } from '../utils/convertToJson';
import { getNoteFields } from '../utils/getNoteFields';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/', (request, response) => {
  return response.json({
    ok: true,
  });
});

routes.post('/xml/import', upload.single('file'), (request, response) => {
  const { file } = request;
  const filename = file.filename.replace('.xml', '');

  try {
    convertToJson(join(tmpFolder, 'xml', file.filename), filename);

    const data = getNoteFields(filename);

    fs.unlinkSync(resolve(__dirname, '..', 'tmp', 'json', `${filename}.json`));
    fs.unlinkSync(resolve(__dirname, '..', 'tmp', 'xml', `${filename}.xml`));

    return response.json(data);
  } catch (error) {
    console.error(error);

    fs.unlinkSync(resolve(__dirname, '..', 'tmp', 'json', `${filename}.json`));
    fs.unlinkSync(resolve(__dirname, '..', 'tmp', 'xml', `${filename}.xml`));

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});

export { routes };
