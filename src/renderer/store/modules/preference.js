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
    UPDATE_PREFERENCE_DATA(state, config) {
      state.config = { ...state.config, ...config }
    },
    CHANGE_CURRENT_FORM(state, currentForm) {
      state.currentForm = currentForm
    }
  }
}
