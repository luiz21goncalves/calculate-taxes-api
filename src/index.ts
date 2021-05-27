import fs from 'fs';
import path from 'path';
import convert from 'xml2json'

const basePath = path.resolve(__dirname, '../tmp')

// fs.readdir(path.resolve(path.join(basePath, 'xml')), (err, files) => {
//   if(err) return console.error(err)

//   files.forEach(file => {
//     const value = fs.readFileSync(path.join(basePath, `/xml/${file}`)).toString()
    
//     const json = convert.toJson(value)

//     fs.writeFileSync(path.resolve(
//       __dirname, 
//       `../tmp/json/${file.replace('xml', 'json')}`),
//       json
//       )
//   })
// })

// fs.readdir(path.join(basePath, 'json'), (err, files) => {
//   if (err) return console.error(err)

//   files.forEach(file => {
//     const json = require(`../tmp/json/${file}`)
 
//     fs.writeFileSync(path.resolve(__dirname, `../tmp/json/${file}`), JSON.stringify(json,  null, 4))
//   })

// })

fs.readdir(path.resolve(path.join(basePath, 'json')), (err, files) => {
  if(err) return console.error(err)

  files.forEach((file, index) => {
    const json = require(`../tmp/json/${file}`)

    const number = json.nfeProc.NFe.infNFe.ide.nNF
    const company = {
      cnpj: json.nfeProc.NFe.infNFe.emit.CNPJ,
      name: json.nfeProc.NFe.infNFe.emit.xNome
    }
    const customer = {
      cnpj: json.nfeProc.NFe.infNFe.dest.CNPJ,
      name: json.nfeProc.NFe.infNFe.dest.xNome
    }

    let products = []
    const isNotProductArray = json.nfeProc.NFe.infNFe.det.prod

    if (isNotProductArray) {
      products.push({
        name: json.nfeProc.NFe.infNFe.det.prod.xProd,
        quantity: json.nfeProc.NFe.infNFe.det.prod.qCom,
        price: json.nfeProc.NFe.infNFe.det.prod.vProd,
        other: json.nfeProc.NFe.infNFe.det.prod.vOutro,
        icmsSt: json.nfeProc.NFe.infNFe.det.imposto?.ICMS[Object.keys(json.nfeProc.NFe.infNFe.det.imposto.ICMS)[0]].vICMSST,
      })
    }

    if (!isNotProductArray) {
      json.nfeProc.NFe.infNFe.det.forEach(element => {
        products.push({
          name: element.prod.xProd,
          quantity: element.prod.qCom,
          price: element.prod.vProd,
          other: element.prod.vOutro,
          icmsSt: element.imposto?.ICMS[Object.keys(element.imposto.ICMS)[0]].vICMSST,
        })
      });
    }

    const total = {
      products: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vProd),
      others: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vOutro),
      st: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vST),
      shipping: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vFrete),
      ipi: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vIPI),
      discount: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vDesc),
      safe: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vSeg),
      nf: Number(json.nfeProc.NFe.infNFe.total.ICMSTot.vNF)
    }

    console.log({
      number,
      company,
      customer,
      products,
      total
    })
  })
})
