export default {
  namespaced: true,
  state: {
    taskList: [],
    removedTaskList: []
  },
  mutations: {
    updateTaskList(state, value) {
      state.taskList = value
    },
    addRemovedTask(state, value) {
      state.removedTaskList.push(value)
    },
    deleteRemovedTask(state, value) {
      const index = state.removedTaskList.findIndex(task => task.gid === value)
      state.removedTaskList.splice(index, 1)
    }
  }
}
