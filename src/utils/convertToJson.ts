import parser from 'fast-xml-parser';
import fs from 'fs';
import { resolve } from 'path';

const convertToJson = (path: string, filename: string) => {
  const value = fs.readFileSync(path).toString();

  const json = parser.parse(value);

  fs.writeFileSync(
    resolve(__dirname, '..', 'tmp', 'json', `${filename}.json`),
    JSON.stringify(json, null, 2)
  );
};

export { convertToJson };
