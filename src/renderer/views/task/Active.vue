<template>
  <div class="page-task task-active">
    <header class="task-header">
      <div class="task-title">下载中</div>
      <div class="task-actions" v-if="activeTaskList.length || waitingTaskList.length">
        <span title="刷新任务列表"><v-icon icon="reload" @click="getTaskList"></v-icon></span>
        <span title="恢复所有任务"><v-icon icon="download" @click="unpauseAll"></v-icon></span>
        <span title="暂停所有任务"><v-icon icon="pause" @click="pauseAll"></v-icon></span>
        <span title="删除所有任务" @click="delAllTasks"><v-icon icon="delete"></v-icon></span>
      </div>
    </header>

    <div class="task-content">
      <div class="task-list">
        <div class="task-item" v-for="task of activeTaskList">
          <div class="i-above">
            <div class="i-name">{{task.name}}</div>
            <div class="i-actions">
              <span class="a-tip" v-if="isPausing">正在暂停</span>
              <v-icon icon="pause" @click="pauseTask(task)"></v-icon>
              <v-icon icon="close" size="18" @click="delTask(task)"></v-icon>
            </div>
          </div>
          <cv-progress :value="task.progress" decimal></cv-progress>
          <div class="i-bottom">
            <div class="i-size">
              <span>{{task.completedLength}} / {{task.totalLength}} ({{Math.trunc(task.progress * 10000) / 100}}%)</span>
              <span>剩余 {{task.remaining}}s</span>
              <span>连接数 {{task.connections}}</span>
            </div>
            <div class="i-upload" v-if="task.seeder">
              <span>正在做种</span>
              <span>上传速度 {{task.uploadSpeed}}/s</span>
              <span>已上传 {{task.uploadLength}}</span>
            </div>
            <div class="i-speed" v-else>
              <span>{{task.downloadSpeed}}/s</span>
              <span>{{task.errorMessage}}</span>
            </div>
          </div>
        </div>

        <div class="task-item" v-for="task of waitingTaskList">
          <div class="i-above">
            <div class="i-name">{{task.name}}</div>
            <div class="i-actions">
              <v-icon icon="opened-folder-color" @click="openFileFolder(task.path)"></v-icon>
              <v-icon icon="download" @click="unpauseTask(task)"></v-icon>
              <v-icon icon="close" size="18" @click="delTask(task)"></v-icon>
            </div>
          </div>
          <cv-progress :value="task.progress" decimal></cv-progress>
          <div class="i-bottom">
            <div class="i-size">{{task.completedLength}} / {{task.totalLength}} ({{Math.trunc(task.progress * 10000) / 100}}%)</div>
          </div>
        </div>
      </div>

      <div class="no-task" v-if="!activeTaskList.length && !waitingTaskList.length">当前没有下载任务</div>
    </div>
  </div>
</template>

<script>
  import {remote, shell} from 'electron'
  import path from 'path'
  import {bytesToSize, calcProgress, timeRemaining} from 'src/shared/utils'
  import {mapMutations} from 'vuex'
  import {sleep} from 'lovue/dist/utils.esm'
  import Progress from 'src/renderer/components/Progress'

  let timer

  export default {
    name: 'Active',
    data() {
      return {
        activeTaskList: [],
        waitingTaskList: [],
        isPausing: false
      }
    },
    components: {
      [Progress.name]: Progress
    },
    methods: {
      ...mapMutations('app', ['addRemovedTask']),
      getTaskList() {
        clearTimeout(timer)

        this.getActiveTaskList()
        this.getWaitingTaskList()
      },
      async getActiveTaskList() {
        const body = await client.send('tellActive').catch(this.error)
        if (body === undefined) return

        this.activeTaskList = body.filter(row => {
          return (row.bittorrent && row.bittorrent.info) || !row.bittorrent
        }).map(row => {
          const result = {
            gid: row.gid,
            status: row.status,
            totalLength: bytesToSize(row.totalLength),
            completedLength: bytesToSize(row.completedLength),
            uploadLength: bytesToSize(row.uploadLength),
            bitfield: row.bitfield,
            downloadSpeed: bytesToSize(row.downloadSpeed),
            uploadSpeed: bytesToSize(row.uploadSpeed),
            connections: row.connections,
            errorMessage: row.errorMessage,
            dir: row.dir,
            files: row.files,
            progress: calcProgress(row.totalLength, row.completedLength),
            remaining: timeRemaining(row.totalLength, row.completedLength, row.downloadSpeed),
          }

          if (row.bittorrent) {
            result.infoHash = row.infoHash
            result.numSeeders = row.numSeeders
            result.seeder = row.seeder === 'true'
            result.bittorrent = {
              mode: row.bittorrent.mode,
              info: row.bittorrent.info
            }
            result.name = row.bittorrent.info.name
            result.path = path.resolve(row.dir, row.bittorrent.info.name)
          } else {
            result.name = path.basename(row.files[0].path)
            result.path = row.files[0].path
          }

          return result
        })

        if (!this.activeTaskList.length) return clearTimeout(timer)

        clearTimeout(timer)
        timer = setTimeout(() => this.getActiveTaskList(), 1000)
      },
      async getWaitingTaskList() {
        const body = await client.send('tellWaiting', 0, 20).catch(this.error)
        if (body === undefined) return

        this.waitingTaskList = body.filter(row => {
          return (row.bittorrent && row.bittorrent.info) || !row.bittorrent
        }).map(row => {
          const result = {
            gid: row.gid,
            status: row.status,
            totalLength: bytesToSize(row.totalLength),
            completedLength: bytesToSize(row.completedLength),
            progress: calcProgress(row.totalLength, row.completedLength),
            dir: row.dir
          }

          if (row.bittorrent) {
            result.infoHash = row.infoHash
            result.bittorrent = {
              mode: row.bittorrent.mode,
              info: row.bittorrent.info
            }
            result.name = row.bittorrent.info.name
            result.path = path.resolve(row.dir, row.bittorrent.info.name)
          } else {
            result.name = path.basename(row.files[0].path)
            result.path = row.files[0].path
          }

          return result
        })
      },
      async pauseTask(task) {
        if (this.isPausing) return this.warn('存在正在暂停的任务，请稍后重试')
        this.isPausing = true

        await client.send('pause', task.gid).catch(async error => {
          this.error(error)
          return await client.send('forcePause', task.gid)
        })
        await client.send('saveSession')
      },
      async unpauseTask(task) {
        await client.send('unpause', task.gid).catch(this.error)
        await client.send('saveSession')
      },
      delTask(task) {
        remote.dialog.showMessageBox({
          type: 'warning',
          title: '删除任务',
          message: '你确定要删除该下载任务吗?',
          buttons: ['是', '否'],
          cancelId: 1,
          checkboxLabel: '同时删除文件'
        }, async (response, checkboxChecked) => {
          if (response === 0) {
            await client.send('forceRemove', task.gid).catch(this.error)
            await client.send('saveSession')

            this.getWaitingTaskList()
            this.addRemovedTask(task)

            if (checkboxChecked) {
              /**
               * 磁力链接任务，有 bittorrent，但没有 bittorrent.info
               * 在没下完变成BT任务之前 path 不是一个完整路径，未避免误删所在目录，所以删除时直接返回 true
               */
              if (task.bittorrent && !task.bittorrent.info) return

              remote.shell.moveItemToTrash(task.path)
              remote.shell.moveItemToTrash(`${task.path}.aria2`)
              if (task.bittorrent) {
                remote.shell.moveItemToTrash(path.resolve(task.dir, `${task.infoHash}.torrent`))
              }
            }
          }
        })
      },
      async unpauseAll() {
        await client.send('unpauseAll').catch(this.error)
        await client.send('saveSession')
      },
      async pauseAll() {
        if (this.isPausing) return
        this.isPausing = true

        await client.send('pauseAll').catch(this.error)
        await client.send('saveSession')
      },
      delAllTasks() {
        remote.dialog.showMessageBox({
          type: 'warning',
          title: '删除任务',
          message: '你确定要删除所有下载任务吗?',
          buttons: ['是', '否'],
          cancelId: 1
        }, async response => {
          if (response === 0) {
            const allTasks = [...this.activeTaskList, this.waitingTaskList]
            for (let i = 0; i < allTasks.length; i++) {
              await client.send('forceRemove', allTasks[i].gid).catch(this.error)
              this.addRemovedTask(allTasks[i])
            }
            await client.send('saveSession')
            this.getWaitingTaskList()
          }
        })
      },
      openFileFolder(filPath) {
        shell.showItemInFolder(path.normalize(filPath))
      },
      downloadStartHandler(event) {
        if (event[0].gid === window.parsingTorrentGid) return

        this.getWaitingTaskList()
        if (!this.activeTaskList.length) this.getActiveTaskList()
      },
      downloadPauseHandler(event) {
        this.isPausing = false
        this.getWaitingTaskList()
      }
    },
    async created() {
      while (client.ws.readyState !== 1) {
        await sleep(100)
      }
      this.getTaskList()

      client.on('onDownloadStart', this.downloadStartHandler)
      client.on('onDownloadPause', this.downloadPauseHandler)
    },
    beforeDestroy() {
      clearTimeout(timer)
      client.off('onDownloadStart', this.downloadStartHandler)
      client.off('onDownloadPause', this.downloadPauseHandler)
    }
  }
</script>
