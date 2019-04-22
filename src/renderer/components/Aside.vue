<template>
  <aside class="cv-aside">
    <div class="a-menu">
      <router-link class="m-item" to="/task"><v-icon icon="cv-task"></v-icon></router-link>
      <div class="m-item"><v-icon icon="cv-add"></v-icon></div>
    </div>

    <div class="a-menu">
      <router-link class="m-item" to="/preference"><v-icon icon="cv-preference"></v-icon></router-link>
      <div class="m-item" @click="showAboutPanel"><v-icon icon="cv-about"></v-icon></div>
    </div>

    <v-popup v-model="isShowAboutPanel">

    </v-popup>
  </aside>
</template>

<script>
  export default {
    name: 'cv-aside',
    data() {
      return {
        isShowAboutPanel: false
      }
    },
    methods: {
      showAboutPanel() {
        this.isShowAboutPanel = true
      }
    }
  }
</script>
