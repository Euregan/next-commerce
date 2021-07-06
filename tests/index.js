import test from 'tape'
import { ClientRequest, ServerResponse } from 'http'
import handler from '../pages/api/hello.js'

const request = method => {
  const request = {}

  return request
}
const prepareResponse = () => {
  const internal = {
    status: 200,
    type: 'empty',
    content: null,
    sent: false
  }

  const external = {
    status: newStatus => {
      internal.status = newStatus
      return external
    },
    json: newContent => {
      internal.type = 'json'
      internal.content = newContent
      internal.sent = true
      return external
    }
  }

  return { external, internal }
}

test('testing simple get', async function (t) {
  const { external, internal } = prepareResponse()

  await handler(request('GET'), external)

  t.equal(internal.type, 'json', 'Response type should be json')
  t.deepEqual(
    internal.content,
    { name: 'John Doe' },
    'Content should be as expected'
  )
  t.equal(internal.sent, true, 'Response should have been sent')
})
