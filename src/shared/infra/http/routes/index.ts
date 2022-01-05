import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import { resolve } from 'path';

import { tmpFolder, uploadConfig } from '../../../../config/upload';
import { convertToJson } from '../../utils/convertToJson';
import { getNoteFields } from '../../utils/getNoteFields';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/healthcheck', (request, response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'running',
    timestamp: new Date(),
  };

  try {
    return response.json(healthcheck);
  } catch (err) {
    healthcheck.message = err;

    return response.json(healthcheck);
  }
});

routes.post('/xml/import', upload.single('file'), (request, response) => {
  const { file } = request;
  const filename = file.filename.replace('.xml', '');

  try {
    convertToJson(resolve(tmpFolder, 'xml', file.filename), filename);

    const data = getNoteFields(filename);

    fs.unlinkSync(resolve(tmpFolder, 'json', `${filename}.json`));
    fs.unlinkSync(resolve(tmpFolder, 'xml', `${filename}.xml`));

    return response.json(data);
  } catch (error) {
    console.error(error);

    fs.unlinkSync(resolve(tmpFolder, 'json', `${filename}.json`));
    fs.unlinkSync(resolve(tmpFolder, 'xml', `${filename}.xml`));

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});

export { routes };
