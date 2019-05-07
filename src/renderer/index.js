import './less/style.less'
import App from './App.vue'
import router from './router'
import store from './store'
import {remote, ipcRenderer} from 'electron'
import Client from './aria2'

const configManager = remote.getGlobal('configManager')

Vue.config.productionTip = false
process.browser = true

function initClient() {
  window.client = new Client({
    port: configManager.getSystemConfig('rpc-listen-port'),
    secret: configManager.getSystemConfig('rpc-secret')
  })
}
initClient()

ipcRenderer.on('aria2:restart', () => {
  initClient()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('app')
