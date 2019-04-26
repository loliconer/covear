import {app, protocol, BrowserWindow, ipcMain} from 'electron'
import is from 'electron-is'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
// import Launcher from './Launcher'
import ConfigManager from './main/core/ConfigManager'

const isDevelopment = process.env.NODE_ENV !== 'production'

is.windows() && app.setAppUserModelId('dapp.lovue.covear')
// Standard scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', secure: true }])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
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
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => win = null)
}

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
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

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') app.quit()
    })
  } else {
    process.on('SIGTERM', () => app.quit())
  }
}
