<template>
  <div class="task-active">
    <header class="task-header">
      <div class="task-title">下载中</div>
      <div class="task-actions">
        <span title="刷新任务列表"><v-icon icon="cv-refresh"></v-icon></span>
        <span title="恢复所有任务"><v-icon icon="cv-start-line"></v-icon></span>
        <span title="暂停所有任务"><v-icon icon="cv-pause-line"></v-icon></span>
      </div>
    </header>

    <div class="task-content">
      <div class="task-list">
        <div class="task-item" v-for="task of taskList">
          <div class="i-above">
            <div class="i-name">{{task.name}}</div>
            <div class="i-actions"></div>
          </div>
          <div class="i-progress"></div>
          <div class="i-bottom">
            <div class="i-size">{{task.completedLength}} / {{task.totalLength}}</div>
            <div class="i-speed">
              <span>{{task.downloadSpeed}}/s</span>
              <span>剩余 {{task.remaining}}s</span>
            </div>
          </div>
        </div>
      </div>
      <div class="no-task" v-if="!taskList.length">当前没有下载任务</div>
    </div>
  </div>
</template>

<script>
  import engine from 'src/renderer/js/engine'
  import path from 'path'
  import {bytesToSize, calcProgress, timeRemaining} from 'src/shared/utils'

  let timer

  export default {
    name: 'Active',
    data() {
      return {
        taskList: []
      }
    },
    methods: {
      async getTaskList() {
        const body = await engine.fetchActiveTaskList().catch(this.error)
        if (body === undefined) return

        if (!body.length) return clearTimeout(timer)

        this.taskList = body.map(row => ({
          name: path.basename(row.files[0].path),
          completedLength: bytesToSize(row.completedLength),
          totalLength: bytesToSize(row.totalLength),
          downloadSpeed: bytesToSize(row.downloadSpeed),
          gid: row.gid,
          connections: row.connections,
          dir: row.dir,
          remaining: timeRemaining(row.totalLength, row.completedLength, row.downloadSpeed)
        }))

        timer = setTimeout(() => this.getTaskList(), 500)
      }
    },
    created() {
      this.getTaskList()
    },
    beforeDestroy() {
      clearTimeout(timer)
    }
  }
</script>
