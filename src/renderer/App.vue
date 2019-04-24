<template>
  <div id="app" style="display: flex;">
    <cv-svg></cv-svg>
    <cv-aside></cv-aside>
    <router-view/>
  </div>
</template>

<script>
  import Svg from 'src/renderer/components/Svg'
  import Aside from 'src/renderer/components/Aside'

  export default {
    components: {
      [Svg.name]: Svg,
      [Aside.name]: Aside
    }
  }
</script>
