import './less/style.less'
import App from './App.vue'
import router from './router'
import store from './store'
import {remote} from 'electron'
import Client from './js/aria2'

const configManager = remote.getGlobal('configManager')

Vue.config.productionTip = false

window.client = new Client({
  port: configManager.getSystemConfig('rpc-listen-port'),
  secret: configManager.getSystemConfig('rpc-secret')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('app')
