function captureVisitor(user) {
  $fetch.post('/api/node/visitors', {
    user,
    screenX: window.screen.width,
    screenY: window.screen.height,
    viewportX: window.innerWidth,
    viewportY: window.innerHeight,
    type: 1,
    page: `${location.origin}${location.pathname}`
  }).catch(error => console.log('Capture Error: ', error))
}

export default async function () {
  const body = await $fetch.get('user').catch(error => {
    if (error.status === 200 && error.code === 401) {
      location.href = `/login.html?next=${location.href}`
    }
  })
  if (body === undefined) throw 'No Session'

  sessionStorage.csrf = body.csrf
  captureVisitor(body.username)
  return body
}
