<template>
  <aside class="cv-aside">
    <header class="a-head"></header>
    <div class="a-menu">
      <div class="m-top">
        <div class="m-item" @click="showAddTaskPanel"><v-icon icon="plus"></v-icon>新建任务</div>
        <router-link class="m-item" to="/task/active"><v-icon icon="play"></v-icon>下载中</router-link>
        <router-link class="m-item" to="/task/stopped"><v-icon icon="check-circle-color"></v-icon>已完成</router-link>
        <router-link class="m-item" to="/task/trash"><v-icon icon="delete"></v-icon>已删除</router-link>
      </div>

      <div class="m-bottom">
        <router-link class="m-item" to="/preference/basic"><v-icon icon="setting"></v-icon>设置</router-link>
        <div class="m-item" @click="showAboutPanel"><v-icon icon="question-o"></v-icon>关于</div>
      </div>
    </div>

    <v-popup v-model="isShowAboutPanel">
      <panel-about></panel-about>
    </v-popup>

    <v-popup title="新建任务" v-model="isShowAddTaskPanel" no-footer fixed>
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
