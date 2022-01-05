import { resolve } from 'path';

import { tmpFolder } from '../../../config/upload';
import { serializeNumbers } from './serializeNumbers';

type IProducts = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  discount: number;
  taxes: {
    ipi: number;
    icms_st: number;
  };
  other: number;
  shipping: number;
};

type ITotal = {
  products: number;
  others: number;
  ipi: number;
  icms_st: number;
  shipping: number;
  safe: number;
  discount: number;
  nf: number;
};

const getNoteFields = (filename: string) => {
  const json = require(resolve(tmpFolder, 'json', `${filename}.json`));

  const number = Number(json.nfeProc.NFe.infNFe.ide.nNF);

  const seller = {
    cnpj: json.nfeProc.NFe.infNFe.emit.CNPJ,
    name: json.nfeProc.NFe.infNFe.emit.xNome,
  };
  const customer = {
    cnpj: json.nfeProc.NFe.infNFe.dest.CNPJ,
    name: json.nfeProc.NFe.infNFe.dest.xNome,
  };

  const products: IProducts[] = [];
  const productType = typeof json.nfeProc.NFe.infNFe.det.prod;
  const isObject = productType === 'object';

  if (isObject) {
    products.push({
      id: json.nfeProc.NFe.infNFe.det.prod.cProd,
      name: String(json.nfeProc.NFe.infNFe.det.prod.xProd),
      quantity: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.qCom),
      unit_price: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vUnCom),
      total_price: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vProd),
      unit: json.nfeProc.NFe.infNFe.det.prod.uCom,
      taxes: {
        icms_st: serializeNumbers(
          json.nfeProc.NFe.infNFe.det.imposto?.ICMS[
            Object.keys(json.nfeProc.NFe.infNFe.det.imposto.ICMS)[0]
          ].vICMSST
        ),
        ipi: serializeNumbers(
          json.nfeProc.NFe.infNFe.det.imposto?.IPI?.IPITrib?.vIPI
        ),
      },
      other: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vOutro),
      discount: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vDesc),
      shipping: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vFrete),
    });
  }

  if (!isObject) {
    json.nfeProc.NFe.infNFe.det.forEach((product) => {
      products.push({
        id: product.prod.cProd,
        name: product.prod.xProd,
        quantity: serializeNumbers(product.prod.qCom),
        unit_price: serializeNumbers(product.prod.vUnCom),
        total_price: serializeNumbers(product.prod.vProd),
        unit: product.prod.uCom,
        taxes: {
          icms_st: serializeNumbers(
            product.imposto?.ICMS[Object.keys(product.imposto.ICMS)[0]].vICMSST
          ),
          ipi: serializeNumbers(product.imposto?.IPI?.IPITrib?.vIPI),
        },
        other: serializeNumbers(product.prod.vOutro),
        discount: serializeNumbers(product.prod.vDesc),
        shipping: serializeNumbers(product.prod.vFrete),
      });
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
    nf: serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vNF),
  } as ITotal;

  return {
    number,
    seller,
    customer,
    products,
    total,
  };
};

export { getNoteFields };
