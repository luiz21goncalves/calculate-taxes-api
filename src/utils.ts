import fs from 'fs';
import { resolve } from 'path';
import convert from 'xml2json'

export const convertToJson = (path: string, filename: string) => {
  const value = fs.readFileSync(path).toString()

  const json = convert.toJson(value);

  fs.writeFileSync(resolve(__dirname, '..','tmp','json', `${filename}.json`), json)
}

export const getFields = (filename) => {
  const json = require(`../tmp/json/${filename}.json`)

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
        quantity: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.qCom),
        price: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vProd),
        other: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vOutro),
        icmsSt: serializeNumbers(json.nfeProc.NFe.infNFe.det.imposto?.ICMS[Object.keys(json.nfeProc.NFe.infNFe.det.imposto.ICMS)[0]].vICMSST),
        discount: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vDesc),
      })
    }

    if (!isNotProductArray) {
      json.nfeProc.NFe.infNFe.det.forEach(element => {
        products.push({
          name: element.prod.xProd,
          quantity: serializeNumbers(element.prod.qCom),
          price: serializeNumbers(element.prod.vProd),
          other: serializeNumbers(element.prod.vOutro),
          icmsSt: serializeNumbers(element.imposto?.ICMS[Object.keys(element.imposto.ICMS)[0]].vICMSST),
          discount: serializeNumbers(element.prod.vDesc),
        })
      });
    }

    const total = {
      products: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vProd),
      others: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vOutro),
      st: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vST),
      shipping: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vFrete),
      ipi: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vIPI),
      discount: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vDesc),
      safe: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vSeg),
      nf: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vNF)
    }

    fs.unlinkSync(resolve(__dirname, '..','tmp','json', `${filename}.json` ))
    fs.unlinkSync(resolve(__dirname, '..','tmp','xml', `${filename}.xml` ))

    return { 
      number,
      company,
      customer,
      products,
      total
    }
}

export const serializeNumbers = (value: string) => {
  const number = Number(value)
  return number
}
