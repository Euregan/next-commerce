import test from 'tape'
import { prepareResponse } from './response.js'
import { prepareRequest } from './request.js'
import handler from '../pages/api/products.js'

test('GET request should return a list of products', async function(t) {
  const { external, internal } = prepareResponse()

  await handler(prepareRequest('GET'), external)

  t.equal(internal.sent, true, 'Response should have been sent')
  t.equal(
    internal.status,
    200,
    'Response status should be 200 to signal that the request has been successfully fulfilled'
  )
  t.equal(internal.type, 'json', 'Response should be in json')
  t.equal(
    Array.isArray(internal.content),
    true,
    'Response should be an array of products'
  )
  t.equal(
    internal.content.length > 0,
    true,
    'The response should contain at least one product'
  )
  internal.content.forEach(product => {
    t.ok(product.id, true, 'Every product should have an id')
    t.ok(product.label, true, 'Every product should have a label')
    t.equal(
      typeof product.label === 'string',
      true,
      "A product's label should be a string"
    )
    t.ok(product.price, true, 'Every product should have a price')
    t.equal(
      typeof product.price === 'number',
      true,
      "A product's price should be a number"
    )
  })
})
