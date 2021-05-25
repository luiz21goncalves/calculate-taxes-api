import fs from 'fs';
import path from 'path';
import convert from 'xml-js'

const basePath = path.resolve(__dirname, '../tmp')

fs.readdir(path.resolve(path.join(basePath, 'xml')), (err, files) => {
  if(err) return console.error(err)

  files.forEach(file => {
    const value = fs.readFileSync(path.join(basePath, `/xml/${file}`)).toString()
    
    const json = convert.xml2json(value, {compact: true, ignoreComment: true, spaces: 2})

    fs.writeFileSync(path.resolve(
      __dirname, 
      `../tmp/json/${file.replace('xml', 'json')}`),
       json
    )
  })
})
