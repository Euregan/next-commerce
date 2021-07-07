import test from 'tape'
import { prepareResponse } from './response.js'
import { prepareRequest } from './request.js'
import handler from '../pages/api/auth.js'

test('GET request should be rejected', async function(t) {
  const { external, internal } = prepareResponse()

  await handler(prepareRequest('GET'), external)

  t.equal(internal.sent, true, 'Response should have been sent')
  t.equal(
    internal.status,
    405,
    'Response status should be 405 to signal that the wrong HTTP method has been used'
  )
})

test('POST request without an email or a password should be rejected', async function(t) {
  const { external, internal } = prepareResponse()

  await handler(
    prepareRequest('POST', { email: 'user@commerce.com' }),
    external
  )

  t.equal(internal.sent, true, 'Response should have been sent')
  t.equal(
    internal.status,
    400,
    'Response status should be 400 to signal that the payload was malformed'
  )
  t.deepEqual(internal.content, {
    message: 'The password is necessary to identify you'
  })

  await handler(prepareRequest('POST', { password: 'T0psecret' }), external)

  t.equal(internal.sent, true, 'Response should have been sent')
  t.equal(
    internal.status,
    400,
    'Response status should be 400 to signal that the payload was malformed'
  )
  t.deepEqual(internal.content, {
    message: 'The email is necessary to identify you'
  })

  await handler(prepareRequest('POST', {}), external)

  t.equal(internal.sent, true, 'Response should have been sent')
  t.equal(
    internal.status,
    400,
    'Response status should be 400 to signal that the payload was malformed'
  )
  t.deepEqual(internal.content, {
    message: 'The email is necessary to identify you'
  })
})

test('POST request with a valid email and password should return a token', async function(t) {
  const { external, internal } = prepareResponse()

  await handler(
    prepareRequest('POST', {
      email: 'user@commerce.com',
      password: 'T0psecret'
    }),
    external
  )

  t.equal(internal.sent, true, 'Response should have been sent')
  t.equal(
    internal.status,
    200,
    'Response status should be 200 to signal that the request has been successfully fulfilled'
  )
  t.equal(internal.type, 'json', 'Response should be in json')
  t.equal(
    typeof internal.content.token,
    'string',
    'Response should provide a token in a string'
  )
})
