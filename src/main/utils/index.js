import {existsSync, lstatSync} from 'fs'
import is from 'electron-is'

export function isDirectory(path) {
  return existsSync(path) && lstatSync(path).isDirectory()
}

export function parseArgv(argv) {
  let arg = argv[1]

  if (!arg ||isDirectory(arg)) return

  if (is.linux()) arg = arg.replace('file://', '')

  return arg
}
