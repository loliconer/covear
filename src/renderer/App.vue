<template>
  <div id="app" style="display: flex;">
    <cv-aside></cv-aside>
    <router-view/>
  </div>
</template>

<script>
  import Aside from 'src/renderer/components/Aside'

  export default {
    components: {
      [Aside.name]: Aside
    }
  }
</script>
