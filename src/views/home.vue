<template>
  <div class="home">
    <top-nav></top-nav>
<!--    <top-nav></top-nav>-->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '../components/HelloWorld.vue'
import TopNav from "./TopNav";

export default {
  name: 'home',
  components: {
    TopNav,
    HelloWorld
  }
}
</script>
