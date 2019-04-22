<template>
  <div class="page-home">
    <div class="container">
      <cv-aside></cv-aside>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import Aside from 'src/renderer/components/Aside'

  export default {
    name: 'home',
    components: {
      [Aside.name]: Aside
    }
  }
</script>
