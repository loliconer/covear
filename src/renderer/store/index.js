import Vuex from 'vuex'
import preference from './modules/preference'
import engine from './modules/engine'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { preference, engine, app },
  strict: process.env.NODE_ENV !== 'production'
})
