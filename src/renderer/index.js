import './less/style.less'
import {$fetch} from 'lovue/dist/utils.esm'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

window.$fetch = $fetch

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('app')
