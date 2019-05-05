<template>
  <div class="page-task task-stopped">
    <header class="task-header">
      <div class="task-title">已完成</div>
      <div class="task-actions">
      </div>
    </header>

    <div class="task-content">
      <div class="task-list">
        <div class="task-item" v-for="task of taskList">
          <div class="i-above">
            <div class="i-name">{{task.name}}</div>
            <div class="i-actions">
              <v-icon icon="opened_folder-flat" @click="openFileFolder(task.path)"></v-icon>
            </div>
          </div>
          <div class="i-bottom">
            <div class="i-size">{{task.completedLength}} / {{task.totalLength}}</div>
          </div>
        </div>
      </div>
      <div class="no-task" v-if="!taskList.length">当前没有下载任务</div>
    </div>
  </div>
</template>

<script>
  import {shell} from 'electron'
  import engine from 'src/renderer/js/engine'
  import path from 'path'
  import {bytesToSize, calcProgress} from 'src/shared/utils'

  export default {
    name: 'Stopped',
    data() {
      return {
        taskList: []
      }
    },
    methods: {
      async getTaskList() {
        const body = await engine.fetchStoppedTaskList().catch(this.error)
        if (body === undefined) return

        this.taskList = body.map(row => ({
          name: path.basename(row.files[0].path),
          path: row.files[0].path,
          completedLength: bytesToSize(row.completedLength),
          totalLength: bytesToSize(row.totalLength),
          gid: row.gid,
          dir: row.dir
        }))
      },
      openFileFolder(path) {
        shell.showItemInFolder(path)
      }
    },
    created() {
      this.getTaskList()
    }
  }
</script>
