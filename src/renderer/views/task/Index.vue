<template>
  <div class="page-task container">
    <div class="p-aside">
      <h3>任务列表</h3>
      <div class="a-menu">
        <router-link class="m-item" to="/task/active"><v-icon icon="cv-start" size="16"></v-icon>下载中</router-link>
        <router-link class="m-item" to="/task/waiting"><v-icon icon="cv-pause" size="16"></v-icon>等待中</router-link>
        <router-link class="m-item" to="/task/stopped"><v-icon icon="cv-stop" size="16"></v-icon>已停止</router-link>
      </div>
    </div>

    <div class="p-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Preference'
  }
</script>
