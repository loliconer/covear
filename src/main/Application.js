import {EventEmitter} from 'events'
import {app, shell, dialog, ipcMain} from 'electron'
import is from 'electron-is'
import {readFile} from 'fs'
import {extname, basename} from 'path'

import logger from './core/Logger'
import ConfigManager from './core/ConfigManager'
import WindowManager from './ui/WindowManager'

export default class Application extends EventEmitter {
  constructor() {
    super()
    this.isReady = false
    this.init()
  }

  init() {
    this.configManager = new ConfigManager()
    this.locale = this.configManager.getLocale()
    this.windowManager = new WindowManager({
      userConfig: this.configManager.getUserConfig()
    })
  }
}
