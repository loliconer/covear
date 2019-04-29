import {EventEmitter} from 'events'
import {existsSync} from 'fs'
import {resolve, join} from 'path'
import {execFile} from 'child_process'
import {app} from 'electron'
import is from 'electron-is'
import logger from './Logger'

export default class Engine extends EventEmitter {
  constructor(options = {}) {
    super()

    this.systemConfig = options.systemConfig || {}
    this.userConfig = options.userConfig || {}
    this.aria2 = null
    this.spawnOptions = {}

    this.init()
  }

  init() {
    let basePath = resolve(app.getAppPath(), '..')
    if (is.dev()) basePath = resolve(basePath, `./extra/${process.platform}`)
    this.basePath = basePath
  }

  getBin() {
    const binMap = {
      darwin: 'aria2c',
      win32: 'aria2c.exe',
      linux: 'aria2c'
    }
    return join(this.basePath, `/aria2/${binMap[process.platform]}`)
  }

  getArgs() {
    const { systemConfig, userConfig } = this
    const confPath = join(this.basePath, '/aria2/aria2.conf')
    const sessionPath = userConfig['session-path']
    const args = [
      `--conf-path=${confPath}`,
      `--save-session=${sessionPath}`,
      `--input-file=${sessionPath}`
    ]

    for (let key in systemConfig) {
      if (systemConfig[key] !== '') args.push(`--${key}=${systemConfig[key]}`)
    }

    return args
  }

  start() {
    logger.info('[Covear] Engine starting ===>')
    const aria2 = execFile(this.getBin(), this.getArgs, this.spawnOptions)

    logger.info('[Covear] Engine pid ===>', child.pid)

    aria2.on('error', err => logger.info('[Covear] Engine error ===>', err))
    aria2.on('start', () => logger.info('[Covear] Engine started'))
    aria2.on('stop', () => logger.info('[Covear] Engine stopped'))
    aria2.on('restart', () => logger.info('[Covear] Engine exit'))
    aria2.on('exit', code => logger.info('[Covear] Engine exit ===>', code))

    this.aria2 = aria2
  }

  stop() {
    const { pid } = this.aria2
    try {
      this.instance.stop()
    } catch (e) {
      logger.error('[Covear] Engine stop failed ===>', err.message)
      this.forceStop(pid)
    }
  }

  restart() {
    this.stop()
    this.start()
  }
}
