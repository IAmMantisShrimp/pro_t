<template>
  <div id="app">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
 #app{
   /*将app容器最小高度设为100vh*/
   min-height: 100vh;
 }
</style>
