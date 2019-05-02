<template>
  <div class="page-task container">
    <div class="p-aside">
      <h3>任务列表</h3>
      <div class="a-menu">
        <router-link class="m-item" to="/task/active"><v-icon icon="play"></v-icon>下载中</router-link>
        <router-link class="m-item" to="/task/stopped"><v-icon icon="check-circle-color"></v-icon>已完成</router-link>
        <router-link class="m-item" to="/task/trash"><v-icon icon="delete"></v-icon>已删除</router-link>
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
