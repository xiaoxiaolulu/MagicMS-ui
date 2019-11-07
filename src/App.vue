<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import TopNav from './views/TopNav'
  export default {
    created() {document.title="MagicMs";},
    name: 'App',
    components: {
      TopNav
    }
  }
</script>

<style lang="less">
  @import './assets/App.less';
</style>
