<template>
  <div class="task-stopped">
    <header class="task-header">
      <div class="task-title">已停止</div>
      <div class="task-actions">
        <span title="刷新任务列表"><v-icon icon="cv-refresh"></v-icon></span>
        <span title="恢复所有任务"><v-icon icon="cv-start-line"></v-icon></span>
        <span title="暂停所有任务"><v-icon icon="cv-pause-line"></v-icon></span>
      </div>
    </header>

    <div class="task-content">
      <div class="no-task">当前没有下载任务</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Stopped'
  }
</script>
