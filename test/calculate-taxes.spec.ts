import fs from 'node:fs/promises'

import supertest from 'supertest'
import { expect, it, describe, beforeAll, afterAll, vi } from 'vitest'

import { app } from '@/app'
import { CONFIG } from '@/config'

describe('Calculate Taxes (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to calculate taxes', async () => {
    vi.spyOn(fs, 'readFile').mockImplementationOnce(() => {
      return fs.readFile(
        `${CONFIG.DIR.ROOT}/test/mocks/mock-with-one-product.xml`,
      )
    })

    const response = await supertest(app.server)
      .get('/calculate/a3a36adc-71d9-4a9a-a0f4-41c2a9bacf8f')
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.number).toEqual(99999999)
    expect(response.body.seller).toEqual({
      document: 99999999000199,
      name: 'XTOP VAREJO LTDA',
    })
    expect(response.body.customer).toEqual({
      document: 99999999900,
      name: 'Faler Diok Robeikae',
    })
    expect(response.body.products).toHaveLength(1)
    expect(response.body.products).toEqual([
      {
        id: 'B07TXY3C3W',
        name: 'MTX Broca Escalonada 4-5-6-7-8-9-10-11-12 Mm Hss Professional',
        quantity: 100,
        unit_price: 1890,
        total_price: 1890,
        unit: 'UN',
        taxes: {
          icms_st: 0,
          ipi: 0,
        },
        other: 0,
        discount: 0,
        shipping: 0,
      },
    ])
    expect(response.body.total).toEqual({
      products: 4419,
      others: 0,
      icms_st: 0,
      shipping: 0,
      ipi: 0,
      discount: 0,
      safe: 0,
      nf: 4419,
    })
  })

  it('should be able to calculate taxes with multiple products', async () => {
    vi.spyOn(fs, 'readFile').mockImplementationOnce(() => {
      return fs.readFile(
        `${CONFIG.DIR.ROOT}/test/mocks/mock-with-multiple-products.xml`,
      )
    })

    const response = await supertest(app.server)
      .get('/calculate/a3a36adc-71d9-4a9a-a0f4-41c2a9bacf8f')
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.number).toEqual(99999999)
    expect(response.body.seller).toEqual({
      document: 99999999000199,
      name: 'XTOP VAREJO LTDA',
    })
    expect(response.body.customer).toEqual({
      document: 99999999900,
      name: 'Faler Diok Robeikae',
    })
    expect(response.body.products).toHaveLength(3)
    expect(response.body.products).toEqual([
      {
        id: 'B0787G348P',
        name: 'Corretivo em Fita 5mmx6m Azul - Blister com 1 Unidade,Tilibra',
        quantity: 100,
        unit_price: 1257,
        total_price: 1257,
        unit: 'UN',
        taxes: {
          icms_st: 0,
          ipi: 0,
        },
        other: 0,
        discount: 0,
        shipping: 0,
      },
      {
        id: 'B07ZS3WYQG',
        name: 'Lola Cosmetics Manteiga de Matcha + Leite Vegetal - Shamp.',
        quantity: 100,
        unit_price: 2163,
        total_price: 2163,
        unit: 'UN',
        taxes: {
          icms_st: 0,
          ipi: 0,
        },
        other: 0,
        discount: 0,
        shipping: 0,
      },
      {
        id: 'B097QNB87K',
        name: 'Esponja Ep10 Gota Chanfrada Para Maquiagem - Rosa, Macrilan',
        quantity: 100,
        unit_price: 999,
        total_price: 999,
        unit: 'UN',
        taxes: {
          icms_st: 0,
          ipi: 0,
        },
        other: 0,
        discount: 0,
        shipping: 0,
      },
    ])
    expect(response.body.total).toEqual({
      products: 4419,
      others: 0,
      icms_st: 0,
      shipping: 0,
      ipi: 0,
      discount: 0,
      safe: 0,
      nf: 4419,
    })
  })

  it('should be able to calculate taxes with cpf', async () => {
    vi.spyOn(fs, 'readFile').mockImplementationOnce(() => {
      return fs.readFile(`${CONFIG.DIR.ROOT}/test/mocks/mock-with-cpf.xml`)
    })

    const response = await supertest(app.server)
      .get('/calculate/a3a36adc-71d9-4a9a-a0f4-41c2a9bacf8f')
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.number).toEqual(99999999)
    expect(response.body.seller).toEqual({
      document: 99999999900,
      name: 'Faler Diok Robeikae',
    })
    expect(response.body.customer).toEqual({
      document: 99999999000199,
      name: 'XTOP VAREJO LTDA',
    })
    expect(response.body.products).toHaveLength(1)
    expect(response.body.products).toEqual([
      {
        id: 'B07TXY3C3W',
        name: 'MTX Broca Escalonada 4-5-6-7-8-9-10-11-12 Mm Hss Professional',
        quantity: 100,
        unit_price: 1890,
        total_price: 1890,
        unit: 'UN',
        taxes: {
          icms_st: 0,
          ipi: 0,
        },
        other: 0,
        discount: 0,
        shipping: 0,
      },
    ])
    expect(response.body.total).toEqual({
      products: 4419,
      others: 0,
      icms_st: 0,
      shipping: 0,
      ipi: 0,
      discount: 0,
      safe: 0,
      nf: 4419,
    })
  })
})
