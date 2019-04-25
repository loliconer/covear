import {remote} from 'electron'
import {userKeys, systemKeys} from 'src/shared/configKeys'

const configManager = remote.getGlobal('configManager')

export default {
  namespaced: true,
  state: {
    engineMode: 'MAX',
    config: {
      ...configManager.getSystemConfig(),
      ...configManager.getUserConfig()
    }
  },
  mutations: {
    savePreference(state, config) {
      state.config = { ...state.config, ...config }

      const systemConfigs = {}, userConfigs = {}
      for (let key in config) {
        if (systemKeys.has(key)) systemConfigs[key] = config[key]
        if (userKeys.has(key)) userConfigs[key] = config[key]
      }
      configManager.setSystemConfig(systemConfigs)
      configManager.setUserConfig(userConfigs)
    }
  }
}
