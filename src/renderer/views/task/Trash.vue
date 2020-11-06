<template>
  <div class="page-task task-stopped">
    <header class="task-header">
      <div class="task-title">已删除</div>
      <div class="task-actions">
      </div>
    </header>

    <div class="task-content">
      <div class="task-list">
        <div class="task-item" v-for="task of taskList">
          <div class="i-above">
            <div class="i-name">{{ task.name }}</div>
            <div class="i-actions">
              <v-icon icon="opened_folder-flat" @click="openFileFolder(task.path)"></v-icon>
            </div>
          </div>
          <div class="i-bottom">
            <div class="i-size">{{ task.completedLength }} / {{ task.totalLength }}</div>
          </div>
        </div>
      </div>
      <div class="no-task" v-if="!taskList.length">当前没有下载任务</div>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { shell } from 'electron'
import { bytesToSize } from 'src/shared/utils'

export default {
  name: 'Trash',
  data() {
    return {
      taskList: []
    }
  },
  methods: {
    async getTaskList() {
      //stopped, complete, removed
      const body = await client.send('tellStopped', 0, 20).catch(this.error)
      if (body === undefined) return

      this.taskList = body.filter(row => {
        return (row.status === 'removed') && ((row.bittorrent && row.bittorrent.info) || !row.bittorrent)
      }).map(row => {
        const result = {
          gid: row.gid,
          totalLength: bytesToSize(row.totalLength),
          completedLength: bytesToSize(row.completedLength),
          dir: row.dir,
          focus_: false
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
    openFileFolder(filPath) {
      shell.showItemInFolder(path.normalize(filPath))
    }
  },
  created() {
    this.getTaskList()
  }
}
</script>
