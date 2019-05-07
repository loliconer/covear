<template>
  <div class="page-task task-stopped">
    <header class="task-header">
      <div class="task-title">已完成</div>
      <div class="task-actions">
        <v-icon icon="close" @click="clearTasks"></v-icon>
      </div>
    </header>

    <div class="task-content">
      <div class="task-list">
        <div class="task-item" :class="{focus: task.focus_}" v-for="task of taskList" @click="selectTask(task)">
          <div class="i-above">
            <div class="i-name">{{task.name}}</div>
            <div class="i-actions" @click.stop>
              <v-icon icon="opened-folder-color" @click="openFileFolder(task.path)"></v-icon>
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
  import path from 'path'
  import {bytesToSize} from 'src/shared/utils'

  export default {
    name: 'Stopped',
    data() {
      return {
        taskList: [],
        selected: []
      }
    },
    methods: {
      async getTaskList() {
        const body = await client.send('tellStopped', 0, 20).catch(this.error)
        if (body === undefined) return

        this.taskList = body.map(row => ({
          name: path.basename(row.files[0].path),
          path: row.files[0].path,
          completedLength: bytesToSize(row.completedLength),
          totalLength: bytesToSize(row.totalLength),
          gid: row.gid,
          dir: row.dir,
          focus_: false
        }))
      },
      openFileFolder(filPath) {
        shell.showItemInFolder(path.normalize(filPath))
      },
      selectTask(task) {
        if (task.focus_) return

        task.focus_ = true
        this.selected = [task]
      },
      async clearTasks() {
        const {selected} = this
        if (!selected.length) return this.warn('没有选中的任务')

        await client.multi(selected.map(task => ['removeDownloadResult', task.gid])).catch(this.error)
        this.getTaskList()
      }
    },
    created() {
      this.getTaskList()
    }
  }
</script>
