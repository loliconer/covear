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

  fetchTaskList(params = {}) {
    const { type } = params
    switch (type) {
      case 'active':
        return this.fetchDownloadingTaskList(params)
      case 'waiting':
        return this.fetchWaitingTaskList(params)
      case 'stopped':
        return this.fetchStoppedTaskList(params)
      default:
        return this.fetchDownloadingTaskList(params)
    }
  }

  fetchDownloadingTaskList(params = {}) {
    const { offset = 0, num = 20, keys } = params
    const result = this.client.multicall([
      ['aria2.tellActive', keys],
      ['aria2.tellWaiting', offset, num, keys]
    ]).catch(err => {
      console.log('fetchDownloadingTaskList fail===>', err)
    })
    if (result === undefined) return []

    console.log('fetchDownloadingTaskList data', result)
    return result.flat()
  }
}

export default new Engine()
