import EventEmitter from 'events'
import {remote} from 'electron'
import Aria2 from 'aria2'

const configManager = remote.getGlobal('configManager')

class Engine extends EventEmitter {
  constructor(options = {}) {
    super()

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
      window.dispatchEvent(new CustomEvent('Aria2DownloadStart'))
    })
    this.client.on('onDownloadComplete', () => {
      window.dispatchEvent(new CustomEvent('Aria2DownloadComplete'))
    })
    this.client.on('onDownloadPause', () => {
      window.dispatchEvent(new CustomEvent('Aria2DownloadPause'))
    })
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

  pause(gid) {
    return this.client.call('pause', gid)
  }

  pauseAll() {
    return this.client.call('pauseAll')
  }

  forcePause(gid) {
    return this.client.call('forcePause', gid)
  }

  forcePauseAll() {
    return this.client.call('forcePauseAll')
  }

  unpause(gid) {
    return this.client.call('unpause', gid)
  }

  unpauseAll() {
    return this.client.call('unpauseAll')
  }

  remove(gid) {
    return this.client.call('remove', gid)
  }

  forceRemove(gid) {
    return this.client.call('forceRemove', gid)
  }

  purgeDownloadResult() {
    return this.client.call('purgeDownloadResult')
  }

  removeDownloadResult(gid) {
    return this.client.call('removeDownloadResult', gid)
  }

  saveSession() {
    return this.client.call('saveSession')
  }

  async fetchActiveTaskList(params = {}) {
    const args = [params.keys].filter(item => item !== undefined)
    return await this.client.call('tellActive', ...args).catch(err => {
      console.log('fetchActiveTaskList fail===>', err)
      return []
    })
  }

  async fetchWaitingTaskList(params = {}) {
    const { offset = 0, num = 20, keys } = params
    const args = [offset, num, keys].filter(item => item !== undefined)
    return await this.client.call('tellWaiting', ...args).catch(err => {
      console.log('fetchWaitingTaskList fail===>', err)
      return []
    })
  }

  async fetchStoppedTaskList(params = {}) {
    const { offset = 0, num = 20, keys } = params
    const args = [offset, num, keys].filter(item => item !== undefined)
    return await this.client.call('tellStopped', ...args).catch(err => {
      console.log('fetchStoppedTaskList fail===>', err)
      return []
    })
  }
}

export default new Engine()
