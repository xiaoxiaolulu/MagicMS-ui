<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    created() {document.title="MagicMs";},
    name: 'App',
  }
</script>

<style lang="less">
  @import './assets/App.less';
</style>
