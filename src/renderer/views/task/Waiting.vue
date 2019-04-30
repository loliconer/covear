<template>
  <div class="task-active">
    <header class="task-header">
      <div class="task-title">等待中</div>
      <div class="task-actions">
        <span title="刷新任务列表"><v-icon icon="cv-refresh"></v-icon></span>
      </div>
    </header>

    <div class="task-content">
      <div class="task-list">
        <div class="task-item" v-for="task of taskList">
          <div class="i-above">
            <div class="i-name">{{task.name}}</div>
            <div class="i-actions"></div>
          </div>
          <div class="i-bottom">
            <div class="i-size">{{task.totalLength}}</div>
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
  import {bytesToSize} from 'src/shared/utils'

  let timer

  export default {
    name: 'Waiting',
    data() {
      return {
        taskList: []
      }
    },
    methods: {
      async getTaskList() {
        const body = await engine.fetchWaitingTaskList().catch(this.error)
        if (body === undefined) return

        if (!body.length) return clearTimeout(timer)

        this.taskList = body.map(row => ({
          name: path.basename(row.files[0].path),
          totalLength: bytesToSize(row.totalLength),
          gid: row.gid,
          dir: row.dir
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
