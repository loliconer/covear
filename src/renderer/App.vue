<template>
  <div id="app" style="display: flex;">
    <cv-aside></cv-aside>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import Aside from 'src/renderer/components/Aside'

  export default {
    components: {
      [Aside.name]: Aside
    },
    created() {
      this.$router.push('/task/active')
    }
  }
</script>
