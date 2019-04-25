<template>
  <div class="panel-add-task">
    <v-tab :titles="titles" v-model="tab"></v-tab>
    <div class="p-content">
      <textarea class="textarea span-1-6" placeholder="添加多个下载链接时，请确保每行只有一个链接（支持磁力链）" v-model="options.uris" v-if="tab === 0"></textarea>
      <div class="cv-upload span-1-6" v-else>
        <v-icon icon="upload"></v-icon>
        <span class="u-tip">将种子拖到此处，或点击选择</span>
        <span>{{torrentName}}</span>
        <input type="file">
      </div>
      <label class="label">重命名</label>
      <v-input class="out-input" v-model="options.out" placeholder="选填（仅支持单任务）"></v-input>
      <label class="label">下载线程</label>
      <v-input type="number" v-model="options.split" min="1"></v-input>
      <label class="label">存储路径</label>
      <div class="cv-select-dir span-2-6">
        <v-input v-model="options.dir"></v-input>
        <v-button @click="openDialogDir"><v-icon icon="folder"></v-icon></v-button>
      </div>

      <!--高级选项-->
      <template v-if="isShowAdvancedOptions">
        <label class="label l-start">User-Agent</label>
        <textarea class="textarea span-2-6" v-model="options.userAgent"></textarea>
        <label class="label l-start">Referer</label>
        <textarea class="textarea span-2-6" v-model="options.referer"></textarea>
        <label class="label l-start">Cookie</label>
        <textarea class="textarea span-2-6" v-model="options.cookie"></textarea>
        <label class="label"></label>
        <div style="display: flex;">
          <v-checkbox label="跳转到下载页面" v-model="options.newTaskShowDownloading"></v-checkbox>
        </div>
      </template>
    </div>
    <div class="p-bottom">
      <v-checkbox label="高级选项" v-model="isShowAdvancedOptions"></v-checkbox>
      <div class="b-submits">
        <v-button type="ghost" @click="$emit('close')">取消</v-button>
        <v-button :loading="loading" @click="preSubmit">提交</v-button>
      </div>
    </div>
  </div>
</template>

<script>
  import electron from 'electron'
  import {remote} from 'electron'
  import is from 'electron-is'
  import engine from '../js/engine'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'AddTask',
    data() {
      return {
        titles: ['链接任务', '种子任务'],
        tab: 0,
        options: {
          uris: '',
          dir: '',
          split: 0,
          'new-task-show-downloading': false
        },
        urisArray: [],
        isShowAdvancedOptions: false,
        torrentName: '',
        loading: false
      }
    },
    computed: {
      ...mapState('preference', ['config'])
    },
    methods: {
      ...mapMutations('app', ['updateTaskList']),
      initOptions() {
        const configs = [
          'dir', 'split',
          'new-task-show-downloading'
        ]
        for (let key of configs) this.options[key] = this.config[key]
      },
      openDialogDir() {
        remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        }, filePaths => {
          if (!filePaths) return

          this.options.dir = filePaths[0]
        })
      },
      preSubmit() {
        if (this.tab === 0 && !this.checkCopyright()) return

        this.submit()
      },
      checkCopyright() {
        const audioExt = ['.aac', '.mp3', '.ogg', '.ape', '.flac', '.m4a', '.wav', '.wma', '.flav']
        const videoExt = ['.avi', '.mkv', '.rmvb', '.wmv', '.mp4', '.m4a', '.vob', '.mov', '.mpg']

        let links = this.options.uris.replace(/\r\n/g, '\n').split('\n')
        links = links.filter(link => !!link).map(link => {
          if (!link.startsWith('thunder://')) return link

          let result = link.trim().split('thunder://')[1]
          result = Buffer.from(result, 'base64').toString('utf8')
          result = result.substring(2, result.length - 2)
          return result
        })
        this.urisArray = links.slice()
        links = links.filter(link => [...audioExt, ...videoExt].some(ext => link.endsWith(ext)))

        if (!links.length) return true
        if (!is.mas()) return true

        remote.dialog.showMessageBox({
          type: 'warning',
          title: '版权提醒',
          message: '您要下载的文件可能是有版权的音视频，请确保您有相应的版权方授权。',
          buttons: ['是，我有版权方授权', '否'],
          cancelId: 1
        }, response => {
          response === 0 ? this.submit() : this.error('因版权问题，添加任务失败')
        })
        return false
      },
      async submit() {
        if (this.tab === 0) {
          await engine.addUri({
            uris: this.urisArray,
            options: this.buildOption()
          })
          this.updateTaskList(await engine.fetchTaskList({
            type: 'active'
          }))
        }

        if (tab === 1) {
          const { torrent } = this.options
          await engine.addTorrent({
            torrent,
            options: this.buildOption()
          })
          this.updateTaskList(await engine.fetchTaskList({
            type: 'active'
          }))
        }

        this.$emit('close')
        this.options.newTaskShowDownloading && this.$router.push({
          path: '/task/active'
        })
      },
      buildOption() {
        const { dir, out, split, userAgent, referer, cookie } = this.options
        return {
          dir, out, split,
          header: [
            `User-Agent: ${userAgent}`,
            `Referer: ${referer}`,
            `Cookie: ${cookie}`
          ]
        }
      }
    },
    created() {
      const content = electron.clipboard.readText()
      const resourceProtocol = ['http://', 'https://', 'ftp://', 'magnet:', 'thunder://']
      const hasResource = resourceProtocol.some(protocol => content.startsWith(protocol))
      hasResource && (this.options.uris = content)

      this.initOptions()
    }
  }
</script>
