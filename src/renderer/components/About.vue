<template>
  <div class="panel-about">
    <div class="app-info">
      <div class="i-engine">
        <div class="e-version">Aria2 版本 {{engine.version}}</div>
        <div class="e-features">
          <div class="f-title">Aria2 特性</div>
          <ul class="f-list">
            <li class="l-item" v-for="f of engine.enabledFeatures">{{f}}</li>
          </ul>
        </div>
      </div>

      <div class="i-logo">
        <img src="/img/logo.svg">
        <p>版本 {{version}}</p>
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
          version: '',
          enabledFeatures: []
        }
      }
    },
    methods: {
      async getEngineVersion() {
        const body = await client.send('getVersion').catch(this.error)
        if (body === undefined) return

        this.engine = body
      }
    },
    created() {
      this.getEngineVersion()
    }
  }
</script>
