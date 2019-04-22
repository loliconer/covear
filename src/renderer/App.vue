<template>
  <div id="app">
    <cv-svg></cv-svg>
    <router-view/>
  </div>
</template>

<script>
  import Svg from 'src/renderer/components/Svg'

  export default {
    components: {
      [Svg.name]: Svg
    }
  }
</script>
