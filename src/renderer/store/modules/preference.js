import {remote} from 'electron'

const configManager = remote.getGlobal('configManager')

const formTitles = {
  basic: '基础设置',
  advanced: '进阶设置',
  lab: '实验室'
}

export default {
  namespaced: true,
  state: {
    currentForm: 'basic',
    engineMode: 'MAX',
    config: {
      ...configManager.getSystemConfig(),
      ...configManager.getUserConfig()
    }
  },
  getters: {
    currentFormTitle: (state, getters) => {
      return formTitles[state.currentForm] ? formTitles[state.currentForm] : ''
    }
  },
  mutations: {
    savePreference(state, config) {
      state.config = { ...state.config, ...config }

      configManager.setSystemConfig({
        dir: config.dir,
        split: config.split,
        continue: config.continue,
        'max-concurrent-downloads': config['max-concurrent-downloads'],
        'max-connection-per-server': config['max-connection-per-server']
      })
      configManager.setUserConfig({
        'resume-all-when-app-launched': config['resume-all-when-app-launched'],
        'task-notification': config['task-notification'],
        'new-task-show-downloading': config['new-task-show-downloading']
      })
    },
    CHANGE_CURRENT_FORM(state, currentForm) {
      state.currentForm = currentForm
    }
  }
}
