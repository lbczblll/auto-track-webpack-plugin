<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld  msg="Welcome to Your Vue.js App"/>
    <button v-if="btnShow('111111')" class="rowAc textBtn pointer posRelative"  @click="handleClassRoom">新建教室</button>
    <div v-if="btnShow('222222')">
      <div class="test">
        <div>
          <img src="./assets/logo.png" />
        </div>
        <span @click="handleCampus">新建校区</span>
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {
    btnShow(type) {
      if (type == '222222') {
        return true
      } else {
        return false
      }
    },
    handleClassRoom() {
      console.log('新建教室')
    },
    handleCampus() {
      console.log('新建校区')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
