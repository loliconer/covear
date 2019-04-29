import {app, protocol, BrowserWindow, ipcMain, dialog} from 'electron'
import is from 'electron-is'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
// import debug from 'electron-debug'
import ConfigManager from './main/core/ConfigManager'
import Engine from './main/core/Engine'

// debug()

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

  const configManager = new ConfigManager()
  global.configManager = configManager

  const engine = new Engine({
    systemConfig: configManager.getSystemConfig(),
    userConfig: configManager.getUserConfig()
  })
  try {
    engine.start()
  } catch (e) {
    dialog.showMessageBox({
      type: 'error',
      title: '系统错误',
      message: `应用启动失败: ${e.message}`
    }, () => {
      setTimeout(() => app.quit(), 100)
    })
  }

  ipcMain.on('command', (event, command, ...args) => {
    switch (command) {
      case 'application:relaunch':
        app.relaunch()
        app.exit()
        break
      case 'application:reset':
        configManager.reset()
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
