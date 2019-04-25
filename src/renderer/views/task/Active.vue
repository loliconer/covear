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
            <div class="i-size">
              <template v-if="task.totalLength > 0">
                {{task.completedLength}} / {{task.totalLength}}
              </template>
            </div>
            <div class="i-speed">
              <span>{{task.downloadSpeed}}/s</span>
              <span>剩余 {{task.remaining}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="no-task" v-if="!taskList.length">当前没有下载任务</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Active',
    data() {
      return {
        taskList: [
          {
            name: 'ubuntu-18.04-live-server-amd64.iso',
            totalLength: 812,
            completedLength: 87,
            downloadSpeed: '19.5MB',
            remaining: '38'
          }
        ]
      }
    }
  }
</script>
