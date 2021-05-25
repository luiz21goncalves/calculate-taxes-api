import fs from 'fs';
import path from 'path';
import convert from 'xml-js'

const basePath = path.resolve(__dirname, '../tmp')

// fs.readdir(path.resolve(path.join(basePath, 'xml')), (err, files) => {
//   if(err) return console.error(err)

//   files.forEach(file => {
//     const value = fs.readFileSync(path.join(basePath, `/xml/${file}`)).toString()
    
//     const json = convert.xml2json(value, {compact: true, ignoreComment: true, spaces: 2})

//     fs.writeFileSync(path.resolve(
//       __dirname, 
//       `../tmp/json/${file.replace('xml', 'json')}`),
//        json
//     )
//   })
// })

fs.readdir(path.resolve(path.join(basePath, 'json')), (err, files) => {
  if(err) return console.error(err)

  files.forEach((file, index) => {
    const json = require(`../tmp/json/${file}`)

    const number = json.nfeProc.NFe.infNFe.ide.nNF._text
    const company = {
      cnpj: json.nfeProc.NFe.infNFe.emit.CNPJ._text,
      name: json.nfeProc.NFe.infNFe.emit.xNome._text
    }
    const customer = {
      cnpj: json.nfeProc.NFe.infNFe.dest.CNPJ._text,
      name: json.nfeProc.NFe.infNFe.dest.xNome._text
    }

    let isNotProductsArray = json.nfeProc.NFe.infNFe.det._attributes?.nItem
    let products = []

    if (isNotProductsArray) {
      products.push({
        index: Number(json.nfeProc.NFe.infNFe.det._attributes.nItem),
        name: json.nfeProc.NFe.infNFe.det.prod.xProd._text,
        quantity: Number(json.nfeProc.NFe.infNFe.det.prod.qCom._text),
        priceUnit: Number(json.nfeProc.NFe.infNFe.det.prod.vUnCom._text),
        total: Number(json.nfeProc.NFe.infNFe.det.prod.vProd._text),
        taxes: {
          icmsST: json.nfeProc.NFe.infNFe.det.imposto.ICMS
        }
      })
    }

    if (!isNotProductsArray) {
      products = json.nfeProc.NFe.infNFe.det.map(item => {
        return {
          index: Number(item._attributes.nItem),
          name: item.prod.xProd._text,
          quantity: Number(item.prod.qCom._text),
          priceUnit: Number(item.prod.vUnCom._text),
          total: Number(item.prod.vProd._text),
          taxes: {
            icmsST: Array.from(item.imposto.ICMS).map(item => item)
          }
        }
      })     
    }

    const total = {
      products: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vProd._text),
      others: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vOutro._text),
      st: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vST._text),
      shipping: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vFrete._text),
      ipi: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vIPI._text),
      discount: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vDesc._text),
      safe: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vSeg._text),
      nf: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vNF._text)
    }

    console.log({index, products, total })
  })
})
