<template>
  <aside class="cv-aside">
    <div class="a-menu top">
      <router-link class="m-item" to="/task"><v-icon icon="list"></v-icon></router-link>
      <div class="m-item" @click="showAddTaskPanel"><v-icon icon="plus"></v-icon></div>
    </div>

    <div class="a-menu bottom">
      <router-link class="m-item" to="/preference"><v-icon icon="setting"></v-icon></router-link>
      <div class="m-item" @click="showAboutPanel"><v-icon icon="question-o"></v-icon></div>
    </div>

    <v-popup v-model="isShowAboutPanel">
      <panel-about></panel-about>
    </v-popup>

    <v-popup v-model="isShowAddTaskPanel" no-footer fixed>
      <panel-add-task @close="isShowAddTaskPanel = false"></panel-add-task>
    </v-popup>
  </aside>
</template>

<script>
  import About from './About'
  import AddTask from './AddTask'

  export default {
    name: 'cv-aside',
    data() {
      return {
        isShowAboutPanel: false,
        isShowAddTaskPanel: false
      }
    },
    components: {
      'panel-about': About,
      'panel-add-task': AddTask
    },
    methods: {
      async showAboutPanel() {
        // this.engineVersion = await engine.getVersion()
        this.isShowAboutPanel = true
      },
      showAddTaskPanel() {
        this.isShowAddTaskPanel = true
      }
    }
  }
</script>
