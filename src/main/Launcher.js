import {EventEmitter} from 'events'
import {app} from 'electron'
import is from 'electron-is'
import {parseArgv} from './utils'
import logger from './core/Logger'
import ExceptionHandler from './core/ExceptionHandler'
import Application from './Application'

export default class Launcher extends EventEmitter {
  constructor() {
    super()

    this.url = ''
    this.file = ''
    this.makeSingleInstance() && this.init()
  }

  makeSingleInstance() {
    // Mac App Store Sandboxed App not support requestSingleInstanceLock
    if (is.mas()) return true

    const gotSingleLock = app.requestSingleInstanceLock()

    if (!gotSingleLock) {
      app.quit()
      return false
    }

    app.on('second-instance', (event, argv) => {
      global.application.showPage('index')

      if (!is.macOS() && argv.length > 1) {
        this.file = parseArgv(argv)
        this.sendFileToApplication()
      }
    })
    return true
  }

  init() {
    this.exceptionHandler = new ExceptionHandler()
    this.handleAppEvents()
  }

  handleAppEvents() {
    this.handleOpenUrl()
    this.handleOpenFile()
    this.handleAppReady()
    this.handleAppWillQuit()
  }

  handleOpenUrl() {
    if (is.mas()) return

    app.on('open-url', (event, url) => {
      logger.info(`[Covear] open-url path: ${url}`)
      event.preventDefault()
      this.url = url
      if (this.url && global.application && global.application.isReady) {
        global.application.handleProtocol(this.url)
        this.url = ''
      }
    })
  }

  handleOpenFile() {
    if (is.macOS()) {
      app.on('open-file', (event, path) => {
        logger.info(`[Covear] open-file path: ${path}`)
        event.preventDefault()
        this.file = path
        this.sendFileToApplication()
      })
    } else if (process.argv.length > 1) {
      this.file = parseArgv(process.argv)
      this.sendFileToApplication()
    }
  }

  sendFileToApplication() {
    if (this.file && global.application && global.application.isReady) {
      global.application.handleFile(this.file)
      this.file = ''
    }
  }

  handleAppReady() {
    app.on('ready', () => {
      global.application = new Application()
      global.application.start('index')
      global.application.on('ready', () => {
        if (this.url) global.application.handleProtocol(this.url)
        if (this.file) global.application.handleFile(this.file)
      })
    })

    app.on('activate', () => {
      if (global.application) {
        logger.info('[Covear] activate')
        global.application.showPage('index')
      }
    })
  }

  handleAppWillQuit() {
    app.on('will-quite', () => {
      logger.info('[Covear] will-quit')
      if (global.application) global.application.stop()
    })
  }
}
