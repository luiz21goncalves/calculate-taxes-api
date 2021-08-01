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
  const json = require(`../tmp/json/${filename}.json`);

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
  const isNotProductArray = json.nfeProc.NFe.infNFe.det.prod;

  if (isNotProductArray) {
    products.push({
      id: json.nfeProc.NFe.infNFe.det.prod.cProd,
      name: String(json.nfeProc.NFe.infNFe.det.prod.xProd),
      quantity: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.qCom),
      unit_price: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vUnCom),
      total_price: serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vProd),
      unit: json.nfeProc.Nfe.infNFe.det.prod.uCom,
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
      shipping: serializeNumbers(json.nfeProc.NFe.det.prod.vFrete),
    });
  }

  if (!isNotProductArray) {
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

  const totalProducts = products.reduce((acc, product) => {
    const { other, total_price, taxes, discount, shipping } = product;

    const total =
      acc +
      other +
      total_price +
      taxes.icms_st +
      taxes.ipi +
      shipping -
      discount;

    return total;
  }, 0);

  const hasErrorCalculation = total.nf !== totalProducts;

  if (hasErrorCalculation) {
    console.error('error calculation', {
      hasErrorCalculation,
      total,
      totalProducts,
    });

    throw new Error('error calculation');
  }

  return {
    number,
    seller,
    customer,
    products,
    total,
  };
};

export { getNoteFields };
