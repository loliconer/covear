import EventEmitter from 'events'
import {remote} from 'electron'

const configManager = remote.getGlobal('configManager')

class Client extends EventEmitter {
  constructor(options = {}) {
    super()

    this.secure = options.secure || false
    this.host = options.host || 'localhost'
    this.port = options.port || 6800
    this.secret = options.secret || ''
    this.path = options.path || '/jsonrpc'
    this.ws = null
    this.lastId = 0

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
      this.emit('receive', message)
    }

    this.ws = ws
  }

  id() {
    return this.lastId++
  }

  send(method, ...params) {
    if (this.ws.readyState !== 1) return

    if (!method.startsWith('system.') && !method.startsWith('aria2.'))
      method = `aria2.${method}`

    if (Array.isArray(params)) {
      if (this.secret) params.unshift(`token:${this.secret}`)
    } else {
      if (this.secret) params = [`token:${this.secret}`]
    }

    const message = {
      method,
      'json-rpc': '2.0',
      id: this.id()
    }
    if (params) message.params = params
    this.ws.send(JSON.stringify(message))
  }

  close() {
    this.ws.close()
  }
}
