export default {
  namespaced: true,
  state: {
    taskList: []
  },
  mutations: {
    updateTaskList(state, value) {
      state.taskList = value
    }
  }
}
