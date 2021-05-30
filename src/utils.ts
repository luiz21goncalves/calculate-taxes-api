import fs from 'fs';
import { resolve } from 'path';
import convert from 'xml2json'

type IProducts = {
  id: number;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount: number;
  taxes: {
    ipi: number ;
    icms_st: number;
  }
  other: number;
}

type ITotal = {
  products: number;
  others: number;
  ipi: number;
  icms_st: number;
  shipping: number;
  safe: number;
  discount: number;
  nf: number;
}

type IProductsResponse = Pick<IProducts , 'id' | 'name' | 'quantity' | 'total_price' | 'unit_price'>

export const convertToJson = (path: string, filename: string) => {
  const value = fs.readFileSync(path).toString()
  
  const json = convert.toJson(value);
  
  fs.writeFileSync(resolve(__dirname, '..','tmp','json', `${filename}.json`), json)
}

export const getFields = (filename: string) => {
  const json = require(`../tmp/json/${filename}.json`)
  
  const number = Number(json.nfeProc.NFe.infNFe.ide.nNF)

  const seller = {
    cnpj: json.nfeProc.NFe.infNFe.emit.CNPJ,
    name: json.nfeProc.NFe.infNFe.emit.xNome
  }
  const customer = {
    cnpj: json.nfeProc.NFe.infNFe.dest.CNPJ,
    name: json.nfeProc.NFe.infNFe.dest.xNome
  }
  
  let products: IProducts[] = []
  const isNotProductArray = json.nfeProc.NFe.infNFe.det.prod
  
  if (isNotProductArray) {
    products.push({
      id: Number(json.nfeProc.NFe.infNFe.det.prod.cProd),
      name: String(json.nfeProc.NFe.infNFe.det.prod.xProd),
      quantity: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.qCom),
      unit_price: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vUnCom),
      total_price: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vProd),
      taxes: {
        icms_st: serializeNumbers(json.nfeProc.NFe.infNFe.det.imposto?.ICMS[Object.keys(json.nfeProc.NFe.infNFe.det.imposto.ICMS)[0]].vICMSST),
        ipi: serializeNumbers(json.nfeProc.NFe.infNFe.det.imposto?.IPI?.IPITrib?.vIPI)
      },
      other: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vOutro),
      discount: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vDesc),
    })
  }
  
  if (!isNotProductArray) {
    json.nfeProc.NFe.infNFe.det.forEach(product => {
      products.push({
        id: Number(product.prod.cProd),
        name: product.prod.xProd,
        quantity: serializeNumbers(product.prod.qCom),
        unit_price: serializeNumbers(product.prod.vUnCom),
        total_price: serializeNumbers(product.prod.vProd),
        taxes: {
          icms_st: serializeNumbers(product.imposto?.ICMS[Object.keys(product.imposto.ICMS)[0]].vICMSST),
          ipi: serializeNumbers(product.imposto?.IPI?.IPITrib?.vIPI)
        },
        other: serializeNumbers(product.prod.vOutro),
        discount: serializeNumbers(product.prod.vDesc),
      })
    });
  }
  
  const total = {
    products: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vProd),
    others: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vOutro),
    icms_st: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vST),
    shipping: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vFrete),
    ipi: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vIPI),
    discount: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vDesc),
    safe: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vSeg),
    nf: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vNF)
  } as ITotal;
  
  fs.unlinkSync(resolve(__dirname, '..','tmp','json', `${filename}.json` ))
  fs.unlinkSync(resolve(__dirname, '..','tmp','xml', `${filename}.xml` ))
  
  return { 
    number,
    seller,
    customer,
    products: calculateValue(products),
    total
  }
}

export const serializeNumbers = (value: string) => {
  if (typeof value !== 'string') return 0
  
  return Number(Number(value).toFixed(2)) * 100
}

export const calculateValue = (products: IProducts []) => {
  return products.map((product) => {
    const { id, name, quantity } = product
    
    const total_price = product.total_price + product.taxes.ipi + product.taxes.icms_st - product.discount;
    const unit_price = total_price / quantity * 100;
    
    return {
      id,
      name,
      quantity,
      total_price,
      unit_price,
    }
  })
}
