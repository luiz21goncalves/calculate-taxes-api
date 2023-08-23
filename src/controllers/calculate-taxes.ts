import fs from 'node:fs/promises'

import { XMLParser } from 'fast-xml-parser'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { CONFIG } from '@/config'

const parser = new XMLParser()

export async function calculateTaxes(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const calculateTaxesParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = calculateTaxesParamsSchema.parse(request.params)

  const xmlData = await fs.readFile(`${CONFIG.DIR.XML}/${id}.xml`)

  const json = parser.parse(xmlData)

  const number = Number(json.nfeProc.NFe.infNFe.ide.nNF)

  const seller = {
    document:
      json.nfeProc.NFe.infNFe.emit.CNPJ ?? json.nfeProc.NFe.infNFe.emit.CPF,
    name: json.nfeProc.NFe.infNFe.emit.xNome,
  }

  const customer = {
    document:
      json.nfeProc.NFe.infNFe.dest.CNPJ ?? json.nfeProc.NFe.infNFe.dest.CPF,
    name: json.nfeProc.NFe.infNFe.dest.xNome,
  }

  const hasProductArray = typeof json.nfeProc.NFe.infNFe.det.prod !== 'object'
  const products = []

  if (hasProductArray) {
    json.nfeProc.NFe.infNFe.det.forEach(
      (product: {
        prod: {
          cProd: string | number
          xProd: string
          qCom: number
          vUnCom: number
          vProd: number
          uCom: string
          vOutro: number
          vDesc: number
          vFrete: number
        }
        imposto: {
          ICMS: { [x: string]: { vICMSST: number } }
          IPI: { IPITrib: { vIPI: number } }
        }
      }) => {
        products.push({
          id: product.prod.cProd,
          name: product.prod.xProd,
          quantity: product.prod.qCom,
          unit_price: product.prod.vUnCom,
          total_price: product.prod.vProd,
          unit: product.prod.uCom,
          taxes: {
            icms_st:
              product.imposto?.ICMS[Object.keys(product.imposto.ICMS)[0]]
                .vICMSST,

            ipi: product.imposto?.IPI?.IPITrib?.vIPI,
          },
          other: product.prod.vOutro,
          discount: product.prod.vDesc,
          shipping: product.prod.vFrete,
        })
      },
    )
  } else {
    products.push({
      id: json.nfeProc.NFe.infNFe.det.prod.cProd,
      name: String(json.nfeProc.NFe.infNFe.det.prod.xProd),
      quantity: json.nfeProc.NFe.infNFe.det.prod.qCom,
      unit_price: json.nfeProc.NFe.infNFe.det.prod.vUnCom,
      total_price: json.nfeProc.NFe.infNFe.det.prod.vProd,
      unit: json.nfeProc.NFe.infNFe.det.prod.uCom,
      taxes: {
        icms_st:
          json.nfeProc.NFe.infNFe.det.imposto?.ICMS[
            Object.keys(json.nfeProc.NFe.infNFe.det.imposto.ICMS)[0]
          ].vICMSST,
        ipi: json.nfeProc.NFe.infNFe.det.imposto?.IPI?.IPITrib?.vIPI,
      },
      other: json.nfeProc.NFe.infNFe.det.prod.vOutro,
      discount: json.nfeProc.NFe.infNFe.det.prod.vDesc,
      shipping: json.nfeProc.NFe.infNFe.det.prod.vFrete,
    })
  }

  const total = {
    products: json.nfeProc.NFe.infNFe.total.ICMSTot.vProd,
    others: json.nfeProc.NFe.infNFe.total.ICMSTot.vOutro,
    icms_st: json.nfeProc.NFe.infNFe.total.ICMSTot.vST,
    shipping: json.nfeProc.NFe.infNFe.total.ICMSTot.vFrete,
    ipi: json.nfeProc.NFe.infNFe.total.ICMSTot.vIPI,
    discount: json.nfeProc.NFe.infNFe.total.ICMSTot.vDesc,
    safe: json.nfeProc.NFe.infNFe.total.ICMSTot.vSeg,
    nf: json.nfeProc.NFe.infNFe.total.ICMSTot.vNF,
  }

  return replay.status(200).send({ number, seller, customer, products, total })
}
