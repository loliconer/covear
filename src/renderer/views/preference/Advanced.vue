<template>
  <div class="pf-advanced">
    <h4>高级设置</h4>
    <div class="pf-content">
      <label class="label"></label>
      <div style="display: flex;">
        <v-checkbox label="隐藏菜单栏（仅支持 Windows 和 Linux）" v-model="options['hide-app-menu']"></v-checkbox>
      </div>
      <label class="label l-start">代理</label>
      <div class="cell-proxy">
        <div class="c-row">
          <v-switch v-model="options['use-proxy']"></v-switch>
          <span>使用代理服务器</span>
        </div>
        <div class="c-row" v-if="options['use-proxy']">
          <v-input placeholder="[http://][USER:PASSWORD@]HOST[:PORT]" v-model="options['all-proxy']"></v-input>
        </div>
      </div>
      <label class="label l-start">开发者</label>
      <div class="cell-dev">
        <div class="c-row">
          <div class="r-label">应用日志路径</div>
          <v-input v-model="config['log-path']" disabled></v-input>
        </div>
        <div class="c-row">
          <div class="r-label">下载会话路径</div>
          <v-input v-model="config['session-path']" disabled></v-input>
        </div>
        <div class="c-row">
          <v-button type="danger" @click="reset">恢复初始设置</v-button>
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
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Advanced',
  data() {
    return {
      options: {
        'use-proxy': false
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
        'hide-app-menu',
        'use-proxy',
        'all-proxy'
      ]
      for (let key of configs) this.options[key] = this.config[key]
    },
    reset() {
      electron.remote.dialog.showMessageBox({
        type: 'warning',
        title: '恢复初始设置',
        message: '你确定要恢复为初始设置吗？',
        buttons: ['是', '否'],
        cancelId: 1
      }, response => {
        if (response === 0) {
          electron.ipcRenderer.send('command', 'application:reset')
        }
      })
    },
    save() {
      this.savePreference(this.options, 'advanced')
      // electron.ipcRenderer.send('command', 'application:relaunch')
    }
  },
  created() {
    this.initOptions()
  }
}
</script>
