<template>
  <div class="pf-advanced">
    <h4>高级设置</h4>
    <div class="pf-content">
      <label class="label"></label>
      <div style="display: flex;">
        <v-checkbox label="隐藏菜单栏（仅支持 Windows 和 Linux）"></v-checkbox>
      </div>
      <label class="label l-start">代理</label>
      <div class="cell-proxy">
        <div class="c-row">
          <v-switch></v-switch>
          <span>使用代理服务器</span>
        </div>
        <div class="c-row">
          <v-input></v-input>
        </div>
      </div>
      <label class="label l-start">开发者</label>
      <div class="cell-dev">
        <div class="c-row">
          <div class="r-label">应用日志路径</div>
          <v-input disabled></v-input>
        </div>
        <div class="c-row">
          <div class="r-label">下载会话路径</div>
          <v-input disabled></v-input>
        </div>
        <div class="c-row">
          <v-button type="danger">恢复初始设置</v-button>
        </div>
      </div>
    </div>

    <div class="pf-bottom">
      <v-button>保存并应用</v-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Advanced'
  }
</script>
