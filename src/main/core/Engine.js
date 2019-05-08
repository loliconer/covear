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
    this.maxRestartTimes = options.max || 10
    this.startTimes = 0
    this.forceStop = false
    this.aria2 = null
    this.spawnOptions = {
      cwd: process.cwd()
    }

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
      `--save-session=${sessionPath}`
    ]

    if (existsSync(sessionPath)) {
      args.push(`--input-file=${sessionPath}`)
    }

    for (let key in systemConfig) {
      if (systemConfig[key] !== '') args.push(`--${key}=${systemConfig[key]}`)
    }

    return args
  }

  start(isRestart) {
    console.log('start Times ', this.startTimes)

    if (this.startTimes >= this.maxRestartTimes) return
    this.startTimes++

    logger.info('Aria2 starting ===>', this.startTimes)
    const aria2 = execFile(this.getBin(), this.getArgs(), this.spawnOptions)

    if (!aria2) {
      logger.info('Aria2 start failed ===>')
      throw 'Aria2 start failed'
    }

    logger.info('Aria2 pid ===>', aria2.pid)
    aria2.on('error', err => logger.info('Aria2 error ===>', err))
    aria2.on('exit', (code, signal) => {
      logger.info('Aria2 exit ===>', code, signal)

      if (this.forceStop) {
        this.forceStop = false
        this.emit('aria2:exit')
        return
      }
      if (this.startTimes >= this.maxRestartTimes) {
        this.emit('aria2:exit')
      }

      setTimeout(() => this.start(true), 1000)
    })

    this.aria2 = aria2

    if (isRestart) this.emit('aria2:restart')
  }

  stop() {
    logger.info('Aria2 stopped')

    this.forceStop = true
    this.startTimes = 0
    const { pid } = this.aria2
    process.kill(pid)
  }

  restart() {
    logger.info('Aria2 restart')

    this.startTimes = 0
    const { pid } = this.aria2
    process.kill(pid)
  }
}
