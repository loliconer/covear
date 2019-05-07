<template>
  <div class="panel-about">
    <div class="app-info">
      <div class="i-version">Version {{version}}</div>
      <div class="i-engine">
        <div class="e-version">引擎版本 {{engine.version}}</div>
        <div class="e-features">
          <div class="e-feature" v-for="f of engine.enabledFeatures">{{f}}</div>
        </div>
      </div>
    </div>

    <div class="app-copyright">
      <a href="" target="_blank">&copy;2019 Covear</a>
    </div>
  </div>
</template>

<script>
  import {remote} from 'electron'

  export default {
    name: 'About',
    data() {
      return {
        version: remote.app.getVersion(),
        engine: {
          version: '4.3.3',
          enabledFeatures: []
        }
      }
    }
  }
</script>
