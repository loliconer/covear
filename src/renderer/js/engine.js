import {remote} from 'electron'
import Aria2 from 'aria2'

const configManager = remote.getGlobal('configManager')

class Engine {
  constructor(options = {}) {
    this.options = options
    this.client = null
    this.init()
  }

  init() {
    this.client = new Aria2({
      port: configManager.getSystemConfig('rpc-listen-port'),
      secret: configManager.getSystemConfig('rpc-secret')
    })
    this.client.open()

    this.client.on('onDownloadStart', ([guid]) => {
      console.log('Aria2 onDownloadStart', guid)
    })
    // this.client.on('onDownloadComplete')
  }

  async close() {
    await this.client.close()
    this.client = null
  }

  async getVersion() {
    return await this.client.call('getVersion')
  }

  addUri(params) {
    const {uris, options} = params
    const tasks = uris.map(uri => ['aria2.addUri', [uri], options])
    console.log(tasks)
    return this.client.multicall(tasks)
  }

  addTorrent(params) {
    const {torrent, options} = params
    return this.client.call('addTorrent', torrent, [], options)
  }

  addMetalink(params) {
    const {metalink, options} = params
    return this.client.call('addMetalink', metaLink, options)
  }

  async fetchActiveTaskList(params = {}) {
    const args = [params.keys].filter(item => item !== undefined)
    const result = await this.client.call('tellActive', ...args).catch(err => {
      console.log('fetchDownloadingTaskList fail===>', err)
    })
    if (result === undefined) return []

    return result
  }

  async fetchWaitingTaskList(params = {}) {
    const { offset = 0, num = 20, keys } = params
    const args = [offset, num, keys].filter(item => item !== undefined)
    const result = await this.client.call('tellWaiting', ...args).catch(err => {
      console.log('fetchDownloadingTaskList fail===>', err)
    })
    if (result === undefined) return []

    return result
  }

  async fetchStoppedTaskList(params = {}) {
    const { offset = 0, num = 20, keys } = params
    const args = [offset, num, keys].filter(item => item !== undefined)
    const result = await this.client.multicall('tellStopped', ...args).catch(err => {
      console.log('fetchDownloadingTaskList fail===>', err)
    })
    if (result === undefined) return []

    return result
  }
}

export default new Engine()
