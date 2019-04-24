<template>
  <div class="page-preference container">
    <div class="p-aside">
      <h3>偏好设置</h3>
      <div class="a-menu">
        <router-link class="m-item" to="/preference/basic"><v-icon icon="cv-basic" size="16"></v-icon>基础设置</router-link>
        <router-link class="m-item" to="/preference/advanced"><v-icon icon="cv-advanced" size="16"></v-icon>高级设置</router-link>
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
