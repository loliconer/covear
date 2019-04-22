import Vuex from 'vuex'
import preference from './modules/preference'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { preference },
  strict: process.env.NODE_ENV !== 'production'
})
