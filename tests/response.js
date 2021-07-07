export const prepareResponse = () => {
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
