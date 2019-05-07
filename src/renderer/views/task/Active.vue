<template>
  <div class="page-task task-active">
    <header class="task-header">
      <div class="task-title">下载中</div>
      <div class="task-actions" v-if="activeTaskList.length || waitingTaskList.length">
        <span title="刷新任务列表"><v-icon icon="download" @click="getTaskList"></v-icon></span>
        <span title="恢复所有任务"><v-icon icon="reload" @click="unpauseAll"></v-icon></span>
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
              <v-icon icon="pause" @click="pauseTask(task)"></v-icon>
              <v-icon icon="close" size="18" @click="delTask(task)"></v-icon>
            </div>
          </div>
          <v-progress :width="1000" :height="16" :value="task.progress" decimal></v-progress>
          <div class="i-bottom">
            <div class="i-size">
              <span>{{task.completedLength}} / {{task.totalLength}}</span>
              <span>剩余 {{task.remaining}}s</span>
            </div>
            <div class="i-speed">
              <span>{{task.downloadSpeed}}/s</span>
            </div>
          </div>
        </div>

        <div class="task-item" v-for="task of waitingTaskList">
          <div class="i-above">
            <div class="i-name">{{task.name}}</div>
            <div class="i-actions">
              <v-icon icon="download" @click="unpauseTask(task)"></v-icon>
              <v-icon icon="close" size="18" @click="delTask(task)"></v-icon>
            </div>
          </div>
          <v-progress :width="1000" :height="16" :value="task.progress" decimal></v-progress>
          <div class="i-bottom">
            <div class="i-size">{{task.completedLength}} / {{task.totalLength}}</div>
          </div>
        </div>
      </div>

      <div class="no-task" v-if="!activeTaskList.length && !waitingTaskList.length">当前没有下载任务</div>
    </div>
  </div>
</template>

<script>
  import {remote} from 'electron'
  import path from 'path'
  import {bytesToSize, calcProgress, timeRemaining} from 'src/shared/utils'
  import {mapMutations} from 'vuex'
  import {sleep} from 'lovue/dist/utils.esm'

  let timer

  export default {
    name: 'Active',
    data() {
      return {
        activeTaskList: [],
        waitingTaskList: []
      }
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

        this.activeTaskList = body.map(row => ({
          name: path.basename(row.files[0].path),
          path: row.files[0].path,
          completedLength: bytesToSize(row.completedLength),
          totalLength: bytesToSize(row.totalLength),
          progress: calcProgress(row.totalLength, row.completedLength),
          downloadSpeed: bytesToSize(row.downloadSpeed),
          gid: row.gid,
          connections: row.connections,
          dir: row.dir,
          remaining: timeRemaining(row.totalLength, row.completedLength, row.downloadSpeed)
        }))

        if (!body.length) return clearTimeout(timer)

        timer = setTimeout(() => this.getActiveTaskList(), 1000)
      },
      async getWaitingTaskList() {
        const body = await client.send('tellWaiting', 0, 20).catch(this.error)
        if (body === undefined) return

        this.waitingTaskList = body.map(row => ({
          name: path.basename(row.files[0].path),
          path: row.files[0].path,
          completedLength: bytesToSize(row.completedLength),
          totalLength: bytesToSize(row.totalLength),
          progress: calcProgress(row.totalLength, row.completedLength),
          gid: row.gid,
          dir: row.dir
        }))
      },
      async pauseTask(task) {
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
              // 磁力链接任务，有 bittorrent，但没有 bittorrent.info
              if (task.bittorrent && !task.bittorrent.info) return

              remote.shell.moveItemToTrash(task.path)
              remote.shell.moveItemToTrash(`${task.path}.aria2`)
            }
          }
        })
      },
      async unpauseAll() {
        await client.send('unpauseAll').catch(this.error)
        await client.send('saveSession')
      },
      async pauseAll() {
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
      }
    },
    async created() {
      await sleep(100)
      this.getTaskList()

      window.addEventListener('Aria2DownloadStart', () => {
        this.getWaitingTaskList()
        if (!this.activeTaskList.length) this.getActiveTaskList()
      })
      window.addEventListener('Aria2DownloadPause', () => this.getWaitingTaskList())
    },
    beforeDestroy() {
      clearTimeout(timer)
    }
  }
</script>
