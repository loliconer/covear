import EventEmitter from 'events'

function prefix(method) {
  if (!method.startsWith('system.') && !method.startsWith('aria2.'))
    method = `aria2.${method}`

  return method
}

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export default class Client extends EventEmitter {
  constructor(options = {}) {
    super()

    this.secure = options.secure || false
    this.host = options.host || 'localhost'
    this.port = options.port || 6800
    this.secret = options.secret || ''
    this.path = options.path || '/jsonrpc'
    this.ws = null
    this.lastId = 0
    this.defers = {}

    init()
  }

  init() {
    const protocol = this.secure ? 'wss' : 'ws'
    const uri = `${protocol}://${this.host}:${this.port}${this.path}`
    const ws = new WebSocket(uri)

    ws.onopen = event => this.emit('open', event)
    ws.onclose = event => this.emit('close', event)
    ws.onerror = event => this.emit('error', event)
    ws.onmessage = event => {
      const message = JSON.parse(event.data)

      if (Array.isArray(message)) {
        for (const row of message) this.handleMsg(row)
      } else {
        this.handleMsg(message)
      }
    }

    this.ws = ws
  }

  handleMsg(message) {
    if (message.method === undefined) {
      const {id, error, result} = message
      const defer = this.defers[id]

      if (!defer) return

      if (error) return defer.reject(error)

      defer.resolve(result)
      delete this.defers[id]
    } else if (message.id === undefined) {
      this.emit(message.method, message.params)
    }
  }

  id() {
    return this.lastId++
  }

  secretParams(params) {
    if (Array.isArray(params)) {
      if (this.secret) params.unshift(`token:${this.secret}`)
    } else {
      if (this.secret) params = [`token:${this.secret}`]
    }
    return params
  }

  send(method, ...params) {
    if (this.ws.readyState !== 1) return

    params = this.secretParams(params)

    const message = {
      method: prefix(method),
      'json-rpc': '2.0',
      id: this.id()
    }
    if (params) message.params = params
    this.ws.send(JSON.stringify(message))

    const defer = new Deferred()
    this.defers[message.id] = defer
    return defer.promise
  }

  async multi(calls) {
    return this.send('system.multicall', [
      calls.map(([method, ...params]) => ({
        methodName: prefix(method),
        params: this.secretParams(params)
      }))
    ])
  }

  close() {
    this.ws.close()
  }
}
