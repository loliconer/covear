import {existsSync, lstatSync} from 'fs'
import {app} from 'electron'
import {resolve} from 'path'
import is from 'electron-is'
import logger from '../core/Logger'

export function getLogPath() {
  return logger.transports.file.file
}

export function getSessionPath() {
  return resolve(app.getPath('userData'), './download.session')
}

export function getUserDownloadsPath() {
  return app.getPath('downloads')
}

export function isDirectory(path) {
  return existsSync(path) && lstatSync(path).isDirectory()
}

export function parseArgv(argv) {
  let arg = argv[1]

  if (!arg ||isDirectory(arg)) return

  if (is.linux()) arg = arg.replace('file://', '')

  return arg
}
