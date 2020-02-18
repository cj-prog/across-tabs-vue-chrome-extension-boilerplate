<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div style="height: 100%">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'app',
    components: {
    },
    created: function () {
      // eslint-disable-next-line no-console
      console.log("CREATED")
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
