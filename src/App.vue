<template>
  <div id="app">
      <router-view></router-view>
    <FooterGuide v-show="$route.meta.showFooter"></FooterGuide>
  </div>
</template>

<script>

import FooterGuide from './components/FooterGuide/FooterGuide.vue'

export default {
  name: 'App',
  components: {
    FooterGuide
  },
  created(){
    // 创建App组件后立刻获取地址数据
    this.$store.dispatch('getAddress')
    // 立刻异步获取用户信息
    this.$store.dispatch('getUserInfo')
  }
  
  
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  #app
    width 100%
    height 100%
    background #f5f5f5
    position relative
</style>
