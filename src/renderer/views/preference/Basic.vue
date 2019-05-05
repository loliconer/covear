<template>
  <div class="pf-basic">
    <h4>基础设置</h4>
    <div class="pf-content">
      <label class="label">启动</label>
      <div style="display: flex;">
        <v-checkbox label="启动后自动开始未完成任务" v-model="options['resume-all-when-app-launched']"></v-checkbox>
      </div>
      <label class="label">默认下载路径</label>
      <div class="cv-select-dir">
        <v-input v-model="options.dir" readonly></v-input>
        <v-button @click="openDialogDir"><v-icon icon="folder-flat"></v-icon></v-button>
      </div>
      <label class="label l-start">任务管理</label>
      <div class="controls">
        <div class="c-row">
          <span>同时下载的最大任务数</span>
          <v-input type="number" v-model="options['max-concurrent-downloads']"></v-input>
        </div>
        <div class="c-row">
          <span>每个服务器最大连接数</span>
          <v-input type="number" v-model="options['max-connection-per-server']"></v-input>
        </div>
        <div class="c-row">
          <v-checkbox label="断点续传" v-model="options.continue"></v-checkbox>
        </div>
        <div class="c-row">
          <v-checkbox label="新建任务后自动跳转到下载页面" v-model="options['new-task-show-downloading']"></v-checkbox>
        </div>
        <div class="c-row">
          <v-checkbox label="下载完成后通知" v-model="options['task-notification']"></v-checkbox>
        </div>
      </div>
    </div>
    <div class="pf-bottom">
      <v-button @click="save">保存并应用</v-button>
    </div>
  </div>
</template>

<script>
  import electron from 'electron'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'Basic',
    data() {
      return {
        options: {
          dir: ''
        }
      }
    },
    computed: {
      ...mapState('preference', ['config'])
    },
    methods: {
      ...mapMutations('preference', ['savePreference']),
      initOptions() {
        const configs = [
          'dir',
          'split',
          'continue',
          'resume-all-when-app-launched',
          'max-concurrent-downloads',
          'max-connection-per-server',
          'task-notification',
          'auto-check-update',
          'new-task-show-downloading'
        ]
        for (let key of configs) this.options[key] = this.config[key]
      },
      openDialogDir() {
        electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        }, filePaths => {
          if (!filePaths) return

          this.options.dir = filePaths[0]
        })
      },
      save() {
        this.savePreference(this.options)
        this.success('保存成功')
        // electron.ipcRenderer.send('command', 'application:relaunch')
      }
    },
    created() {
      this.initOptions()
    }
  }
</script>
