import {app, protocol, BrowserWindow, ipcMain} from 'electron'
import is from 'electron-is'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

import ConfigManager from './main/core/ConfigManager'

const isDevelopment = process.env.NODE_ENV !== 'production'

is.windows() && app.setAppUserModelId('dapp.lovue.covear')
protocol.registerSchemesAsPrivileged([{ scheme: 'app', secure: true }])

let win
function createWindow() {
  win = new BrowserWindow({
    title: '掩耳',
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // win.setMenu(null)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
  win.on('closed', () => win = null)
}

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  global.configManager = new ConfigManager()
  ipcMain.on('command', (event, command, ...args) => {
    switch (command) {
      case 'application:relaunch':
        app.relaunch()
        app.exit()
        break
      case 'application:reset':
        global.configManager.reset()
        app.relaunch()
        app.exit()
    }
  })
  createWindow()
})

app.on('activate', () => {
  if (win === null) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') app.quit()
    })
  } else {
    process.on('SIGTERM', () => app.quit())
  }
}