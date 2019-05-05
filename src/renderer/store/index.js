import Vuex from 'vuex'
import preference from './modules/preference'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { preference, app },
  strict: process.env.NODE_ENV !== 'production'
})
