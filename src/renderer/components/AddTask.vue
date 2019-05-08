<template>
  <div class="panel-add-task">
    <v-tab :titles="titles" v-model="tab"></v-tab>
    <div class="p-content">
      <textarea class="textarea span-1-6" placeholder="添加多个下载链接时，请确保每行只有一个链接（支持磁力链，一次只能添加一个）" v-model="options.uris" v-if="tab === 0"></textarea>
      <div class="cv-upload span-1-6" v-else>
        <v-icon icon="upload"></v-icon>
        <span class="u-tip">将种子拖到此处，或点击选择</span>
        <span class="u-name">{{torrentName}}</span>
        <input type="file" accept=".torrent" @change="selectTorrent">
      </div>
      <div class="c-parsed span-1-6" v-if="isShowParsed">
        <div class="p-cell c-head">文件名</div>
        <div class="p-cell c-head">大小</div>
        <template v-for="file of parsedMagnetFiles">
          <div class="p-cell">
            <v-checkbox :label="file.name" v-model="file.selected_"></v-checkbox>
          </div>
          <div class="p-cell">{{file.size}}</div>
        </template>
      </div>
      <label class="label">重命名</label>
      <v-input class="out-input" v-model="options.out" placeholder="选填（仅支持单任务）"></v-input>
      <label class="label">下载线程</label>
      <v-input type="number" v-model="options.split" min="1"></v-input>
      <label class="label">存储路径</label>
      <div class="cv-select-dir span-2-6">
        <v-input v-model="options.dir"></v-input>
        <v-button @click="openDialogDir"><v-icon icon="folder-flat"></v-icon></v-button>
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
          <v-checkbox label="跳转到下载页面" v-model="options['new-task-show-downloading']"></v-checkbox>
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
  import is from 'electron-is'
  import WebTorrent from 'webtorrent'
  import parseTorrent from 'parse-torrent'
  import {mapState, mapMutations} from 'vuex'
  import {bytesToSize} from 'src/shared/utils'

  const {remote} = electron
  const trClient = new WebTorrent()

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
        metalinks: [],
        isShowAdvancedOptions: false,
        torrentName: '',
        loading: false,
        parsedMagnetFiles: [],
        isShowParsed: false
      }
    },
    computed: {
      ...mapState('preference', ['config'])
    },
    watch: {
      'options.uris'(val) {
        // this.parseMagnet(val)
      }
    },
    methods: {
      ...mapMutations('app', ['updateTaskList']),
      parseMagnet(uris) {
        if (uris === '') {
          this.parsedMagnetFiles = []
          this.isShowParsed = false
          return
        }

        let links = uris.replace(/\r\n/g, '\n').split('\n')
        const uri = links[0]
        if (links.length === 1 && uri.startsWith('magnet:')) {
          const parsed = parseTorrent(uri)
          console.log(1)
          console.log(parsed)
          const result = trClient.add(uri, {}, function (torrent) {
            console.log(3)
            console.log(torrent)
          })
          console.log(2)
          console.log(result)
        } else {
          this.parsedMagnetFiles = []
          this.isShowParsed = false
        }
      },
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
      selectTorrent(ev) {
        const file = ev.target.files[0]
        this.torrentName = file.name

        parseTorrent.remote(file, (err, parsed) => {
          if (err) throw err
          this.parsedMagnetFiles = parsed.files.map(file => {
            file.selected_ = false
            file.size = bytesToSize(file.length)
            return file
          })
          this.isShowParsed = true
        })

        const reader = new FileReader()
        reader.onload = () => {
          this.options.torrent = reader.result.split('base64,')[1]
        }
        reader.readAsDataURL(file)
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
        if (this.loading) return
        this.loading = true

        const option = this.buildOption()
        let result
        if (this.tab === 0) {
          result = await client.multi(this.urisArray.map(uri => ['addUri', [uri], option])).catch(this.error)
          this.loading = false
        }

        if (this.tab === 1) {
          const indexes = []
          this.parsedMagnetFiles.forEach((file, index) => {
            if (file.selected_) indexes.push(index + 1)
          })
          if (indexes.length < this.parsedMagnetFiles.length) option['select-file'] = indexes.join(',')

          result = await client.send('addTorrent', this.options.torrent, [], option).catch(this.error)
          this.loading = false
        }

        if (result === undefined) return

        this.$emit('close')
        this.options.newTaskShowDownloading && this.$router.push({
          path: '/task/active'
        })
      },
      buildOption() {
        const { dir, out, split, userAgent, referer, cookie } = this.options
        const options = { split, headers: [] }

        out && (options.out = out)
        dir && (options.dir = dir)
        userAgent && options.headers.push(`User-Agent: ${userAgent}`)
        referer && options.headers.push(`Referer: ${referer}`)
        cookie && options.headers.push(`Cookie: ${cookie}`)

        return options
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
