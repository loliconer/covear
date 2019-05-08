<template>
  <div class="cv-progress">
    <div class="layer-1"></div>
    <div class="layer-2" :style="`width:${progress}%;`"></div>
  </div>
</template>
<script>
  export default {
    name: 'cv-progress',
    props: {
      value: Number,
      decimal: Boolean,
      type: String
    },
    computed: {
      progress() {
        if (this.decimal) {
          return Math.trunc(this.value * 10000) / 100
        } else {
          return this.value * 100 | 0
        }
      }
    }
  }
</script>
