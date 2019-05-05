<template>
  <div class="page-preference">
    <div class="p-aside">
      <div class="a-menu">
        <router-link class="m-item" to="/preference/basic">基础设置</router-link>
        <router-link class="m-item" to="/preference/advanced">高级设置</router-link>
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
