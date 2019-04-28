import {app} from 'electron'
import is from 'electron-is'
import {existsSync} from 'fs'
import {resolve, join} from 'path'
import forever from 'forever-monitor'
import logger from './Logger'

const binMap = {
  darwin: 'aria2c',
  win64: 'aria2c.exe',
  linux: 'aria2c'
}

export default class Engine {
  constructor(options = {}) {
    this.options = options
    this.systemConfig = options.systemConfig
    this.userConfig = options.userConfig
    this.instance = null
  }

  getStartSh() {
    let basePath = resolve(app.getAppPath(), '..')
    if (is.dev()) basePath = resolve(__dirname, `../../../extra/${process.platform}`)
    let binPath = join(basePath, `/aria2/${binMap[process.platform]}`)
    let confPath = join(basePath, `/aria2/aria2.conf`)
    let sessionPath = this.userConfig['session-path'] || app.getPath('userData')

    let result = [
      binPath,
      `--conf-path=${confPath}`,
      `--save-session=${sessionPath}`,
      `--input-file=${sessionPath}`
    ]

    for (let key in this.systemConfig) {
      if (this.systemConfig[key] !== '') result.push(`--${key}=${this.systemConfig[key]}`)
    }

    return result
  }

  start() {
    const sh = this.getStartSh()
    console.log(sh)
    logger.info('[Covear] Engine start sh ===>', sh)
    this.instance = forever.start(sh, {
      max: 10,
      parser(command, args) {
        return {command, args}
      },
      silent: !is.dev()
    })

    const {child} = this.instance
    logger.info('[Covear] Engine pid ===>', child.pid)

    this.instance.on('error', err => logger.info('[Covear] Engine error ===>', err))
    this.instance.on('start', () => logger.info('[Covear] Engine started'))
    this.instance.on('stop', () => logger.info('[Covear] Engine stopped'))
    this.instance.on('restart', () => logger.info('[Covear] Engine exit'))
    this.instance.on('exit:code', code => logger.info('[Covear] Engine exit ===>', code))
  }

  stop() {
    const {pid} = this.instance.child
    try {
      this.instance.stop()
    } catch (e) {
      logger.error('[Covear] Engine stop failed ===>', err.message)
      this.forceStop(pid)
    }
  }

  static forceStop(pid) {
    process.kill(pid)
  }

  restart() {
    this.stop()
    this.start()
  }
}
